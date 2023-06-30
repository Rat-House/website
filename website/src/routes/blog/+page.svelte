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
  {#if data.showAll}
    <a href="?" class="btn">hide all</a>
  {:else}
    <a href="?all" class="btn">show all</a>
  {/if}
{/if}

<h1 class="text-center text-6xl text-primary font-bold">Blog</h1>
<h4 class="text-center text-sm mt-1.5"><span>{data.posts.items.length}</span> displayed posts</h4>

<div class="flex flex-col place-items-center justify-center m-8">
  <div class="divider">Recent Posts</div>
  {#each data.posts.items as post (post.id)}
    {@const creator = /** @type {User} */ (post.expand.creator)}
    <a href="/blog/{post.id}">
      <div class="card card-compact w-96 bg-base-300 shadow-xl my-2">
        <div class="card-body">
          <h2 class="card-title text-secondary">{post.title}</h2>

          <div class="flex flex-row">
            <div class="avatar placeholder">
              <div class="bg-neutral-focus text-neutral-content rounded-full w-8">
                <span class="text-xs">AA</span>
              </div>
            </div>
            <div class="flex flex-col mx-2 text-accent">
              <p class="p-0 m-0">{creator.name}</p>
              <div class="avatar">
                <div class="w-8 rounded-full">
                  <img
                    src={getAvatarUrl(creator, '32x32')}
                    width="32"
                    height="32"
                    alt="{creator.name}'s icon"
                  />
                </div>
              </div>
              <p class="p-0 m-0 text-xs">{post.created}</p>
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
