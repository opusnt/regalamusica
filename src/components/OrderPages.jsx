import { useEffect, useState } from "react";
import { ArrowLeft, Download, Gift, Music2, PartyPopper, ShieldCheck } from "lucide-react";
import { orderStatuses, publicOrderStatusLabels, statusIcons } from "../data/site.js";
import { analyticsEvents, trackEvent } from "../lib/analytics.js";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-CL", { dateStyle: "medium" }).format(new Date(value));
}

function formatPrice(amount) {
  if (!amount) return "-";
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(amount);
}

async function fetchOrder(orderId, setOrder) {
  if (!orderId) return;
  const response = await fetch(`/api/orders/${orderId}`);
  const data = await response.json();
  setOrder(data.order || null);
}

export function CheckoutPage() {
  const orderId = new URLSearchParams(window.location.search).get("order");
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    fetchOrder(orderId, setOrder);
    trackEvent(analyticsEvents.beginCheckout, { orderId });
  }, [orderId]);

  const updatePayment = async (paymentStatus, orderStatus) => {
    if (!orderId) return;
    setStatus("loading");
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus, orderStatus }),
    });

    if (paymentStatus === "paid") {
      trackEvent(analyticsEvents.paymentSuccess, { orderId, plan: order?.selectedPlan });
      window.location.href = `/success?order=${orderId}`;
      return;
    }

    trackEvent(analyticsEvents.paymentCancelled, { orderId });
    if (response.ok) window.location.href = `/cancelled?order=${orderId}`;
    setStatus("idle");
  };

  return (
    <main className="min-h-screen bg-night px-5 py-10 text-soft sm:px-8">
      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div className="rounded-lg border border-soft/10 bg-[#10141e] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase text-accent">Checkout demo</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight">Pagar y comenzar mi canción</h1>
          <p className="mt-4 text-base leading-7 text-soft/68">
            Esta pantalla queda separada para conectar Webpay, Mercado Pago o Stripe. Por ahora puedes simular el resultado del pago.
          </p>
          <div className="mt-8 grid gap-3 rounded-lg border border-soft/10 bg-night/60 p-5 text-sm">
            <Row label="Pedido" value={order?.id || orderId || "-"} />
            <Row label="Para" value={order?.recipientName || "-"} />
            <Row label="Ocasión" value={order?.occasion || "-"} />
            <Row label="Plan" value={order?.planName || order?.selectedPlan || "-"} />
            <Row label="Total" value={formatPrice(order?.price)} />
            <Row label="Estado" value={order?.paymentStatus === "paid" ? "Pago confirmado" : "Pago pendiente"} />
          </div>
        </div>
        <div className="rounded-lg border border-accent/30 bg-accent/10 p-6 sm:p-8">
          <ShieldCheck className="size-9 text-accent" aria-hidden="true" />
          <h2 className="mt-4 text-2xl font-semibold">Modo development</h2>
          <p className="mt-3 text-sm leading-6 text-soft/68">
            Usa estos botones solo mientras conectamos la pasarela real. El pedido se crea con pago pendiente y cambia de estado después del pago.
          </p>
          <div className="mt-6 grid gap-3">
            <button
              type="button"
              disabled={status === "loading" || !orderId}
              onClick={() => updatePayment("paid", "payment_confirmed")}
              className="min-h-12 rounded-md bg-accent px-5 py-3 font-semibold text-night hover:bg-[#ffd46a] disabled:opacity-50"
            >
              Simular pago exitoso
            </button>
            <button
              type="button"
              disabled={status === "loading" || !orderId}
              onClick={() => updatePayment("failed", "received")}
              className="min-h-12 rounded-md border border-soft/15 px-5 py-3 font-semibold text-soft hover:border-accent hover:text-accent disabled:opacity-50"
            >
              Simular pago cancelado
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export function SuccessPage() {
  const [order, setOrder] = useState(null);
  const orderId = new URLSearchParams(window.location.search).get("order");

  useEffect(() => {
    fetchOrder(orderId, setOrder);
  }, [orderId]);

  return (
    <main className="min-h-screen bg-night px-5 py-16 text-soft sm:px-8">
      <section className="mx-auto max-w-3xl rounded-lg border border-accent/35 bg-accent/10 p-6 sm:p-8">
        <PartyPopper className="size-10 text-accent" aria-hidden="true" />
        <p className="mt-5 text-sm font-semibold uppercase text-accent">Pedido recibido</p>
        <h1 className="mt-3 text-4xl font-semibold">¡Recibimos tu historia!</h1>
        <p className="mt-4 text-lg leading-8 text-soft/72">
          Tu pedido fue recibido correctamente. Te enviaremos novedades por email y te avisaremos cuando tu canción esté en producción.
        </p>
        <p className="mt-4 rounded-md border border-soft/10 bg-night/50 p-4 text-sm text-soft/70">
          Ahora empieza la parte más linda: transformar tu historia en música.
        </p>
        <div className="mt-8 grid gap-3 rounded-lg border border-soft/10 bg-night/60 p-5 text-sm">
          <Row label="Número de pedido" value={order?.id || orderId || "-"} />
          <Row label="Plan comprado" value={order?.planName || order?.selectedPlan || "-"} />
          <Row label="Estado" value="Pedido recibido" />
          <Row label="Email" value={order?.customerEmail || "-"} />
          <Row label="Fecha estimada de entrega" value={formatDate(order?.estimatedDeliveryDate)} />
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a href={`/order/${orderId}`} className="inline-flex min-h-12 items-center justify-center rounded-md bg-accent px-5 py-3 font-semibold text-night hover:bg-[#ffd46a]">
            Ver mi pedido
          </a>
          <a href="/" className="inline-flex min-h-12 items-center justify-center rounded-md border border-soft/15 px-5 py-3 font-semibold text-soft hover:border-accent hover:text-accent">
            Volver al inicio
          </a>
        </div>
      </section>
    </main>
  );
}

export function CancelledPage() {
  const orderId = new URLSearchParams(window.location.search).get("order");

  return (
    <main className="min-h-screen bg-night px-5 py-16 text-soft sm:px-8">
      <section className="mx-auto max-w-3xl rounded-lg border border-soft/10 bg-[#10141e] p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase text-accent">Pago cancelado</p>
        <h1 className="mt-4 text-4xl font-semibold">Tu pedido quedó pendiente</h1>
        <p className="mt-4 text-lg leading-8 text-soft/72">
          No se realizó ningún cargo. Puedes volver al checkout cuando quieras para completar tu canción personalizada.
        </p>
        <a href={orderId ? `/checkout?order=${orderId}` : "/crear"} className="mt-7 inline-flex min-h-12 items-center rounded-md bg-accent px-5 py-3 font-semibold text-night hover:bg-[#ffd46a]">
          Volver al checkout
        </a>
      </section>
    </main>
  );
}

export function OrderDetailPage() {
  const [order, setOrder] = useState(null);
  const orderId = window.location.pathname.split("/").pop();

  useEffect(() => {
    fetchOrder(orderId, setOrder);
  }, [orderId]);

  const visibleStatus = order ? publicOrderStatusLabels[order.orderStatus] || "Pedido recibido" : "Cargando";
  const Icon = order ? statusIcons[order.orderStatus] || Gift : Gift;
  const nextStep = getNextStep(order);
  const canRequestRevision = order && ["premium", "experience"].includes(order.selectedPlan);
  const downloadUrl = order?.songUrl || order?.finalSongUrl;

  return (
    <main className="min-h-screen bg-night px-5 py-12 text-soft sm:px-8">
      <section className="mx-auto max-w-5xl">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-soft/54 hover:text-accent">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver al inicio
        </a>
        <div className="mt-6 rounded-lg border border-soft/10 bg-[#10141e] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-accent">Seguimiento del pedido</p>
              <h1 className="mt-3 text-3xl font-semibold">Pedido {orderId}</h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm font-semibold text-accent">
              <Icon className="size-4" aria-hidden="true" />
              {visibleStatus}
            </div>
          </div>
          {order ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
              <div className="rounded-lg border border-soft/10 bg-night/60 p-5">
                <h2 className="text-xl font-semibold">Datos principales</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <Row label="Para" value={`${order.recipientName} (${order.relationship})`} />
                  <Row label="Ocasión" value={order.occasion} />
                  <Row label="Plan" value={order.planName || order.selectedPlan} />
                  <Row label="Estilo" value={order.musicStyle} />
                  <Row label="Fecha estimada" value={formatDate(order.estimatedDeliveryDate)} />
                  <Row label="Próximo paso" value={nextStep} />
                </dl>
              </div>
              <div className="rounded-lg border border-soft/10 bg-night/60 p-5">
                <h2 className="text-xl font-semibold">Entrega</h2>
                {downloadUrl ? (
                  <a href={downloadUrl} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 font-semibold text-night hover:bg-[#ffd46a]">
                    <Download className="size-4" aria-hidden="true" />
                    Descargar canción
                  </a>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-soft/64">Cuando la canción esté lista, aquí aparecerá el link de descarga.</p>
                )}
                {canRequestRevision ? (
                  <button type="button" className="mt-4 min-h-11 w-full rounded-md border border-soft/15 px-4 py-2 font-semibold text-soft hover:border-accent hover:text-accent">
                    Solicitar ajuste
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="mt-8 text-soft/58">Cargando pedido...</p>
          )}
        </div>
      </section>
    </main>
  );
}

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data.orders || []));
  }, []);

  return (
    <main className="min-h-screen bg-night px-5 py-12 text-soft sm:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-accent">Admin básico</p>
            <h1 className="mt-2 text-4xl font-semibold">Órdenes</h1>
          </div>
          <a href="/" className="text-sm text-soft/56 hover:text-accent">Volver al sitio</a>
        </div>
        <div className="mt-8 overflow-x-auto rounded-lg border border-soft/10 bg-[#10141e]">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-soft/10 text-soft/52">
              <tr>
                {["ID", "Cliente", "Email", "Ocasión", "Destinatario", "Plan", "Pago", "Estado", "Creación", "Fecha requerida", "Acción"].map((head) => (
                  <th key={head} className="px-4 py-3 font-semibold">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-soft/6">
                  <td className="px-4 py-3">{order.id}</td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">{order.customerEmail}</td>
                  <td className="px-4 py-3">{order.occasion}</td>
                  <td className="px-4 py-3">{order.recipientName}</td>
                  <td className="px-4 py-3">{order.selectedPlan}</td>
                  <td className="px-4 py-3">{order.paymentStatus}</td>
                  <td className="px-4 py-3">{order.orderStatus}</td>
                  <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">{formatDate(order.neededDate)}</td>
                  <td className="px-4 py-3">
                    <a className="font-semibold text-accent" href={`/admin/orders/${order.id}`}>Ver detalle</a>
                  </td>
                </tr>
              ))}
              {!orders.length ? (
                <tr>
                  <td className="px-4 py-8 text-center text-soft/52" colSpan="11">Aún no hay pedidos.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export function AdminOrderDetailPage() {
  const [order, setOrder] = useState(null);
  const orderId = window.location.pathname.split("/").pop();

  useEffect(() => {
    fetchOrder(orderId, setOrder);
  }, [orderId]);

  return (
    <main className="min-h-screen bg-night px-5 py-12 text-soft sm:px-8">
      <section className="mx-auto max-w-6xl rounded-lg border border-soft/10 bg-[#10141e] p-6">
        <a href="/admin/orders" className="text-sm text-soft/54 hover:text-accent">Volver a órdenes</a>
        <h1 className="mt-4 text-3xl font-semibold">Pedido {orderId}</h1>
        {order ? <OrderFullDetail order={order} /> : <p className="mt-6 text-soft/58">Cargando pedido...</p>}
      </section>
    </main>
  );
}

export function GiftPage() {
  const slug = window.location.pathname.split("/").pop();

  return (
    <main className="min-h-screen bg-night px-5 py-12 text-soft sm:px-8">
      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div className="overflow-hidden rounded-lg border border-soft/10 bg-[#10141e]">
          <img src="/covers/para-mama-60.png" alt="Portada de canción personalizada" className="aspect-square w-full object-cover" />
        </div>
        <div className="rounded-lg border border-soft/10 bg-[#10141e] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase text-accent">Regalo privado</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight">Alguien convirtió una historia contigo en canción.</h1>
          <p className="mt-4 text-base leading-7 text-soft/68">
            Esta página queda preparada para mostrar portada, destinatario, dedicatoria, reproductor, letra, descarga y opciones para compartir.
          </p>
          <div className="mt-6 rounded-lg border border-soft/10 bg-night/60 p-4">
            <p className="text-sm text-soft/54">Slug preparado</p>
            <p className="mt-1 font-semibold text-soft">{slug}</p>
          </div>
          <button type="button" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-md bg-accent px-5 py-3 font-semibold text-night">
            <Music2 className="size-4" aria-hidden="true" />
            Reproducir regalo
          </button>
        </div>
      </section>
    </main>
  );
}

function OrderFullDetail({ order }) {
  const [form, setForm] = useState({
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    internalNotes: order.internalNotes || "",
    finalSongUrl: order.finalSongUrl || order.songUrl || "",
    coverUrl: order.coverUrl || "",
    lyricVideoUrl: order.lyricVideoUrl || "",
  });
  const [saved, setSaved] = useState(false);

  const save = async (override = {}) => {
    const payload = { ...form, ...override };
    const response = await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaved(response.ok);
    if (response.ok) setForm(payload);
  };

  const creativeRows = [
    ["Comprador", order.customerName],
    ["Email", order.customerEmail],
    ["WhatsApp", order.customerWhatsapp],
    ["Destinatario", order.recipientName],
    ["Relación", order.relationship],
    ["Ocasión", order.occasion],
    ["Fecha requerida", formatDate(order.neededDate)],
    ["Historia", order.story],
    ["Momentos importantes", order.keyMoments],
    ["Frases a incluir", order.phrasesToInclude],
    ["Cosas a evitar", order.thingsToAvoid],
    ["Tono", order.tone],
    ["Estilo", order.musicStyle],
    ["Referencias", order.references],
    ["Plan", order.planName || order.selectedPlan],
    ["Precio", formatPrice(order.price)],
  ];

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
      <div className="rounded-lg border border-soft/10 bg-night/60 p-5">
        <h2 className="text-xl font-semibold">Brief creativo</h2>
        <div className="mt-4 space-y-3 text-sm text-soft/72">
          {creativeRows.map(([key, value]) => (
            <Row key={key} label={key} value={value || "-"} />
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-soft/10 bg-night/60 p-5">
        <h2 className="text-xl font-semibold">Gestión interna</h2>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-soft/62">Estado de pago</span>
          <select className="checkout-input" value={form.paymentStatus} onChange={(event) => setForm({ ...form, paymentStatus: event.target.value })}>
            {["pending", "paid", "failed", "refunded"].map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-soft/62">Estado del pedido</span>
          <select className="checkout-input" value={form.orderStatus} onChange={(event) => setForm({ ...form, orderStatus: event.target.value })}>
            {orderStatuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-soft/62">Notas internas</span>
          <textarea className="checkout-input min-h-28 resize-none" value={form.internalNotes} onChange={(event) => setForm({ ...form, internalNotes: event.target.value })} />
        </label>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-soft/62">Link canción final</span>
          <input className="checkout-input" value={form.finalSongUrl} onChange={(event) => setForm({ ...form, finalSongUrl: event.target.value })} />
        </label>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-soft/62">Link portada</span>
          <input className="checkout-input" value={form.coverUrl} onChange={(event) => setForm({ ...form, coverUrl: event.target.value })} />
        </label>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-soft/62">Link video lyric</span>
          <input className="checkout-input" value={form.lyricVideoUrl} onChange={(event) => setForm({ ...form, lyricVideoUrl: event.target.value })} />
        </label>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => save()} className="rounded-md bg-accent px-5 py-3 font-semibold text-night">Guardar cambios</button>
          <button type="button" onClick={() => save({ orderStatus: "delivered" })} className="rounded-md border border-soft/15 px-5 py-3 font-semibold text-soft">Marcar como entregado</button>
        </div>
        {saved ? <p className="mt-3 text-sm text-accent">Cambios guardados.</p> : null}
      </div>
    </div>
  );
}

function getNextStep(order) {
  if (!order) return "-";
  if (order.paymentStatus !== "paid") return "Completar pago para comenzar la producción.";
  if (["received", "payment_confirmed"].includes(order.orderStatus)) return "Revisaremos tu historia y comenzaremos la producción.";
  if (["in_production", "lyrics_review", "music_production"].includes(order.orderStatus)) return "Estamos trabajando en la canción.";
  if (order.orderStatus === "ready_for_delivery") return "La canción está lista para entrega.";
  if (order.orderStatus === "revision_requested") return "Revisaremos los ajustes solicitados.";
  return "Tu pedido ya fue entregado.";
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-soft/8 pb-2">
      <dt className="text-soft/46">{label}</dt>
      <dd className="max-w-[62%] text-right text-soft/82">{value}</dd>
    </div>
  );
}
