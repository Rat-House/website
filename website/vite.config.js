import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { open, upgrade } from './src/lib/server/websocket.js';
import { WebSocketServer } from 'ws';

export default defineConfig({
  plugins: [
    sveltekit(),
    {
      name: 'integratedWebsocketServer',
      configureServer(server) {
        if (!server.httpServer) return;
        createWSSGlobalInstance();
        server.httpServer.on('upgrade', onHttpServerUpgrade);
      },
      configurePreviewServer(server) {
        if (!server.httpServer) return;
        createWSSGlobalInstance();
        server.httpServer.on('upgrade', onHttpServerUpgrade);
      }
    }
  ]
});

export const GlobalThisWSS = Symbol.for('sveltekit.wss');

/**
 * @param {import("http").IncomingMessage} req
 * @param {import("stream").Duplex} sock
 * @param {Buffer} head
 */
function onHttpServerUpgrade(req, sock, head) {
  if (req.url !== '/websocket') return;
  upgrade(new Request('http://localhost' + req.url), () => {
    // eslint-disable-next-line no-undef
    const wss = globalThis[GlobalThisWSS];

    wss.handleUpgrade(req, sock, head, (ws) => {
      console.log('[handleUpgrade] creating new connection');
      wss.emit('connection', ws, req);
    });
  });
}

function createWSSGlobalInstance() {
  const wss = new WebSocketServer({ noServer: true });

  // eslint-disable-next-line no-undef
  globalThis[GlobalThisWSS] = wss;

  wss.on('connection', (ws) => {
    ws.socketId = crypto.randomUUID();
    console.log(`[wss:global] client connected (${ws.socketId})`);

    ws.on('close', () => {
      console.log(`[wss:global] client disconnected (${ws.socketId})`);
    });

    open(ws);
  });

  return wss;
}
