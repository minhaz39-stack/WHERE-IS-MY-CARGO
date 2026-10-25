import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createAppServer } from "./server.js";

let directory;
let server;
let baseUrl;

async function startServer() {
  directory = await mkdtemp(path.join(os.tmpdir(), "cargo-backend-"));
  server = createAppServer({ dataFile: path.join(directory, "loads.json") });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
}

afterEach(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  if (directory) await rm(directory, { recursive: true, force: true });
  server = undefined;
  directory = undefined;
});

test("cargo API persists submitted loads and returns them on subsequent reads", async () => {
  await startServer();
  const payload = { company: "Test Freight", cargoType: "Steel", origin: "Dadri", destination: "JNPT", tonnes: 125, days: 4 };
  const createdResponse = await fetch(`${baseUrl}/api/cargo`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  assert.equal(createdResponse.status, 201);
  const created = await createdResponse.json();
  assert.equal(created.load.shipper, "Test Freight");
  assert.ok(created.load.id);

  const listResponse = await fetch(`${baseUrl}/api/cargo`);
  const listed = await listResponse.json();
  assert.ok(listed.loads.some((load) => load.id === created.load.id));
  const persisted = JSON.parse(await readFile(path.join(directory, "loads.json"), "utf8"));
  assert.ok(persisted.some((load) => load.id === created.load.id));
});

test("cargo API rejects malformed loads without writing them", async () => {
  await startServer();
  const response = await fetch(`${baseUrl}/api/cargo`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ company: "", tonnes: -3 }),
  });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Invalid cargo payload" });
});

test("health endpoint confirms backend readiness", async () => {
  await startServer();
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, service: "where-is-my-cargo-api" });
});