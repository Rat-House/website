<script>
  import './blogpost.pcss';
  import { marked } from 'marked';
  import sanitizeHtml from 'sanitize-html';

  export let text = '';

  function parseMarkdown(markdown) {
    return sanitizeHtml(
      marked.parse(markdown, {
        headerIds: false,
        mangle: false
      })
    );
  }
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags-->
{@html parseMarkdown(text)}
