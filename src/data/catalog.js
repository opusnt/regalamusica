import {
  Baby,
  BriefcaseBusiness,
  Cake,
  Gift,
  GraduationCap,
  Heart,
  HeartHandshake,
  Home,
  MessageCircleQuestion,
  Music2,
  PartyPopper,
  Send,
  ShieldCheck,
  Sparkles,
  TreePine,
  Users,
} from "lucide-react";

export const occasions = [
  { title: "Cumpleaños", icon: Cake, text: "Una canción que diga lo que una tarjeta no alcanza a decir." },
  { title: "Aniversarios", icon: Heart, text: "Recuerdos, frases y momentos convertidos en música." },
  { title: "Día de la madre", icon: HeartHandshake, text: "Una forma distinta de agradecer toda una vida de amor." },
  { title: "Día del padre", icon: Home, text: "Un regalo personal para reconocer historias, esfuerzos y momentos compartidos." },
  { title: "Matrimonios", icon: Sparkles, text: "Una canción única para una historia que recién comienza." },
  { title: "Nacimientos", icon: Baby, text: "Una bienvenida musical para guardar toda la vida." },
  { title: "Graduaciones", icon: GraduationCap, text: "Una forma emocional de celebrar todo lo recorrido." },
  { title: "Despedidas", icon: Gift, text: "Para convertir un cierre en un recuerdo que se pueda volver a escuchar." },
  { title: "Navidad", icon: TreePine, text: "Un regalo personalizado que no se pierde entre lo de siempre." },
  { title: "Empresas y equipos", icon: BriefcaseBusiness, text: "Canciones personalizadas para colaboradores, clientes o momentos de marca." },
];

export const tones = [
  "Emotivo",
  "Alegre",
  "Divertido",
  "Nostálgico",
  "Elegante",
  "Romántico",
  "Familiar",
  "Inspirador",
];

export const musicStyles = [
  "Balada cálida",
  "Pop acústico",
  "Pop latino alegre",
  "Urbano suave",
  "Rock suave",
  "Folclórico",
  "Infantil",
  "Otro",
];

export const relationships = [
  "Mamá",
  "Papá",
  "Pareja",
  "Hijo/a",
  "Abuelo/a",
  "Hermano/a",
  "Amigo/a",
  "Tío/a",
  "Primo/a",
  "Familia",
  "Compañero/a",
  "Otro",
];

export const occasionOptions = [
  "Cumpleaños",
  "Aniversario",
  "Día de la madre",
  "Día del padre",
  "Matrimonio",
  "Nacimiento",
  "Graduación",
  "Despedida",
  "Navidad",
  "Otro",
];

export const trustBenefits = [
  {
    title: "Personalizada desde tu historia",
    text: "No partes desde una plantilla. Partes desde recuerdos reales.",
    icon: Users,
  },
  {
    title: "Lista para compartir",
    text: "Recibes un archivo digital preparado para enviar, dedicar o guardar.",
    icon: Send,
  },
  {
    title: "Con ajustes según plan",
    text: "Algunos planes incluyen revisión para acercar el resultado al tono que imaginaste.",
    icon: Sparkles,
  },
  {
    title: "Proceso guiado",
    text: "Te hacemos las preguntas correctas para que no tengas que saber escribir una canción.",
    icon: MessageCircleQuestion,
  },
];

export const b2bCases = [
  "Reconocimiento a colaboradores",
  "Aniversarios de empresa",
  "Regalos para clientes VIP",
  "Licenciaturas o colegios",
  "Matrimonios y eventos",
  "Campañas de marca",
];

export const paymentStatuses = ["pending", "paid", "failed", "refunded"];

export const orderStatuses = [
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

export const publicOrderStatusLabels = {
  received: "Pedido recibido",
  payment_confirmed: "Pago confirmado",
  in_production: "En producción",
  lyrics_review: "En producción",
  music_production: "En producción",
  ready_for_delivery: "Canción lista",
  delivered: "Entregado",
  revision_requested: "Ajuste solicitado",
  closed: "Entregado",
};

export const statusIcons = {
  received: Gift,
  payment_confirmed: ShieldCheck,
  in_production: Music2,
  lyrics_review: Music2,
  music_production: Music2,
  ready_for_delivery: PartyPopper,
  delivered: PartyPopper,
  revision_requested: Sparkles,
  closed: ShieldCheck,
};
