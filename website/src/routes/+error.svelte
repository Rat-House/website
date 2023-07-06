<script>
  import { page } from '$app/stores';
  import { HeaderBuilder } from '$lib/headers.js';
  import { MetaTags } from 'svelte-meta-tags';

  const errorMessage = $page.error ? $page.error.message : 'error';

  const headers = new HeaderBuilder()
    .setTitle(`Error ${$page.status}`)
    .setDescription(errorMessage)
    .updateUrl($page.url)
    .setImage(`${$page.url.origin}/favicon-128.png`, 'website logo')
    .export();
</script>

<MetaTags {...headers} />

<div class="flex justify-center">
  <img
    src="https://http.cat/{$page.status}"
    alt={errorMessage}
    title={errorMessage}
    class="max-h-[93vh] w-screen object-contain"
  />
</div>
