<script>
  /**
   * @typedef {import("../../dbtypes.js").Tag} Tag
   * @typedef {import("../../dbtypes.js").User} User
   * @typedef {import("pocketbase").Record} PR
   */
  import { getAvatarUrl } from '$lib/tools.js';
  import MarkdownPage from '$lib/Components/MarkdownPage.svelte';

  export let data;

  /**
   * @param {string} tagID
   * @param {PR|Array.<PR>} tagList
   * @return {Tag}
   * */
  function getTag(tagList, tagID) {
    return /** @type {Tag} */ (tagList.find(/** @param {Tag} tag */ (tag) => tag.id === tagID));
  }
</script>

{#if data.authorityLevel > 0}
  <div class="float-left ml-4 mt-2">
    {#if data.showAll}
      <a href="?" class="btn">hide all</a>
    {:else}
      <a href="?all" class="btn">show all</a>
    {/if}

    <a href="/blog/new/edit" class="btn btn-secondary">Create new</a>
  </div>
{/if}

<div class="float-right mr-4 mt-2">
  <a href="/blog/feed" target="_blank" class="btn rounded-full">
    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12.75 19.5v-.75a7.5 7.5 0 00-7.5-7.5H4.5m0-6.75h.75c7.87 0 14.25 6.38 14.25 14.25v.75M6 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  </a>
</div>

<h1 class="text-center text-6xl text-primary font-bold">Blog</h1>
<h4 class="text-center text-sm mt-1.5"><span>{data.posts.items.length}</span> displayed posts</h4>

<div class="flex flex-col place-items-center justify-center m-8">
  <div class="divider">Recent Posts</div>
  {#each data.posts.items as post (post.id)}
    {@const creator = /** @type {User} */ (post.expand.creator)}
    <a href="/blog/{post.id}">
      <div class="card card-compact w-96 bg-base-300 shadow-xl my-2">
        <div class="card-body" tabindex="-1">
          <h2 class="card-title text-secondary">{post.title}</h2>

          <div class="flex flex-row">
            <div class="avatar">
              <div class="w-8 rounded-full bg-primary text-center leading-9">
                <!-- Add last name to use initials in placeholder?-->
                <img
                  src={getAvatarUrl(creator, '32x32')}
                  width="32"
                  height="32"
                  alt="{creator.name[0]}M"
                />
              </div>
            </div>
            <div class="flex flex-col mx-2 text-accent">
              <p class="p-0 m-0">{creator.name}</p>

              <p class="p-0 m-0 text-xs">
                {new Date(post.datePublished || post.created).toLocaleString(undefined, {
                  dateStyle: 'long'
                })}
              </p>
              {#if !post.published}
                <p class="p-0 m-0 text-xs"><i>unpublished</i></p>
              {/if}
            </div>
          </div>
          <div class="divider" />
          <div class="max-h-40 overflow-clip relative">
            <MarkdownPage text={post.content} />
            <div
              class="absolute inset-0 z-10 w-full h-full bg-gradient-to-t from-base-300 via-base-300/80 to-transparent"
            />
          </div>
          <div class="divider" />

          <div class="flex flex-row">
            {#each post.tags as tagID}
              {@const tag = getTag(post.expand.tags, tagID)}
              <div class="badge mx-1">
                <div class="tooltip" data-tip={tag.description}>
                  #{tag.name}
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </a>
  {/each}
</div>
