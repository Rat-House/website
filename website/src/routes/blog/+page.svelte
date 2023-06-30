<script>
  export let data;

  /**
   * @typedef {{id:string,name?:string,description?:string,colour?:string}} Tag
   * @typedef {import("pocketbase").Record} RR
   * @param {string} tagID
   * @param {RR|Array.<RR>} tagList
   * @return {Tag}
   * */
  function getTag(tagList, tagID) {
    return tagList.find(/** @param {Tag} tag */ (tag) => tag.id === tagID) || { id: tagID };
  }

  console.log(data.posts);
</script>

{#each data.posts.items as post}
  <a href="/blog/{post.id}">
    <div class="card card-compact w-96 bg-base-300 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">{post.title}</h2>
        {#each post.tags as tagID}
          {@const tag = getTag(post.expand.tags, tagID)}
          <div class="badge">
            <div class="tooltip" data-tip={tag.description}>
              {tag.name}
            </div>
          </div>
        {/each}
        <p >{post.expand.creator.name}</p>
      </div>
    </div>
  </a>
{/each}
