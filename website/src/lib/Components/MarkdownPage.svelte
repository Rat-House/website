<script>
  import './blogpost.pcss';
  import { marked } from 'marked';
  import sanitizeHtml from 'sanitize-html';

  export let text = '';

  /**
   * @param {string} markdown
   * @return {string}
   */
  function parseMarkdown(markdown) {
    return sanitizeHtml(
      marked.parse(markdown, {
        headerIds: false,
        mangle: false
      })
    );
  }
</script>

<div class="markdown">
  <!-- eslint-disable-next-line svelte/no-at-html-tags-->
  {@html parseMarkdown(text)}
</div>
