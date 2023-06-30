<script>
  /**
   * @typedef {import("../../dbtypes.js").Tag} Tag
   * @typedef {import("../../dbtypes.js").User} User
   * @typedef {import("pocketbase").Record} PR
   */
  import { getAvatarUrl } from '$lib/avatar.js';
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

  // console.log(data.posts);
</script>

<h1 class="text-center text-6xl text-primary font-bold">Blog</h1>

<div class="flex flex-col place-items-center justify-center m-8">
  <div class="divider">Recent Posts</div>
  {#each data.posts.items as post}
    {@const creator = /** @type {User} */ (post.expand.creator)}
    <a href="/blog/{post.id}">
      <div class="card card-compact w-96 bg-base-300 shadow-xl">
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
              <img
                src={getAvatarUrl(creator, '32x32')}
                class="rounded-full"
                width="32"
                height="32"
                alt="avatar"
              />
              <p class="p-0 m-0 text-xs">{post.created}</p>
            </div>
          </div>
          <div class="divider" />
          <div class="max-h-40 overflow-y-clip">
            <MarkdownPage text={post.content} />
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
