import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const defaultDataFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "data", "loads.json");
const MAX_BODY_BYTES = 16_384;

function json(response, status, payload) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(payload));
}

export function isValidLoad(payload) {
  return payload !== null && typeof payload === "object" &&
    typeof payload.company === "string" && payload.company.trim().length > 0 && payload.company.length <= 200 &&
    typeof payload.cargoType === "string" && payload.cargoType.trim().length > 0 && payload.cargoType.length <= 100 &&
    typeof payload.origin === "string" && payload.origin.trim().length > 0 && payload.origin.length <= 100 &&
    typeof payload.destination === "string" && payload.destination.trim().length > 0 && payload.destination.length <= 100 &&
    Number.isFinite(payload.tonnes) && payload.tonnes > 0 && payload.tonnes <= 100_000 &&
    Number.isInteger(payload.days) && payload.days > 0 && payload.days <= 365;
}

async function readLoads(dataFile) {
  try {
    const data = JSON.parse(await readFile(dataFile, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

export function createAppServer({ dataFile = process.env.CARGO_DATA_FILE || defaultDataFile } = {}) {
  return createServer(async (request, response) => {
    const url = new URL(request.url || "/", "http://localhost");
    if (url.pathname === "/api/health" && request.method === "GET") {
      return json(response, 200, { ok: true, service: "where-is-my-cargo-api" });
    }
    if (url.pathname !== "/api/cargo") return json(response, 404, { error: "Not found" });

    try {
      if (request.method === "GET") {
        return json(response, 200, { loads: await readLoads(dataFile) });
      }
      if (request.method !== "POST") {
        response.setHeader("allow", "GET, POST");
        return json(response, 405, { error: "Method not allowed" });
      }

      let body = "";
      for await (const chunk of request) {
        body += chunk;
        if (Buffer.byteLength(body) > MAX_BODY_BYTES) return json(response, 413, { error: "Request body too large" });
      }
      let payload;
      try { payload = JSON.parse(body); } catch { return json(response, 400, { error: "Invalid cargo payload" }); }
      if (!isValidLoad(payload)) return json(response, 400, { error: "Invalid cargo payload" });

      const loads = await readLoads(dataFile);
      const load = {
        id: randomUUID(),
        shipper: payload.company.trim(),
        cargoType: payload.cargoType.trim(),
        origin: payload.origin.trim(),
        destination: payload.destination.trim(),
        lane: `${payload.origin.trim()} → ${payload.destination.trim()}`,
        tonnes: payload.tonnes,
        days: payload.days,
        createdAt: new Date().toISOString(),
      };
      loads.unshift(load);
      await mkdir(path.dirname(dataFile), { recursive: true });
      await writeFile(dataFile, `${JSON.stringify(loads, null, 2)}\n`, { mode: 0o600 });
      return json(response, 201, { load });
    } catch (error) {
      console.error("Cargo API error:", error);
      return json(response, 500, { error: "Could not process cargo request" });
    }
  });
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const port = Number(process.env.CARGO_API_PORT || 3001);
  const host = process.env.CARGO_API_HOST || "0.0.0.0";
  createAppServer().listen(port, host, () => console.log(`Cargo API listening on http://${host}:${port}`));
}