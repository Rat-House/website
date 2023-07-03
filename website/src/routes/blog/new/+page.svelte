<script>
  import MarkdownPage from '$lib/Components/MarkdownPage.svelte';
  let text = '';
</script>

<textarea bind:value={text} cols="30" rows="10" />

<MarkdownPage bind:text />
