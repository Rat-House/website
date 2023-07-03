<script>
  import './blogpost.pcss';
  import { renderMarkdown } from './markdownitParser.js';
  import { pb } from '$lib/pocketbase';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  export let text = '';
  /** @type {string|undefined} */
  export let initialMarkdown = undefined;

  let markdown = initialMarkdown || /** @type {string!} */ renderMarkdown(text);
  let loaded = initialMarkdown === undefined;

  /**
   * @param {string} text
   * @return {Promise<void>}
   */
  async function updateMarkdown(text) {
    if (!loaded) return;
    markdown = await renderMarkdown(text, pb);
  }

  onMount(() => (loaded = true));

  $: if (browser) updateMarkdown(text);
</script>

<div class="markdown">
  <!-- eslint-disable-next-line svelte/no-at-html-tags-->
  {@html markdown}
</div>
