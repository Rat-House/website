<script>
  export let data;

  /**
   * @typedef {{level:number,name:string}} Auth
   * @typedef {{name:string,avatar:string,authority:string, expand:{authority:Auth}}} User
   * @typedef {{id:string,name?:string,description?:string,colour?:string}} Tag
   * @typedef {import("pocketbase").Record} RR
   * @param {string} tagID
   * @param {RR|Array.<RR>} tagList
   * @return {Tag}
   * */
  function getTag(tagList, tagID) {
    return tagList.find(/** @param {Tag} tag */(tag) => tag.id === tagID) || {id: tagID};
  }

  /**
   * @param {RR|Array.<RR>} user
   * @return {User}
   */
  function convertUserType(user) {
    return /** @type {User} */ (/** @type {unknown} */ (user));
  }

  // console.log(data.posts);
</script>

<h1 class="text-center text-6xl text-primary font-bold">Blog</h1>

<div class="flex flex-col place-items-center justify-center m-8">
  <div class="divider">Recent Posts</div>
  {#each data.posts.items as post}
    {@const creator =convertUserType(post.expand.creator) }
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
              <p class="p-0 m-0 text-xs">{post.created}</p>
            </div>
          </div>
          <div class="divider" />
          <p class="truncate">{post.content}</p>
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
