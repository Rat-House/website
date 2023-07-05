<script>
  import MarkdownPage from '$lib/Components/MarkdownPage.svelte';
  import { getAvatarUrl } from '$lib/tools.js';
  import { MetaTags } from 'svelte-meta-tags';

  /**
   * @typedef {import("../../../dbtypes.d").User} User
   */

  /** @type {import("./$types").PageData} */
  export let data;
</script>

<MetaTags
  title="Using More of Config"
  description="This example uses more of the available config options."
  canonical="https://www.canonical.ie/"
  openGraph={{
    url: 'https://www.url.ie/a',
    title: 'Open Graph Title',
    description: 'Open Graph Description',
    images: [
      {
        url: 'https://www.example.ie/og-image-01.jpg',
        width: 800,
        height: 600,
        alt: 'Og Image Alt'
      },
      {
        url: 'https://www.example.ie/og-image-02.jpg',
        width: 900,
        height: 800,
        alt: 'Og Image Alt Second'
      },
      { url: 'https://www.example.ie/og-image-03.jpg' },
      { url: 'https://www.example.ie/og-image-04.jpg' }
    ],
    site_name: 'SiteName'
  }}
/>

<a href="/blog" class="btn btn-primary">go back</a>

{#if data.title === ''}
  <p>the article you are looking for is not public</p>
{:else}
  {@const author = /** @type {User} */ (data.author)}
  {@const latestEditor = /**@type{User}*/ (data.lastEditor)}
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
        <p class="p-0 m-0 text-xs">created <span>{data.created.toLocaleString()}</span></p>
        {#if +data.created !== +data.edited && latestEditor.id === author.id}
          <p class="p-0 m-0 text-xs">edited <span>{data.edited.toLocaleString()}</span></p>
        {/if}
      </div>
    </div>
    {#if +data.created !== +data.edited && latestEditor.id !== author.id}
      <div class="flex flex-row place-items-center">
        <a href="/user/{latestEditor}">
          <div class="avatar">
            <div class="bg-neutral-focus text-neutral-content rounded-full w-8 pointer-events-none">
              <img src={getAvatarUrl(latestEditor)} alt="{latestEditor.name}'s icon" />
            </div>
          </div>
        </a>
        <div class="flex flex-col mx-2 text-accent">
          <a class="p-0 m-0" href="/user/{latestEditor.id}">{latestEditor.name}</a>
          <p class="p-0 m-0 text-xs">edited <span>{data.edited.toLocaleString()}</span></p>
        </div>
      </div>
    {/if}
  </div>

  <div class="divider" />
  <div class="my-8 mx-16">
    <MarkdownPage text={data.content} initialMarkdown={data.initialMarkdown} />
  </div>
{/if}
