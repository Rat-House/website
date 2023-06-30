<script>
  import MarkdownPage from "$lib/Components/MarkdownPage.svelte";

  export let data;
</script>

<a href="/blog" class="btn btn-primary">go back</a>

{#if data.title === ''}
  <p>the article you are looking for is not public</p>
{:else}
  {#if !data.published}
    <p><i>unpublished</i></p>
  {/if}
  <h1 class="text-6xl text-center text-secondary mt-8 mb-4">{data.title}</h1>

  <div class="flex flex-col place-items-center my-2">
    <div class="flex flex-row place-items-center">
      <div class="avatar placeholder">
        <div class="bg-neutral-focus text-neutral-content rounded-full w-8">
          <span class="text-xs">AA</span>
        </div>
      </div>
      <div class="flex flex-col mx-2 text-accent">
        <p class="p-0 m-0">{data.user.name}</p>
        <p class="p-0 m-0 text-xs">{data.published}</p>
      </div>
    </div>
  </div>

  <div class="divider"/>
  <div class="my-8 mx-16">
    <MarkdownPage text={data.content}/>
  </div>
{/if}
