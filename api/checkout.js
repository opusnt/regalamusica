import ordersHandler from "./orders.js";

export default function handler(request, response) {
  return ordersHandler(request, response);
}
