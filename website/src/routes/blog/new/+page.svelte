<script>
  import { enhance } from '$app/forms';
  import MarkdownPage from '$lib/Components/MarkdownPage.svelte';
  import { browser } from '$app/environment';

  export let form;

  let sending = false;

  let content = form ? form.content : undefined ?? '';
  let title = form ? form.title : undefined ?? '';
</script>

{#if form?.error}
  <div class="alert alert-error">
    <span>{form.error}</span>
  </div>
{/if}

{#if form?.blogId && form?.new}
  <div class="alert alert-success">
    <p>
      Success! your post is now available at <a class="link" href="/blog/{form.blogId}"
        >{form.blogId}</a
      >
    </p>
  </div>
{/if}

<div class="grid mx-auto {browser ? 'lg:grid-cols-2' : ''} w-2/3 gap-4">
  <form
    method="POST"
    action="?/post"
    class="mx-auto w-full"
    use:enhance={() => {
      sending = true;
      return async ({ update }) => {
        await update();
        sending = false;
      };
    }}
  >
    <input type="hidden" name="blogId" value={form?.blogId ?? ''} />

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
      />
    </div>
    <button disabled={sending} type="submit" class="btn float-right mt-4">
      {#if sending}
        <span class="loading loading-spinner" />
        loading
      {:else}
        Send
      {/if}
    </button>
  </form>

  {#if browser}
    <div class="table">
      <h1 class="text-3xl text-center text-secondary mt-8 mb-4 {title ? '' : 'italic'}">
        {title || 'Title'}
      </h1>
      <div class="bg-base-200 rounded-md px-4 py-1 min-h-16 {content ? '' : 'italic'}">
        <MarkdownPage text={content || 'Content'} />
      </div>
    </div>
  {/if}
</div>
