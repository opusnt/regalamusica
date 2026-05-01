import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const dataDir = path.join(rootDir, "data");
const ordersFile = path.join(dataDir, "orders.json");
const port = Number(process.env.PORT || 3001);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
};

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

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(body));
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

async function readOrders() {
  if (!existsSync(ordersFile)) return [];
  return JSON.parse(await readFile(ordersFile, "utf8"));
}

async function saveOrders(orders) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(ordersFile, `${JSON.stringify(orders, null, 2)}\n`);
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
  if (!payload.recipientName?.trim() && !payload.recipient?.trim()) errors.recipientName = "Ingresa el nombre de la persona.";
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
  // Future emails:
  // Confirmación de pedido, Pago confirmado, Producción iniciada,
  // Canción lista, Solicitud de feedback, Recordatorio de formulario abandonado.
}

function normalizeOrder(payload, selectedPlan) {
  const now = new Date().toISOString();
  const order = {
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

  return order;
}

async function createOrder(request, response) {
  try {
    const payload = await readBody(request);
    const { errors, selectedPlan } = validateOrder(payload);

    if (Object.keys(errors).length) {
      sendJson(response, 422, { ok: false, errors });
      return;
    }

    const order = normalizeOrder(payload, selectedPlan);
    const orders = await readOrders();
    orders.unshift(order);
    await saveOrders(orders);
    emitOrderEvent("order_created", order);
    sendJson(response, 201, { ok: true, order });
  } catch {
    sendJson(response, 400, { ok: false, message: "No pudimos procesar el pedido." });
  }
}

async function updateOrder(request, response, orderId) {
  const payload = await readBody(request);
  const orders = await readOrders();
  const index = orders.findIndex((order) => order.id === orderId);

  if (index === -1) {
    sendJson(response, 404, { ok: false, message: "Pedido no encontrado." });
    return;
  }

  const current = orders[index];
  const nextStatus = payload.orderStatus || current.orderStatus;
  const safeStatus = orderStatuses.includes(nextStatus) ? nextStatus : current.orderStatus;
  const nextPaymentStatus = payload.paymentStatus || current.paymentStatus;
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

  orders[index] = updated;
  await saveOrders(orders);
  if (safePaymentStatus === "paid" && current.paymentStatus !== "paid") emitOrderEvent("payment_confirmed", updated);
  if (safeStatus === "delivered") emitOrderEvent("order_delivered", updated);
  sendJson(response, 200, { ok: true, order: updated });
}

async function serveStatic(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = decodeURIComponent(url.pathname);
  const filePath = requestedPath === "/" ? path.join(distDir, "index.html") : path.join(distDir, requestedPath);
  const safePath = path.normalize(filePath);

  if (!safePath.startsWith(distDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const data = await readFile(safePath);
    const ext = path.extname(safePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
    });
    response.end(data);
  } catch {
    const fallback = await readFile(path.join(distDir, "index.html"));
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(fallback);
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const orderDetailMatch = url.pathname.match(/^\/api\/orders\/([^/]+)$/);

  if (url.pathname === "/api/health") {
    sendJson(response, 200, { ok: true, service: "regalamusica-api" });
    return;
  }

  if (url.pathname === "/api/orders" && request.method === "GET") {
    sendJson(response, 200, { ok: true, orders: await readOrders() });
    return;
  }

  if ((url.pathname === "/api/orders" || url.pathname === "/api/checkout") && request.method === "POST") {
    await createOrder(request, response);
    return;
  }

  if (orderDetailMatch && request.method === "GET") {
    const orders = await readOrders();
    const order = orders.find((item) => item.id === orderDetailMatch[1]);
    sendJson(response, order ? 200 : 404, order ? { ok: true, order } : { ok: false });
    return;
  }

  if (orderDetailMatch && request.method === "PATCH") {
    await updateOrder(request, response, orderDetailMatch[1]);
    return;
  }

  await serveStatic(request, response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Regala Música preview + API running at http://127.0.0.1:${port}`);
});
