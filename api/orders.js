import crypto from "node:crypto";

const plans = {
  essential: { id: "essential", name: "Canción Esencial", price: "Desde $19.990", amount: 19990 },
  premium: { id: "premium", name: "Canción Premium", price: "Desde $34.990", amount: 34990 },
  experience: { id: "experience", name: "Canción Experiencia", price: "Desde $54.990", amount: 54990 },
};

const paymentStatuses = ["pending", "paid", "failed", "refunded"];
const orderStatuses = [
  "received",
  "payment_confirmed",
  "in_production",
  "lyrics_review",
  "music_production",
  "ready_for_delivery",
  "delivered",
  "revision_requested",
  "closed",
];

const store = globalThis;
store.__REGALA_MUSICA_ORDERS__ ||= [];

function sendJson(response, status, body) {
  response.status(status).setHeader("Cache-Control", "no-store");
  response.json(body);
}

async function readBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") return JSON.parse(request.body || "{}");

  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function getOrderId(request) {
  if (typeof request.query?.id === "string") return request.query.id;
  const [, orderId] = request.url.split("/api/orders/");
  return orderId?.split("?")[0] || "";
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

function validateOrder(payload) {
  const errors = {};
  const selectedPlan = plans[payload.selectedPlan] || plans[payload.planId];

  if (!selectedPlan) errors.selectedPlan = "Selecciona un plan.";
  if (!payload.customerName?.trim() && !payload.name?.trim()) errors.customerName = "Ingresa tu nombre.";

  const email = payload.customerEmail || payload.email || "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.customerEmail = "Ingresa un email válido.";

  if (!payload.recipientName?.trim() && !payload.recipient?.trim()) {
    errors.recipientName = "Ingresa el nombre de la persona.";
  }
  if (!payload.relationship?.trim() && !payload.recipient?.trim()) errors.relationship = "Indica la relación.";
  if (!payload.occasion?.trim()) errors.occasion = "Indica la ocasión.";
  if ((payload.story || "").trim().length < 20) errors.story = "Cuéntanos al menos 20 caracteres de la historia.";
  if (!payload.tone?.trim() && !payload.style?.trim()) errors.tone = "Selecciona un tono.";
  if (!payload.musicStyle?.trim() && !payload.style?.trim()) errors.musicStyle = "Selecciona un estilo musical.";

  return { errors, selectedPlan };
}

function emitOrderEvent(eventName, order) {
  console.info(`[order:event] ${eventName}`, order.id);
  // Future integrations:
  // onOrderCreated, onPaymentConfirmed, onProductionStarted, onSongReady,
  // onRevisionRequested, onOrderDelivered.
}

function normalizeOrder(payload, selectedPlan) {
  const now = new Date().toISOString();

  return {
    id: `ord_${crypto.randomUUID().slice(0, 8)}`,
    customerName: (payload.customerName || payload.name || "").trim(),
    customerEmail: (payload.customerEmail || payload.email || "").trim().toLowerCase(),
    customerWhatsapp: (payload.customerWhatsapp || payload.phone || "").trim(),
    recipientName: (payload.recipientName || payload.recipient || "").trim(),
    relationship: (payload.relationship || payload.recipient || "").trim(),
    occasion: (payload.occasion || "Regalo personalizado").trim(),
    neededDate: payload.neededDate || "",
    story: payload.story.trim(),
    keyMoments: payload.keyMoments || "",
    phrasesToInclude: payload.phrasesToInclude || payload.message || "",
    thingsToAvoid: payload.thingsToAvoid || "",
    tone: payload.tone || "Emotivo",
    musicStyle: payload.musicStyle || payload.style || "",
    references: payload.references || "",
    selectedPlan: selectedPlan.id,
    planName: selectedPlan.name,
    price: selectedPlan.amount,
    paymentStatus: "pending",
    orderStatus: "received",
    estimatedDeliveryDate: addDays(now, selectedPlan.id === "essential" ? 5 : selectedPlan.id === "premium" ? 7 : 10),
    internalNotes: "",
    songUrl: "",
    finalSongUrl: "",
    coverUrl: "",
    lyricVideoUrl: "",
    payment: null,
    createdAt: now,
    updatedAt: now,
  };
}

export default async function handler(request, response) {
  const orderId = getOrderId(request);

  if (request.method === "GET" && !orderId) {
    sendJson(response, 200, { ok: true, orders: store.__REGALA_MUSICA_ORDERS__ });
    return;
  }

  if (request.method === "GET" && orderId) {
    const order = store.__REGALA_MUSICA_ORDERS__.find((item) => item.id === orderId);
    sendJson(response, order ? 200 : 404, order ? { ok: true, order } : { ok: false });
    return;
  }

  if (request.method === "POST" && !orderId) {
    try {
      const payload = await readBody(request);
      const { errors, selectedPlan } = validateOrder(payload);

      if (Object.keys(errors).length) {
        sendJson(response, 422, { ok: false, errors });
        return;
      }

      const order = normalizeOrder(payload, selectedPlan);
      store.__REGALA_MUSICA_ORDERS__.unshift(order);
      emitOrderEvent("order_created", order);
      sendJson(response, 201, { ok: true, order });
    } catch {
      sendJson(response, 400, { ok: false, message: "No pudimos procesar el pedido." });
    }
    return;
  }

  if (request.method === "PATCH" && orderId) {
    const payload = await readBody(request);
    const index = store.__REGALA_MUSICA_ORDERS__.findIndex((order) => order.id === orderId);

    if (index === -1) {
      sendJson(response, 404, { ok: false, message: "Pedido no encontrado." });
      return;
    }

    const current = store.__REGALA_MUSICA_ORDERS__[index];
    const nextStatus = payload.orderStatus || current.orderStatus;
    const nextPaymentStatus = payload.paymentStatus || current.paymentStatus;
    const safeStatus = orderStatuses.includes(nextStatus) ? nextStatus : current.orderStatus;
    const safePaymentStatus = paymentStatuses.includes(nextPaymentStatus) ? nextPaymentStatus : current.paymentStatus;
    const updated = {
      ...current,
      orderStatus: safeStatus,
      paymentStatus: safePaymentStatus,
      internalNotes: payload.internalNotes ?? current.internalNotes,
      songUrl: payload.songUrl ?? payload.finalSongUrl ?? current.songUrl,
      finalSongUrl: payload.finalSongUrl ?? current.finalSongUrl,
      coverUrl: payload.coverUrl ?? current.coverUrl,
      lyricVideoUrl: payload.lyricVideoUrl ?? current.lyricVideoUrl,
      payment:
        safePaymentStatus === "paid" && current.paymentStatus !== "paid"
          ? {
              id: `pay_${crypto.randomUUID().slice(0, 8)}`,
              provider: "Regala Música Demo Gateway",
              status: "approved",
              amount: current.price,
              currency: "CLP",
              createdAt: new Date().toISOString(),
            }
          : current.payment,
      updatedAt: new Date().toISOString(),
    };

    store.__REGALA_MUSICA_ORDERS__[index] = updated;
    if (updated.paymentStatus === "paid" && current.paymentStatus !== "paid") emitOrderEvent("payment_confirmed", updated);
    if (updated.orderStatus === "delivered") emitOrderEvent("order_delivered", updated);
    sendJson(response, 200, { ok: true, order: updated });
    return;
  }

  response.setHeader("Allow", "GET, POST, PATCH");
  sendJson(response, 405, { ok: false, message: "Método no permitido." });
}
