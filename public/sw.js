const transfers = new Map(); // id -> { chunks: [], controller, closed }

self.addEventListener('message', (event) => {
  const { type, transferId, chunk } = event.data || {};
  if (!transferId) return;

  let t = transfers.get(transferId);
  if (!t) {
    t = { chunks: [], controller: null, closed: false };
    transfers.set(transferId, t);
  }

  if (type === 'CHUNK') {
    if (t.controller) {
      try { t.controller.enqueue(new Uint8Array(chunk)); } catch {}
    } else {
      t.chunks.push(chunk);        // ✅ буферизуем до fetch
    }
  } else if (type === 'CLOSE') {
    t.closed = true;
    if (t.controller) {
      try { t.controller.close(); } catch {}
      transfers.delete(transferId);
    }
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (!url.pathname.endsWith('/p2p-download-stream')) return;

  const transferId = url.searchParams.get('id');
  const filename = url.searchParams.get('name') || 'file';

  if (!transferId) {
    event.respondWith(new Response('missing id', { status: 400 }));
    return;
  }

  let t = transfers.get(transferId);
  if (!t) {
    t = { chunks: [], controller: null, closed: false };
    transfers.set(transferId, t);
  }

  const stream = new ReadableStream({
    start(controller) {
      t.controller = controller;
      // ✅ сливаем накопленное
      for (const c of t.chunks) controller.enqueue(new Uint8Array(c));
      t.chunks = [];
      if (t.closed) {
        try { controller.close(); } catch {}
        transfers.delete(transferId);
      }
    },
    cancel() {
      transfers.delete(transferId);
    }
  });

  const headers = new Headers({
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
    'Cache-Control': 'no-store'
  });

  event.respondWith(new Response(stream, { headers }));
});