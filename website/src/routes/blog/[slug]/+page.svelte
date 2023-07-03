<script>
  import MarkdownPage from '$lib/Components/MarkdownPage.svelte';
  import { getAvatarUrl } from '$lib/tools.js';

  export let data;
</script>

<a href="/blog" class="btn btn-primary">go back</a>

{#if data.title === ''}
  <p>the article you are looking for is not public</p>
{:else}
  {@const author = /** @type {import("../../../dbtypes.js").User} */ (data.author)}
  <h1 class="text-6xl text-center text-secondary mt-8 mb-4">{data.title}</h1>

  <div class="flex flex-col place-items-center my-2">
    <div class="flex flex-row place-items-center">
      <a href="/user/{author.id}">
        <div class="avatar">
          <div class="bg-neutral-focus text-neutral-content rounded-full w-8 pointer-events-none">
            <img src={getAvatarUrl(author)} alt="{author.name}'s icon" />
          </div>
        </div>
      </a>
      <div class="flex flex-col mx-2 text-accent">
        <a class="p-0 m-0" href="/user/{author.id}">{author.name}</a>
        {#if !data.published}
          <p class="p-0 m-0 text-xs italic">unpublished</p>
        {/if}
        <!-- not really needed here -->
      </div>
    </div>
  </div>

  <div class="divider" />
  <div class="my-8 mx-16">
    <MarkdownPage text={data.content} initialMarkdown={data.initialMarkdown} />
  </div>
{/if}
