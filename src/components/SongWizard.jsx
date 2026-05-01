import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CreditCard, Lock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  musicStyles,
  occasionOptions,
  plans,
  relationships,
  tones,
} from "../data/site.js";
import { analyticsEvents, trackEvent } from "../lib/analytics.js";

const storageKey = "regalamusica-order-draft";

const initialDraft = {
  customerName: "",
  customerEmail: "",
  customerWhatsapp: "",
  recipientName: "",
  relationship: "",
  occasion: "",
  neededDate: "",
  story: "",
  keyMoments: "",
  phrasesToInclude: "",
  thingsToAvoid: "",
  tone: "",
  musicStyle: "",
  references: "",
  selectedPlan: "premium",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

const steps = [
  "Datos básicos",
  "Datos del regalo",
  "Historia",
  "Tono y estilo",
  "Plan",
  "Resumen y pago",
];

const formatPrice = (amount) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);

export default function SongWizard() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(initialDraft);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === draft.selectedPlan) || plans[1],
    [draft.selectedPlan],
  );

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setDraft({ ...initialDraft, ...JSON.parse(saved) });
    trackEvent(analyticsEvents.startForm);
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(draft));
  }, [draft]);

  const update = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const validateStep = (stepIndex) => {
    const nextErrors = {};
    if (stepIndex === 0) {
      if (!draft.customerName.trim()) nextErrors.customerName = "Ingresa tu nombre.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.customerEmail)) nextErrors.customerEmail = "Ingresa un email válido.";
    }
    if (stepIndex === 1) {
      if (!draft.recipientName.trim()) nextErrors.recipientName = "Ingresa el nombre de la persona.";
      if (!draft.relationship.trim()) nextErrors.relationship = "Selecciona la relación.";
      if (!draft.occasion.trim()) nextErrors.occasion = "Selecciona la ocasión.";
    }
    if (stepIndex === 2 && draft.story.trim().length < 20) {
      nextErrors.story = "Cuéntanos un poco más de la historia.";
    }
    if (stepIndex === 3) {
      if (!draft.tone.trim()) nextErrors.tone = "Selecciona un tono.";
      if (!draft.musicStyle.trim() || draft.musicStyle === "Otro") nextErrors.musicStyle = "Selecciona o escribe un estilo.";
    }
    if (stepIndex === 5) {
      const cardNumber = draft.cardNumber.replace(/\D/g, "");
      if (cardNumber.length < 12) nextErrors.cardNumber = "Revisa el número de tarjeta.";
      if (!/^\d{2}\/\d{2}$/.test(draft.expiry)) nextErrors.expiry = "Usa formato MM/AA.";
      if (draft.cvc.replace(/\D/g, "").length < 3) nextErrors.cvc = "Revisa el CVC.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    const eventName = [analyticsEvents.completeStep1, analyticsEvents.completeStep2, analyticsEvents.completeStep3][step];
    if (eventName) trackEvent(eventName);
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const submitOrder = async () => {
    if (!validateStep(5)) return;
    setStatus("loading");
    trackEvent(analyticsEvents.beginCheckout, { plan: selectedPlan.id });

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setErrors(data.errors || { general: data.message || "No pudimos crear el pedido." });
        setStatus("error");
        return;
      }

      localStorage.removeItem(storageKey);
      trackEvent(analyticsEvents.paymentSuccess, { orderId: data.order.id, plan: data.order.selectedPlan });
      window.location.href = `/success?order=${data.order.id}`;
    } catch {
      setErrors({ general: "No pudimos conectar con el backend. Inténtalo nuevamente." });
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-night px-5 py-8 text-soft sm:px-8">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="text-sm font-semibold text-soft/62 hover:text-accent">Regala Música</a>
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
          <aside className="rounded-lg border border-soft/10 bg-[#101010] p-5">
            <p className="text-sm font-semibold uppercase text-accent">Crear canción</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-soft">Cuéntanos la historia. Nosotros hacemos el resto.</h1>
            <div className="mt-6 space-y-2">
              {steps.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setStep(index)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm transition-colors ${
                    step === index ? "bg-primary/20 text-soft" : "text-soft/52 hover:bg-soft/5"
                  }`}
                >
                  <span className="grid size-7 place-items-center rounded-sm bg-soft/8 text-xs">{index + 1}</span>
                  {label}
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-lg border border-soft/10 bg-[#101010] p-5 sm:p-7">
            <div className="mb-6 h-1.5 rounded-sm bg-soft/10">
              <div className="h-full rounded-sm bg-accent transition-all duration-300" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
            </div>
            <h2 className="text-3xl font-semibold text-soft">{steps[step]}</h2>
            <div className="mt-6">
              {step === 0 && <BasicStep draft={draft} update={update} errors={errors} />}
              {step === 1 && <GiftStep draft={draft} update={update} errors={errors} />}
              {step === 2 && <StoryStep draft={draft} update={update} errors={errors} />}
              {step === 3 && <StyleStep draft={draft} update={update} errors={errors} />}
              {step === 4 && <PlanStep draft={draft} update={update} selectedPlan={selectedPlan} />}
              {step === 5 && <PaymentStep draft={draft} update={update} errors={errors} selectedPlan={selectedPlan} />}
            </div>
            {errors.general ? <p className="mt-5 rounded-md bg-red-400/10 px-4 py-3 text-sm text-red-100">{errors.general}</p> : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setStep((current) => Math.max(current - 1, 0))}
                disabled={step === 0}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-soft/15 px-5 py-3 font-semibold text-soft transition-colors hover:border-accent hover:text-accent disabled:opacity-35"
              >
                <ArrowLeft className="size-4" /> Volver
              </button>
              {step < steps.length - 1 ? (
                <button type="button" onClick={goNext} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 font-semibold text-night hover:bg-[#ffd46a]">
                  Continuar <ArrowRight className="size-4" />
                </button>
              ) : (
                <button type="button" onClick={submitOrder} disabled={status === "loading"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 font-semibold text-night hover:bg-[#ffd46a] disabled:opacity-55">
                  {status === "loading" ? "Procesando..." : "Pagar y comenzar mi canción"} <Lock className="size-4" />
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function BasicStep({ draft, update, errors }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Nombre del comprador" error={errors.customerName}>
        <input className="checkout-input" value={draft.customerName} onChange={(event) => update("customerName", event.target.value)} />
      </Field>
      <Field label="Email" error={errors.customerEmail}>
        <input className="checkout-input" type="email" value={draft.customerEmail} onChange={(event) => update("customerEmail", event.target.value)} />
      </Field>
      <Field label="WhatsApp opcional">
        <input className="checkout-input" value={draft.customerWhatsapp} onChange={(event) => update("customerWhatsapp", event.target.value)} />
      </Field>
    </div>
  );
}

function GiftStep({ draft, update, errors }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="¿Para quién es la canción?" error={errors.relationship}>
        <SelectGrid options={relationships} value={draft.relationship} onChange={(value) => update("relationship", value)} />
      </Field>
      <Field label="Nombre de la persona" error={errors.recipientName}>
        <input className="checkout-input" value={draft.recipientName} onChange={(event) => update("recipientName", event.target.value)} />
      </Field>
      <Field label="Ocasión del regalo" error={errors.occasion}>
        <SelectGrid options={occasionOptions} value={draft.occasion} onChange={(value) => update("occasion", value)} />
      </Field>
      <Field label="Fecha en que necesita la canción">
        <input className="checkout-input" type="date" value={draft.neededDate} onChange={(event) => update("neededDate", event.target.value)} />
      </Field>
    </div>
  );
}

function StoryStep({ draft, update, errors }) {
  return (
    <div className="grid gap-4">
      <Field label="¿Qué quieres contar en la canción?" error={errors.story}>
        <textarea className="checkout-input min-h-32 resize-none" value={draft.story} onChange={(event) => update("story", event.target.value)} />
      </Field>
      <Field label="¿Qué momentos o recuerdos no pueden faltar?">
        <textarea className="checkout-input min-h-28 resize-none" value={draft.keyMoments} onChange={(event) => update("keyMoments", event.target.value)} />
      </Field>
      <Field label="Frases, tallas internas o palabras especiales">
        <textarea className="checkout-input min-h-24 resize-none" value={draft.phrasesToInclude} onChange={(event) => update("phrasesToInclude", event.target.value)} />
      </Field>
      <Field label="¿Hay algo que prefieres evitar?">
        <textarea className="checkout-input min-h-24 resize-none" value={draft.thingsToAvoid} onChange={(event) => update("thingsToAvoid", event.target.value)} />
      </Field>
    </div>
  );
}

function StyleStep({ draft, update, errors }) {
  const customStyleActive = draft.musicStyle === "Otro" || !musicStyles.includes(draft.musicStyle);

  return (
    <div className="grid gap-5">
      <Field label="Tono" error={errors.tone}>
        <SelectGrid options={tones} value={draft.tone} onChange={(value) => update("tone", value)} />
      </Field>
      <Field label="Estilo musical" error={errors.musicStyle}>
        <SelectGrid options={musicStyles} value={draft.musicStyle} onChange={(value) => update("musicStyle", value)} />
        {customStyleActive ? (
          <input
            className="checkout-input mt-3"
            value={draft.musicStyle === "Otro" ? "" : draft.musicStyle}
            placeholder="Escribe el estilo que imaginas"
            onChange={(event) => update("musicStyle", event.target.value)}
          />
        ) : null}
      </Field>
      <Field label="Referencias opcionales">
        <textarea className="checkout-input min-h-24 resize-none" value={draft.references} onChange={(event) => update("references", event.target.value)} placeholder="Artistas o canciones de inspiración. No copiamos canciones existentes." />
      </Field>
    </div>
  );
}

function PlanStep({ draft, update, selectedPlan }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {plans.map((plan) => (
        <button key={plan.id} type="button" onClick={() => { update("selectedPlan", plan.id); trackEvent(analyticsEvents.selectPlan, { plan: plan.id }); }} className={`rounded-lg border p-5 text-left ${draft.selectedPlan === plan.id ? "border-accent bg-accent/10" : "border-soft/10 bg-night/60"}`}>
          {plan.badge ? <span className="mb-3 inline-flex rounded-md bg-accent px-2 py-1 text-xs font-semibold text-night">{plan.badge}</span> : null}
          <h3 className="text-xl font-semibold text-soft">{plan.name}</h3>
          <p className="mt-2 text-2xl font-semibold text-accent">{plan.price}</p>
          <p className="mt-3 text-sm leading-6 text-soft/58">{plan.description}</p>
          <ul className="mt-4 space-y-2">
            {plan.includes.map((item) => (
              <li key={item} className="flex gap-2 text-xs leading-5 text-soft/62"><Check className="mt-0.5 size-3 text-accent" />{item}</li>
            ))}
          </ul>
        </button>
      ))}
      <p className="lg:col-span-3 text-sm text-soft/54">Seleccionado: {selectedPlan.name} · {selectedPlan.price}</p>
    </div>
  );
}

function PaymentStep({ draft, update, errors, selectedPlan }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
      <div className="rounded-lg border border-soft/10 bg-night/60 p-4">
        <h3 className="text-xl font-semibold text-soft">Resumen</h3>
        <dl className="mt-4 space-y-3 text-sm">
          {[
            ["Cliente", draft.customerName],
            ["Email", draft.customerEmail],
            ["Para", `${draft.recipientName} (${draft.relationship})`],
            ["Ocasión", draft.occasion],
            ["Tono", draft.tone],
            ["Estilo", draft.musicStyle],
            ["Plan", selectedPlan.name],
            ["Precio", formatPrice(selectedPlan.amount)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-b border-soft/8 pb-2">
              <dt className="text-soft/46">{label}</dt>
              <dd className="text-right text-soft/82">{value || "-"}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="rounded-lg border border-soft/10 bg-night/60 p-4">
        <h3 className="flex items-center gap-2 text-xl font-semibold text-soft"><CreditCard className="size-5 text-accent" /> Pago demo</h3>
        <div className="mt-4 grid gap-4">
          <Field label="Número de tarjeta" error={errors.cardNumber}>
            <input className="checkout-input" value={draft.cardNumber} onChange={(event) => update("cardNumber", event.target.value)} placeholder="4242 4242 4242 4242" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Vencimiento" error={errors.expiry}>
              <input className="checkout-input" value={draft.expiry} onChange={(event) => update("expiry", event.target.value)} placeholder="MM/AA" />
            </Field>
            <Field label="CVC" error={errors.cvc}>
              <input className="checkout-input" value={draft.cvc} onChange={(event) => update("cvc", event.target.value)} placeholder="123" />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectGrid({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((option) => (
        <button key={option} type="button" onClick={() => onChange(option)} className={`min-h-11 rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${value === option ? "border-accent bg-accent/10 text-accent" : "border-soft/12 bg-[#151515] text-soft hover:border-accent hover:text-accent"}`}>
          {option}
        </button>
      ))}
    </div>
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
