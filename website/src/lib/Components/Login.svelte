<script>
  import { createEventDispatcher } from "svelte";
  import { invalidateAll } from "$app/navigation";

  /** @type string */
  export let provider;
  export let text = undefined;

  const classes = $$props.class ?? "btn btn-accent btn-sm m-0.5"

  if (!text) text = "Login with " + provider;

  const dispatcher = createEventDispatcher();

  function authLogin() {
    console.log(`logging in with ${provider}`);

    let width = 1024;
    let height = 768;

    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    // normalize window size
    width = width > windowWidth ? windowWidth : width;
    height = height > windowHeight ? windowHeight : height;

    let left = windowWidth / 2 - width / 2;
    let top = windowHeight / 2 - height / 2;

    const w = window.open(
      `/user/login?provider=${provider}&window`,
      "oauth2-popup",
      `width=${width},height=${height},top=${top},left=${left},resizable,menubar=no`
    );

    // catch auth finish
    const bc = new BroadcastChannel("log_in");
    /** @param {MessageEvent} m */
    bc.onmessage = (m) => {
      console.log(m);

      dispatcher("auth");
      invalidateAll();
      bc.close();
    };
    if (w) w.onclose = console.log;
  }
</script>

<a
  href="/user/login?provider={provider}"
  class={classes}
  data-sveltekit-preload-data="tap"
  on:click|preventDefault={authLogin(provider)}>{text}</a
>