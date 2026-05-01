import { motion } from "framer-motion";
import { Check, CreditCard, Lock, Music2, ReceiptText, Send } from "lucide-react";
import { useMemo, useState } from "react";
import SectionIntro from "./SectionIntro.jsx";

const plans = [
  {
    id: "esencial",
    name: "Canción esencial",
    price: 29990,
    description: "Letra y canción personalizada lista para regalar.",
  },
  {
    id: "emocional",
    name: "Canción emocional",
    price: 49990,
    description: "Más detalle narrativo, mezcla cuidada y entrega prioritaria.",
  },
  {
    id: "inolvidable",
    name: "Experiencia inolvidable",
    price: 79990,
    description: "Canción, dedicatoria guiada y versión especial para la entrega.",
  },
];

const initialForm = {
  planId: "emocional",
  name: "",
  email: "",
  phone: "",
  recipient: "",
  story: "",
  message: "",
  style: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

const formatPrice = (amount) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);

export default function CheckoutSection() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [confirmation, setConfirmation] = useState(null);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === form.planId) || plans[1],
    [form.planId],
  );

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const submitCheckout = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setErrors({});

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setErrors(data.errors || { general: data.message || "No pudimos procesar el pago." });
        setStatus("error");
        return;
      }

      setConfirmation(data);
      setStatus("success");
    } catch {
      setErrors({ general: "No pudimos conectar con la pasarela. Inténtalo nuevamente." });
      setStatus("error");
    }
  };

  return (
    <section id="checkout" className="relative bg-night px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Reserva tu canción"
          title="Paga seguro. Nosotros empezamos a transformar la historia."
        >
          Esta pasarela demo registra el cliente y simula el pago aprobado para validar el flujo completo antes de conectar un proveedor real.
        </SectionIntro>

        <div className="mt-10 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            className="rounded-lg border border-soft/10 bg-[#101010] p-5"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-md bg-primary/18 text-accent">
                <ReceiptText className="size-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-soft/46">Resumen</p>
                <h3 className="text-xl font-semibold text-soft">{selectedPlan.name}</h3>
              </div>
            </div>

            <div className="space-y-3">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => updateField("planId", plan.id)}
                  className={`w-full rounded-lg border p-4 text-left transition-colors duration-300 ${
                    form.planId === plan.id
                      ? "border-accent bg-accent/10"
                      : "border-soft/10 bg-night/60 hover:border-primary/60"
                  }`}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span>
                      <span className="block text-lg font-semibold text-soft">{plan.name}</span>
                      <span className="mt-2 block text-sm leading-6 text-soft/58">{plan.description}</span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-accent">
                      {formatPrice(plan.price)}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-primary/20 bg-primary/10 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-soft">
                <Lock className="size-4 text-accent" aria-hidden="true" />
                Pago demo protegido
              </div>
              <p className="mt-2 text-sm leading-6 text-soft/58">
                No guardamos número de tarjeta completo. El backend solo registra el cliente, el pedido y los últimos 4 dígitos.
              </p>
            </div>
          </motion.aside>

          <motion.form
            onSubmit={submitCheckout}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            className="rounded-lg border border-soft/10 bg-[#101010] p-5 sm:p-6"
          >
            {confirmation ? (
              <div className="rounded-lg border border-accent/40 bg-accent/10 p-5">
                <div className="grid size-12 place-items-center rounded-md bg-accent text-night">
                  <Check className="size-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-3xl font-semibold text-soft">Pago aprobado</h3>
                <p className="mt-3 text-base leading-7 text-soft/68">
                  Pedido {confirmation.payment.id} creado para {confirmation.client.name}. Te contactaremos en {confirmation.client.email}.
                </p>
                <a
                  href="#final"
                  className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-base font-semibold text-night transition-colors duration-300 hover:bg-[#ffd46a]"
                >
                  Ver cierre
                  <Send className="size-4" aria-hidden="true" />
                </a>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center gap-3 border-b border-soft/10 pb-5">
                  <div className="grid size-11 place-items-center rounded-md bg-primary/18 text-accent">
                    <CreditCard className="size-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-soft/46">Checkout</p>
                    <h3 className="text-xl font-semibold text-soft">Datos del cliente y pago</h3>
                  </div>
                </div>

                {errors.general ? (
                  <p className="mb-4 rounded-md border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
                    {errors.general}
                  </p>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nombre" error={errors.name}>
                    <input value={form.name} onChange={(event) => updateField("name", event.target.value)} className="checkout-input" />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className="checkout-input" />
                  </Field>
                  <Field label="Teléfono">
                    <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className="checkout-input" />
                  </Field>
                  <Field label="¿Para quién es?" error={errors.recipient}>
                    <input value={form.recipient} onChange={(event) => updateField("recipient", event.target.value)} className="checkout-input" />
                  </Field>
                  <Field label="Estilo musical" error={errors.style}>
                    <input value={form.style} onChange={(event) => updateField("style", event.target.value)} className="checkout-input" placeholder="Balada, salsa, rock..." />
                  </Field>
                  <Field label="Número de tarjeta" error={errors.cardNumber}>
                    <input inputMode="numeric" value={form.cardNumber} onChange={(event) => updateField("cardNumber", event.target.value)} className="checkout-input" placeholder="4242 4242 4242 4242" />
                  </Field>
                  <Field label="Vencimiento" error={errors.expiry}>
                    <input value={form.expiry} onChange={(event) => updateField("expiry", event.target.value)} className="checkout-input" placeholder="MM/AA" />
                  </Field>
                  <Field label="CVC" error={errors.cvc}>
                    <input inputMode="numeric" value={form.cvc} onChange={(event) => updateField("cvc", event.target.value)} className="checkout-input" placeholder="123" />
                  </Field>
                </div>

                <div className="mt-4 grid gap-4">
                  <Field label="Historia" error={errors.story}>
                    <textarea value={form.story} onChange={(event) => updateField("story", event.target.value)} rows={4} className="checkout-input min-h-28 resize-none" />
                  </Field>
                  <Field label="Mensaje que quieres decir">
                    <textarea value={form.message} onChange={(event) => updateField("message", event.target.value)} rows={3} className="checkout-input min-h-24 resize-none" />
                  </Field>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="inline-flex items-center gap-2 text-sm text-soft/52">
                    <Music2 className="size-4 text-accent" aria-hidden="true" />
                    Total: <span className="font-semibold text-soft">{formatPrice(selectedPlan.price)}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 text-base font-semibold text-night transition-colors duration-300 hover:bg-[#ffd46a] disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {status === "loading" ? "Procesando..." : "Pagar y crear pedido"}
                    <Lock className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-soft/82">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-sm text-red-200">{error}</span> : null}
    </label>
  );
}
