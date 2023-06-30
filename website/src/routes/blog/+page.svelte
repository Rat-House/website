<script>
  export let data;
</script>

{#each data.posts.items as post}
  <a href="/blog/{post.id}">
  <div class="card card-compact w-96 bg-base-300 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">{post.title}</h2>
      {#each post.tags as tagID}
        {@const tag = post.expand.tags.find(v => v.id === tagID)}
        <div class="badge">
          <div class="tooltip" data-tip="{tag.description}">
            {tag.name}
          </div>
        </div>
      {/each}
      <p></p>
    </div>
  </div>
  </a>
{/each}
