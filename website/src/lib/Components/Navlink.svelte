<script>
  import { page } from '$app/stores';

  /**
   * @type {string}
   */
  export let href;
</script>

<a {href} class={$page.url.pathname.startsWith(href) ? 'font-bold' : ''}>
  <slot />
</a>
