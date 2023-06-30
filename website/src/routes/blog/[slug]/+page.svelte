<script>
  import '../blogpost.pcss';
  export let data;
</script>

<a href="/blog" class="btn btn-primary">go back</a>

{#if data.title === ''}
  <p>the article you are looking for is not public</p>
{:else}
  {#if !data.published}
    <p><i>unpublished</i></p>
  {/if}
  <h1>{data.title}</h1>
  <div class="markdown">
    <!-- eslint-disable-next-line svelte/no-at-html-tags-->
    {@html data.content}
  </div>
{/if}
