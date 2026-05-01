import { useEffect, useState } from "react";
import { orderStatuses } from "../data/site.js";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-CL", { dateStyle: "medium" }).format(new Date(value));
}

export function SuccessPage() {
  const [order, setOrder] = useState(null);
  const orderId = new URLSearchParams(window.location.search).get("order");

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${orderId}`)
      .then((response) => response.json())
      .then((data) => setOrder(data.order));
  }, [orderId]);

  return (
    <main className="min-h-screen bg-night px-5 py-16 text-soft sm:px-8">
      <section className="mx-auto max-w-3xl rounded-lg border border-accent/35 bg-accent/10 p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase text-accent">Pedido recibido</p>
        <h1 className="mt-4 text-4xl font-semibold">¡Recibimos tu historia!</h1>
        <p className="mt-4 text-lg leading-8 text-soft/72">
          Tu pedido fue recibido correctamente. Te enviaremos novedades por email y te avisaremos cuando tu canción esté en producción.
        </p>
        <div className="mt-8 grid gap-3 rounded-lg border border-soft/10 bg-night/60 p-5 text-sm">
          <Row label="Número de pedido" value={order?.id || orderId || "-"} />
          <Row label="Plan comprado" value={order?.selectedPlan || "-"} />
          <Row label="Fecha estimada de entrega" value={formatDate(order?.estimatedDeliveryDate)} />
          <Row label="Email" value={order?.customerEmail || "-"} />
          <Row label="Estado" value={order?.paymentStatus === "paid" ? "Pago confirmado" : "Pedido recibido"} />
        </div>
        <a href="/" className="mt-7 inline-flex min-h-12 items-center rounded-md bg-accent px-5 py-3 font-semibold text-night hover:bg-[#ffd46a]">
          Volver al inicio
        </a>
      </section>
    </main>
  );
}

export function CancelledPage() {
  return (
    <main className="min-h-screen bg-night px-5 py-16 text-soft sm:px-8">
      <section className="mx-auto max-w-3xl rounded-lg border border-soft/10 bg-[#101010] p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase text-accent">Pago cancelado</p>
        <h1 className="mt-4 text-4xl font-semibold">Tu pedido quedó pendiente</h1>
        <p className="mt-4 text-lg leading-8 text-soft/72">
          No se realizó ningún cargo. Puedes volver al checkout cuando quieras para completar tu canción personalizada.
        </p>
        <a href="/checkout" className="mt-7 inline-flex min-h-12 items-center rounded-md bg-accent px-5 py-3 font-semibold text-night hover:bg-[#ffd46a]">
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
    fetch(`/api/orders/${orderId}`)
      .then((response) => response.json())
      .then((data) => setOrder(data.order));
  }, [orderId]);

  return (
    <main className="min-h-screen bg-night px-5 py-12 text-soft sm:px-8">
      <section className="mx-auto max-w-5xl rounded-lg border border-soft/10 bg-[#101010] p-6">
        <a href="/admin/orders" className="text-sm text-soft/54 hover:text-accent">Volver a órdenes</a>
        <h1 className="mt-4 text-3xl font-semibold">Pedido {orderId}</h1>
        {order ? <OrderFullDetail order={order} /> : <p className="mt-6 text-soft/58">Cargando pedido...</p>}
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
        <div className="mt-8 overflow-x-auto rounded-lg border border-soft/10 bg-[#101010]">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-soft/10 text-soft/52">
              <tr>
                {["ID pedido", "Cliente", "Email", "Ocasión", "Plan", "Pago", "Estado", "Creación", "Estimada", "Acción"].map((head) => (
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
                  <td className="px-4 py-3">{order.selectedPlan}</td>
                  <td className="px-4 py-3">{order.paymentStatus}</td>
                  <td className="px-4 py-3">{order.orderStatus}</td>
                  <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">{formatDate(order.estimatedDeliveryDate)}</td>
                  <td className="px-4 py-3">
                    <a className="font-semibold text-accent" href={`/order/${order.id}`}>Ver detalle</a>
                  </td>
                </tr>
              ))}
              {!orders.length ? (
                <tr>
                  <td className="px-4 py-8 text-center text-soft/52" colSpan="10">Aún no hay pedidos.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function OrderFullDetail({ order }) {
  const [form, setForm] = useState({
    orderStatus: order.orderStatus,
    internalNotes: order.internalNotes || "",
    finalSongUrl: order.finalSongUrl || "",
    coverUrl: order.coverUrl || "",
  });
  const [saved, setSaved] = useState(false);

  const save = async () => {
    const response = await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(response.ok);
  };

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
      <div className="rounded-lg border border-soft/10 bg-night/60 p-5">
        <h2 className="text-xl font-semibold">Brief creativo</h2>
        <div className="mt-4 space-y-3 text-sm text-soft/72">
          {Object.entries(order).map(([key, value]) => (
            <Row key={key} label={key} value={typeof value === "object" ? JSON.stringify(value) : value || "-"} />
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-soft/10 bg-night/60 p-5">
        <h2 className="text-xl font-semibold">Gestión interna</h2>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-soft/62">Estado editable</span>
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
          <span className="mb-2 block text-sm text-soft/62">Link portada/video</span>
          <input className="checkout-input" value={form.coverUrl} onChange={(event) => setForm({ ...form, coverUrl: event.target.value })} />
        </label>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={save} className="rounded-md bg-accent px-5 py-3 font-semibold text-night">Guardar cambios</button>
          <button type="button" onClick={() => { setForm({ ...form, orderStatus: "delivered" }); }} className="rounded-md border border-soft/15 px-5 py-3 font-semibold text-soft">Marcar entregado</button>
        </div>
        {saved ? <p className="mt-3 text-sm text-accent">Cambios guardados.</p> : null}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-soft/8 pb-2">
      <dt className="text-soft/46">{label}</dt>
      <dd className="text-right text-soft/82">{value}</dd>
    </div>
  );
}
