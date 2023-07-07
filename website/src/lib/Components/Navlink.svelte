<script>
  import { page } from '$app/stores';

  /**
   * @type {string}
   */
  export let href;
</script>

<a {href} aria-current={$page.url.pathname.startsWith(href)}>
  <slot />
</a>

<style lang="postcss">
    a[aria-current='true'] {
        @apply font-bold;
    }
</style>
