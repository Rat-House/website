<script>
  import MarkdownPage from '$lib/Components/MarkdownPage.svelte';
  import { getAvatarUrl } from '$lib/tools.js';
  import { page } from '$app/stores';

  /**
   * @typedef {import("../../../dbtypes.d").User} User
   */

  /** @type {import("./$types").PageData} */
  export let data;
</script>

<div class="flex flex-row relative pointer-events-none">
  <a href="/blog" class="btn btn-primary mt-1 ml-4 pointer-events-auto">go back</a>

  <div class="grow my-10" />

  {#if data.userAuth >= 1}
    <a href="{$page.url.pathname}/edit" class="btn btn-secondary mt-1 mr-4 pointer-events-auto"
      >Edit</a
    >
  {/if}
</div>

{#if data.title === ''}
  <p>the article you are looking for is not public</p>
{:else}
  {@const author = /** @type {User} */ (data.author)}
  {@const latestEditor = /**@type{User}*/ (data.lastEditor)}
  <div class="text-center sm:-mt-20 m-0 sm:w-2/3 mx-auto">
    <h1 class="text-6xl text-center text-secondary">{data.title}</h1>
  </div>

  <div class="flex flex-col place-items-center my-2">
    <div>
      <div class="flex flex-row place-items-center">
        <a href="/user/{author.id}">
          <div class="avatar">
            <div class="w-8 rounded-full bg-primary text-center leading-8">
              <img
                src={getAvatarUrl(author, '32x32')}
                width="32"
                height="32"
                alt="{author.name[0]}M"
              />
            </div>
          </div>
        </a>
        <div class="flex flex-col mx-2 text-accent">
          <a class="p-0 m-0" href="/user/{author.id}">{author.name}</a>
          {#if !data.published}
            <p class="p-0 m-0 text-xs italic">unpublished</p>
          {/if}
          <p class="p-0 m-0 text-xs">
            created <span>{data.created.toLocaleString(undefined, { dateStyle: 'long' })}</span>
          </p>
          {#if +data.created !== +data.edited && latestEditor.id === author.id}
            <p class="p-0 m-0 text-xs">
              edited <span>{data.edited.toLocaleString(undefined, { dateStyle: 'long' })}</span>
            </p>
          {/if}
        </div>
      </div>
      {#if +data.created !== +data.edited && latestEditor.id !== author.id}
        <div class="flex flex-row place-items-center">
          <a href="/user/{latestEditor.id}">
            <div class="avatar">
              <div
                class="bg-neutral-focus text-neutral-content rounded-full w-8 text-center leading-8"
              >
                <img src={getAvatarUrl(latestEditor)} alt="{latestEditor.name[0]}M" />
              </div>
            </div>
          </a>
          <div class="flex flex-col mx-2 text-accent">
            <a class="p-0 m-0" href="/user/{latestEditor.id}">{latestEditor.name}</a>
            <p class="p-0 m-0 text-xs">
              edited <span>{data.edited.toLocaleString(undefined, { dateStyle: 'long' })}</span>
            </p>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <div class="divider" />
  <div class="mb-8 mx-5">
    <MarkdownPage text={data.content} initialMarkdown={data.initialMarkdown} />
  </div>
{/if}
