<script>
  /**
   * @typedef {import("../../../dbtypes.js").User} User
   * @typedef {import("../../../dbtypes.js").Bio} Bio
   */

  import { capitaliseOnlyFirst, getAvatarUrl } from '$lib/tools.js';
  import MarkdownPage from '$lib/Components/MarkdownPage.svelte';

  /** @type {import("./$types").PageData} */
  export let data;

  let user = /** @type {User} */ data.user || {};
</script>

<div class="flex items-center shadow-xl rounded-box w-fit px-8 py-4 mb-7 mx-auto">
  <div class="avatar border-2 border-secondary rounded-full m-1.5">
    <div class="w-32 rounded-full">
      <img src={data ? getAvatarUrl(/** @type {User!} */ (user)) : ''} alt="{user.name}'s icon" />
    </div>
  </div>

  <div class="pl-2">
    <h2 class="text-sm mb-3">{capitaliseOnlyFirst(data.authorityName)}</h2>
    <h1 class="text-4xl">{user.name || user.username}</h1>
    <h3 class="before:content-['@'] text-lg">{user.username}</h3>
  </div>
</div>

{#if user.bio}
  <fieldset
    class="border-y-4 border-x mx-4 md:w-1/2 justify-center flex rounded-b-box rounded-t-lg md:mx-auto border-neutral"
  >
    <legend class="mx-auto px-2"> Bio </legend>
    <MarkdownPage text={/** @type {Bio} */ (user.expand.bio).bio} />
  </fieldset>
{/if}

<!--{Object.keys(user)}-->
