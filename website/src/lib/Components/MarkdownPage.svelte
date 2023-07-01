<script>
  import './blogpost.pcss';
  import { renderMarkdown } from './markdownitParser.js';
  export let text = '';
</script>

<div class="markdown">
  <!-- eslint-disable-next-line svelte/no-at-html-tags-->
  {@html renderMarkdown(text)}
</div>
