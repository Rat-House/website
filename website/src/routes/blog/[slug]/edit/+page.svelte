<script>
  import { applyAction, enhance } from '$app/forms';
  import MarkdownPage from '$lib/Components/MarkdownPage.svelte';
  import { browser } from '$app/environment';

  export let data;
  export let form;

  let sending = false;

  let content = '';
  let title = '';
  let published = false;
  if (form?.error === undefined && data) {
    title = data.title;
    content = data.content;
    published = data.published;
  } else if (form?.error !== undefined) {
    content = form?.content?.toString() ?? '';
    title = form?.title?.toString() ?? '';
  }
</script>

{#if form?.error}
  <div class="alert alert-error">
    <span>{form.error}</span>
  </div>
{/if}

{#if form?.blogId}
  <div class="alert alert-success">
    <p>
      Success! your post is now available at <a class="link" href="/blog/{form.blogId}"
        >{form.blogId}</a
      >
    </p>
  </div>
{/if}

<div class="grid mx-auto {browser ? 'lg:grid-cols-2' : ''} w-11/12 md:w-4/5 2xl:w-3/4 gap-4">
  <form
    method="POST"
    action="?/post"
    class="mx-auto w-full"
    use:enhance={() => {
      sending = true;
      return async ({ result }) => {
        await applyAction(result);
        sending = false;

        if (form?.error === undefined) {
          title = '';
          content = '';
        }
      };
    }}
  >
    <input type="hidden" name="blogId" value={data?.blogId ?? ''} />

    <div class="form-control">
      <label class="label" for="title">
        <span class="label-text">Title</span>
      </label>
      <input
        class="input input-bordered w-full"
        id="title"
        name="title"
        type="text"
        bind:value={title}
        required
        disabled={sending}
        placeholder="Title"
      />

      <label class="label" for="content">
        <span class="label-text">Blog Post</span>
      </label>
      <textarea
        class="textarea textarea-bordered textarea-lg w-full"
        id="content"
        name="content"
        required
        disabled={sending}
        bind:value={content}
        placeholder="Content"
        rows="15"
      />
    </div>

    <div class="join float-right mt-4">
      <button disabled={sending} name="save" value="save" type="submit" class="btn join-item">
        {#if sending}
          <span class="loading loading-spinner" />
        {/if}
        {#if published}
          Unpublish and save
        {:else}
          Save draft
        {/if}
      </button>
      <button
        disabled={sending}
        name="save"
        value="publish"
        type="submit"
        class="btn btn-primary join-item"
      >
        {#if published}
          Save
        {:else}
          Publish
        {/if}
      </button>
      <div />
    </div>
  </form>

  {#if browser}
    <div class="table">
      <h1 class="text-3xl text-center text-secondary mt-8 mb-4 {title ? '' : 'italic'}">
        {title || 'Title'}
      </h1>
      <div class="bg-base-200 rounded-md px-4 py-1 pl-8 min-h-16 {content ? '' : 'italic'}">
        <MarkdownPage text={content || 'Content'} />
      </div>
    </div>
  {/if}
</div>
