<script>
  /**
   * @typedef {import("../../../dbtypes.js").User} User
   * @typedef {import("../../../dbtypes.js").Bio} Bio
   */

  import { capitaliseOnlyFirst, getAvatarUrl } from '$lib/tools.js';
  import MarkdownPage from "$lib/Components/MarkdownPage.svelte";

  /** @type {import('./$types').PageData} */
  export let data;

  let user = /** @type {User} */ data.user || {};
</script>

<div class="avatar">
  <div class="w-32 rounded-full">
    <img src={data ? getAvatarUrl(/** @type {User!} */ (user)) : ''} alt="{user.name}'s icon" />
  </div>
</div>
<h1>
  <span>{user.name || user.username}</span> -
  <span>{capitaliseOnlyFirst(data.authorityName)}</span>
</h1>
{#if user.name}
  <h3>{user.username}</h3>
{/if}

{#if user.bio}
<fieldset class="border-y-4 border-x w-1/3 justify-center flex rounded-b-box rounded-t-lg">
  <legend class="mx-auto px-2">
    Bio
  </legend>
  <MarkdownPage text={/** @type {Bio} */(user.expand.bio).bio} />
</fieldset>
{/if}

{Object.keys(user)}
