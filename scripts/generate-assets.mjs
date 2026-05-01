import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";

const width = 1800;
const height = 1100;
const data = Buffer.alloc((width * 4 + 1) * height);

const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));
const smoothstep = (edge0, edge1, x) => {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

const hashNoise = (x, y) => {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
};

function drawPixel(x, y) {
  const nx = x / width;
  const ny = y / height;
  const cx = nx - 0.52;
  const cy = ny - 0.5;
  const vignette = smoothstep(0.22, 0.9, Math.sqrt(cx * cx + cy * cy));
  const blueLight = Math.max(0, 1 - Math.hypot(nx - 0.28, ny - 0.28) / 0.62);
  const warmLight = Math.max(0, 1 - Math.hypot(nx - 0.72, ny - 0.62) / 0.5);
  const tableGlow = smoothstep(0.42, 0.85, ny) * (1 - smoothstep(0.9, 1, ny));
  const grain = (hashNoise(x, y) - 0.5) * 18;

  let r = 10 + blueLight * 13 + warmLight * 24 + tableGlow * 13 - vignette * 18 + grain;
  let g = 10 + blueLight * 24 + warmLight * 17 + tableGlow * 10 - vignette * 18 + grain;
  let b = 12 + blueLight * 42 + warmLight * 8 + tableGlow * 6 - vignette * 18 + grain;

  const letterX = nx > 0.18 && nx < 0.58;
  const letterY = ny > 0.49 && ny < 0.72;
  if (letterX && letterY) {
    const paperEdge = Math.min(nx - 0.18, 0.58 - nx, ny - 0.49, 0.72 - ny);
    const paper = smoothstep(0, 0.015, paperEdge);
    r = r * (1 - paper * 0.5) + 136 * paper * 0.5;
    g = g * (1 - paper * 0.5) + 128 * paper * 0.5;
    b = b * (1 - paper * 0.5) + 112 * paper * 0.5;

    const line = Math.abs(((ny - 0.52) * 24) % 1 - 0.5);
    const ink = paper * smoothstep(0.11, 0.02, line) * smoothstep(0.2, 0.45, nx) * (1 - smoothstep(0.46, 0.57, nx));
    r = r * (1 - ink * 0.55) + 34 * ink;
    g = g * (1 - ink * 0.55) + 43 * ink;
    b = b * (1 - ink * 0.55) + 58 * ink;
  }

  const micBody = Math.hypot((nx - 0.69) / 0.043, (ny - 0.39) / 0.09) < 1;
  const micStem = nx > 0.683 && nx < 0.697 && ny > 0.46 && ny < 0.7;
  const micBase = Math.hypot((nx - 0.69) / 0.12, (ny - 0.72) / 0.018) < 1;
  if (micBody || micStem || micBase) {
    r *= 0.24;
    g *= 0.27;
    b *= 0.34;
  }

  const waveY = 0.82;
  const distToWave = Math.abs(ny - waveY);
  const wave = Math.sin(nx * 80) * 0.018 + Math.sin(nx * 29 + 1.2) * 0.012;
  const onWave = Math.abs(ny - (waveY + wave)) < 0.0025;
  if (distToWave < 0.04 && onWave && nx > 0.16 && nx < 0.84) {
    r = r * 0.45 + 245 * 0.55;
    g = g * 0.45 + 188 * 0.55;
    b = b * 0.45 + 54 * 0.55;
  }

  const lightBand = Math.abs(ny - 0.78) < 0.002 && nx > 0.12 && nx < 0.86;
  if (lightBand) {
    r = r * 0.6 + 63 * 0.4;
    g = g * 0.6 + 105 * 0.4;
    b = b * 0.6 + 175 * 0.4;
  }

  return [clamp(r), clamp(g), clamp(b), 255];
}

for (let y = 0; y < height; y += 1) {
  const rowStart = y * (width * 4 + 1);
  data[rowStart] = 0;
  for (let x = 0; x < width; x += 1) {
    const [r, g, b, a] = drawPixel(x, y);
    const index = rowStart + 1 + x * 4;
    data[index] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = a;
  }
}

const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return c >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, payload) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(payload.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, payload])));
  return Buffer.concat([length, typeBuffer, payload, crc]);
}

const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

mkdirSync("public", { recursive: true });
writeFileSync(
  "public/cinematic-poster.png",
  Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(data, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]),
);
