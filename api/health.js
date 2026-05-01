export default function handler(_request, response) {
  response.status(200).setHeader("Cache-Control", "no-store");
  response.json({ ok: true, service: "regalamusica-api" });
}
