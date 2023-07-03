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

  /**
   * @param {string} text
   * @return {Promise<void>}
   */
  async function updateMarkdown(text) {
    markdown = await renderMarkdown(text, pb);
  }

  onMount(() => renderMarkdown(text));

  $: if (browser) updateMarkdown(text);
</script>

<div class="markdown">
  <!-- eslint-disable-next-line svelte/no-at-html-tags-->
  {@html markdown}
</div>
