// In-memory map: sellerId (string) → Set of SSE response objects
const clients = new Map();

function subscribe(sellerId, res) {
  const id = String(sellerId);
  if (!clients.has(id)) clients.set(id, new Set());
  clients.get(id).add(res);
}

function unsubscribe(sellerId, res) {
  const id = String(sellerId);
  const set = clients.get(id);
  if (!set) return;
  set.delete(res);
  if (set.size === 0) clients.delete(id);
}

function emit(sellerId, event, data) {
  const id = String(sellerId);
  const set = clients.get(id);
  if (!set || set.size === 0) return;
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of set) {
    try { res.write(payload); } catch (_) { set.delete(res); }
  }
}

module.exports = { subscribe, unsubscribe, emit };
