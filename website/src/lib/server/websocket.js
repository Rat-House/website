/** @type {import("svelte-adapter-bun").WebSocketHandler.open} */
export function open(ws) {
  console.log("WebSocket opened");
  ws.send("hullo");
}

/**
 * @param {Request} request
 * @param {(Request)=>void} upgrade
 */
export function upgrade(request, upgrade) {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/websocket")) {
    return upgrade(request);
  }
}
