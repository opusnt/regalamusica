import {
  Baby,
  BriefcaseBusiness,
  Cake,
  Gift,
  GraduationCap,
  Heart,
  HeartHandshake,
  Home,
  Music2,
  PartyPopper,
  Sparkles,
  TreePine,
  Users,
} from "lucide-react";

export const plans = [
  {
    id: "essential",
    name: "Canción Esencial",
    price: "Desde $19.990",
    amount: 19990,
    description: "Para un regalo simple, rápido y significativo.",
    cta: "Elegir Esencial",
    includes: [
      "Canción personalizada basada en tu historia",
      "Letra original personalizada",
      "Elección de estilo musical",
      "Entrega en MP3",
      "1 versión final",
    ],
  },
  {
    id: "premium",
    name: "Canción Premium",
    badge: "Más elegido",
    price: "Desde $34.990",
    amount: 34990,
    description: "Para quienes quieren un regalo más cuidado y emocionante.",
    cta: "Elegir Premium",
    includes: [
      "Todo lo del plan Esencial",
      "Revisión de letra antes de producir",
      "Mejor dirección creativa del estilo",
      "Portada digital simple",
      "1 ajuste incluido",
    ],
  },
  {
    id: "experience",
    name: "Canción Experiencia",
    price: "Desde $54.990",
    amount: 54990,
    description: "Para convertir la canción en un regalo completo.",
    cta: "Elegir Experiencia",
    includes: [
      "Todo lo del plan Premium",
      "Video lyric simple",
      "Dedicatoria escrita",
      "Portada personalizada",
      "2 ajustes incluidos",
    ],
  },
];

export const occasions = [
  { title: "Cumpleaños", icon: Cake, text: "Una canción que diga lo que una tarjeta no alcanza a decir." },
  { title: "Aniversarios", icon: Heart, text: "Recuerdos, frases y momentos convertidos en música." },
  { title: "Día de la madre", icon: HeartHandshake, text: "Una forma distinta de agradecer toda una vida de amor." },
  { title: "Día del padre", icon: Home, text: "Un homenaje para esas formas silenciosas de cuidar." },
  { title: "Matrimonios", icon: Sparkles, text: "Una canción única para una historia que recién comienza." },
  { title: "Nacimientos", icon: Baby, text: "La bienvenida más tierna para una nueva vida." },
  { title: "Graduaciones", icon: GraduationCap, text: "Un cierre de etapa convertido en celebración." },
  { title: "Despedidas", icon: Gift, text: "Para decir gracias, te extraño o buen viaje con música." },
  { title: "Navidad", icon: TreePine, text: "Un regalo personal para guardar más allá de la fecha." },
  { title: "Regalos corporativos", icon: BriefcaseBusiness, text: "Reconocimientos y momentos de equipo con una emoción distinta." },
];

export const examples = [
  {
    title: "Para mamá en sus 60",
    occasion: "Cumpleaños",
    story: "Una familia quiso agradecer a su madre por años de esfuerzo, humor y cariño.",
    style: "Balada cálida",
    audioSrc: "/por-todas-las%20veces.mp3",
    coverSrc: "/covers/para-mama-60.png",
  },
  {
    title: "Nuestra primera casa",
    occasion: "Aniversario",
    story: "Una pareja quiso recordar sus inicios, sus mudanzas y los pequeños rituales que los unieron.",
    style: "Pop acústico",
    audioSrc: "/todavia-me-acuerdo.mp3",
    coverSrc: "/covers/nuestra-primera-casa.png",
  },
  {
    title: "La canción de los amigos",
    occasion: "Cumpleaños divertido",
    story: "Un grupo de amigos convirtió sus tallas internas en una canción alegre y memorable.",
    style: "Pop latino alegre",
    audioSrc: "/la-misma-mesa.mp3",
    coverSrc: "/covers/cancion-amigos.png",
  },
];

export const tones = [
  "Emotivo",
  "Alegre",
  "Divertido",
  "Nostálgico",
  "Elegante",
  "Romántico",
  "Familiar",
];

export const musicStyles = [
  "Balada",
  "Pop acústico",
  "Pop latino",
  "Urbano suave",
  "Folclórico",
  "Rock suave",
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
  "Matrimonio",
  "Día de la madre",
  "Día del padre",
  "Nacimiento",
  "Graduación",
  "Despedida",
  "Navidad",
  "Regalo corporativo",
  "Otro",
];

export const faqs = [
  {
    question: "¿Cuánto demora la entrega?",
    answer:
      "Depende del plan y la demanda del momento. Al comprar verás una fecha estimada de entrega. También podremos ofrecer opciones express más adelante.",
  },
  {
    question: "¿Puedo pedir cambios?",
    answer: "Sí, algunos planes incluyen ajustes. La cantidad de revisiones depende del plan que elijas.",
  },
  {
    question: "¿Puedo elegir el estilo musical?",
    answer:
      "Sí. Puedes elegir un estilo general y compartir referencias para orientar el tono, sin copiar canciones existentes.",
  },
  {
    question: "¿Qué recibo al final?",
    answer:
      "Recibirás tu canción en formato digital MP3. Según el plan, también puedes recibir portada, dedicatoria o video lyric.",
  },
  {
    question: "¿Puedo usar nombres reales o historias personales?",
    answer:
      "Sí. La canción se construye a partir de la información que nos entregues. Recomendamos compartir solo datos que quieras incluir en el regalo.",
  },
  {
    question: "¿Qué pasa si no sé qué escribir?",
    answer: "El formulario te guiará con preguntas simples para ayudarte a contar la historia.",
  },
  {
    question: "¿La canción sirve para uso comercial?",
    answer:
      "Por defecto, la canción está pensada para uso personal como regalo. Para uso comercial o de marca, contáctanos para una licencia especial.",
  },
  {
    question: "¿Puedo regalarla directamente a otra persona?",
    answer: "Sí. Más adelante podrás indicar si quieres que la entrega se envíe directamente al destinatario.",
  },
];

export const trustBenefits = [
  { title: "Personalizada desde tu historia", icon: Users },
  { title: "Lista para compartir", icon: Music2 },
  { title: "Con opción de ajustes según el plan", icon: Sparkles },
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
