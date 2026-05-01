import {
  Gift,
  HeartHandshake,
  Mic2,
  Music2,
  Sparkles,
  Video,
} from "lucide-react";

export const storyLines = [
  "Cuando Ana cumplió 60, su hija no quería otro ramo.",
  "Quería decirle gracias por las noches sin dormir.",
  "Por la sopa lista, por los silencios cuidados, por quedarse incluso cuando dolía.",
  "Nos contó esa historia. Sus palabras se volvieron verso.",
  "Y cuando la canción empezó, nadie habló.",
  "Solo se escuchó a una madre entendiendo, por fin, todo lo que nunca le dijeron.",
];

export const steps = [
  {
    icon: HeartHandshake,
    title: "Cuenta tu historia",
    text: "Nos compartes nombres, recuerdos, detalles y eso que todavía no has podido decir.",
  },
  {
    icon: Mic2,
    title: "Creamos tu canción",
    text: "Convertimos tu historia en letra, melodía y producción con una dirección emocional clara.",
  },
  {
    icon: Gift,
    title: "Entrega inolvidable",
    text: "Recibes una pieza lista para regalar, escuchar juntos y guardar para siempre.",
  },
];

export const demos = [
  {
    title: "Para mi mamá",
    mood: "Balada cálida",
    quote: "Por todas las veces que me sostuvo sin pedir nada.",
    duration: "3:43",
    audioSrc: "/Por%20todas%20las%20veces.mp3",
  },
  {
    title: "Para mi pareja",
    mood: "Pop cinematográfico",
    quote: "Porque contigo hasta los días simples tienen música.",
    duration: "3:12",
  },
  {
    title: "Para mi hijo",
    mood: "Acústica luminosa",
    quote: "Para que sepas que siempre voy a estar cerca.",
    duration: "2:57",
  },
];

export const testimonials = [
  {
    quote: "Nunca lo había visto llorar",
    person: "Camila, para su papá",
    icon: Video,
  },
  {
    quote: "Es el mejor regalo que he hecho",
    person: "Martin, aniversario",
    icon: Music2,
  },
];

export const experiences = [
  {
    icon: Sparkles,
    title: "Quiero sorprender",
    description:
      "Para una entrega inesperada, con un giro que la otra persona no ve venir.",
  },
  {
    icon: HeartHandshake,
    title: "Quiero emocionar",
    description:
      "Para decir algo profundo con una canción que se siente íntima y verdadera.",
  },
  {
    icon: Gift,
    title: "Quiero algo inolvidable",
    description:
      "Para convertir una fecha, despedida o agradecimiento en un recuerdo permanente.",
  },
];

export const formSteps = [
  {
    id: "recipient",
    question: "¿Para quién es?",
    type: "options",
    options: ["Mamá", "Pareja", "Hijo/a", "Amigo/a"],
  },
  {
    id: "story",
    question: "Cuéntame su historia",
    type: "textarea",
    placeholder: "Escribe un recuerdo, una escena, una forma de ser...",
  },
  {
    id: "message",
    question: "¿Qué quieres decir?",
    type: "textarea",
    placeholder: "Eso que debería escuchar en voz alta, pero convertido en canción.",
  },
  {
    id: "style",
    question: "Estilo musical",
    type: "options",
    options: ["Balada", "Acústico", "Pop", "Regional"],
  },
];
