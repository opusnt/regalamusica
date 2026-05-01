export function onOrderCreated(order) {
  console.info("[order:event] created", order.id);
}

export function onPaymentConfirmed(order) {
  console.info("[order:event] payment_confirmed", order.id);
}

export function onProductionStarted(order) {
  console.info("[order:event] production_started", order.id);
}

export function onSongReady(order) {
  console.info("[order:event] song_ready", order.id);
}

export function onRevisionRequested(order) {
  console.info("[order:event] revision_requested", order.id);
}

export function onOrderDelivered(order) {
  console.info("[order:event] delivered", order.id);
}

export const futureEmails = [
  "Pedido recibido",
  "Pago confirmado",
  "Producción iniciada",
  "Canción lista",
  "Ajuste solicitado",
  "Pedido entregado",
  "Formulario abandonado",
];
