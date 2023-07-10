<script>
  /**
   * @typedef {import("../../../dbtypes.js").User} User
   * @typedef {import("../../../dbtypes.js").Bio} Bio
   * @typedef {import("../../../dbtypes.js").Authority} Authority
   */

  import { capitaliseOnlyFirst, getAvatarUrl } from '$lib/tools.js';
  import MarkdownPage from '$lib/Components/MarkdownPage.svelte';
  import { enhance } from '$app/forms';

  /** @type {import("./$types").PageData} */
  export let data;

  let user = /** @type {User} */ data.selectedUser || {};

  /** @type {Array<Authority>} */
  const authorities = /** @type {Array<Authority>} */ (data.authorities) ?? [];
  let authority = authorities.find((a) => a.id === user.authority);
  const userAuth = authorities.find((a) => a.id === data.user?.authority);
</script>

{#if user.id === data.user?.id}
  <a class="absolute btn right-4 mt-2" href="/user/settings">Edit</a>
{:else if userAuth && userAuth.level >= 2}
  <div class="absolute right-4 mt-2">
    <form
      class="join join-vertical lg:join-horizontal"
      method="post"
      action="/user/settings?/promote"
      use:enhance={({ formData }) =>
        async ({ update, result }) => {
          if (result.type !== 'failure')
            authority = authorities.find((a) => String(a.level) === formData.get('auth'));
          await update();
        }}
    >
      <input value={user.id} name="user" type="hidden" />
      {#each data.authorities as auth}
        <button
          name="auth"
          type="submit"
          value={auth.level}
          disabled={auth.level > userAuth.level}
          class="btn {auth.id === authority?.id ? 'btn-primary' : ''} join-item">{auth.name}</button
        >
      {/each}
    </form>
  </div>
{/if}

<div class="flex items-center shadow-xl rounded-box w-fit px-8 py-4 mb-7 mx-auto bg-base-200">
  <div class="avatar border-2 border-neutral rounded-full m-1.5">
    <div class="w-32 rounded-full">
      <img src={data ? getAvatarUrl(/** @type {User!} */ (user)) : ''} alt="{user.name}'s icon" />
    </div>
  </div>

  <div class="pl-2">
    <h2 class="text-sm mb-3">{capitaliseOnlyFirst(authority?.name ?? '')}</h2>
    <h1 class="text-4xl">{user.name || user.username}</h1>
    <h3 class="before:content-['@'] text-lg">{user.username}</h3>
  </div>
</div>

{#if user.bio}
  {@const bio = /** @type {Bio} */ (user.expand.bio)}
  <fieldset
    class="border-y-4 border-x mx-4 md:w-1/2 justify-center flex rounded-b-box rounded-t-lg md:mx-auto border-neutral"
  >
    <legend class="mx-auto px-2">Bio</legend>
    <MarkdownPage text={bio.bio} />
  </fieldset>
{/if}

<!--{Object.keys(user)}-->
