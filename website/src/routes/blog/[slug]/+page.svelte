<script>
  export let data;
</script>

{#if data.title === ''}
  <p>the article you are looking for is not public</p>
{:else}
  {#if !data.published}
    <p><i>unpublished</i></p>
  {/if}
  <h1>{data.title}</h1>
  <!-- eslint-disable-next-line svelte/no-at-html-tags-->
  <p>{@html data.content}</p>
{/if}
