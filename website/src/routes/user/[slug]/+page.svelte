<script>
  /**
   * @typedef {import("../../../dbtypes.js").User} User
   */

  import { capitaliseOnlyFirst, getAvatarUrl } from '$lib/tools.js';

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

{Object.keys(user)}
