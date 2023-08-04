<script>
  let webSocketEstablished = false;
  /** @type{WebSocket | null} */
  let ws = null;
  /** @type {string[]} */
  let log = [];


  /** @param {string} str */
  function logEvent (str) {
    log = [...log, str];
  }

  function establishWebSocket () {
    if (webSocketEstablished) return;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${protocol}//${window.location.host}/websocket`);
    ws.addEventListener('open', event => {
      webSocketEstablished = true;
      console.log('[websocket] connection open', event);
      logEvent('[websocket] connection open');
    });
    ws.addEventListener('close', event => {
      console.log('[websocket] connection closed', event);
      logEvent('[websocket] connection closed');
    });
    ws.addEventListener('message', event => {
      console.log('[websocket] message received', event);
      logEvent(`[websocket] message received: ${event.data}`);
    });
  }
</script>

<main>
  <h1>SvelteKit with WebSocket Integration</h1>

  <button disabled={webSocketEstablished} on:click={() => establishWebSocket()} class="btn">
    Establish WebSocket connection
  </button>

  <ul>
    {#each log as event}
      <li>{event}</li>
    {/each}
  </ul>
</main>

<style>
    main {
        font-family: sans-serif;
    }
</style>