<script>
  import {capitaliseOnlyFirst, getAvatarUrl} from '$lib/tools.js';

  export let data;
</script>

<div class="avatar">
  <div class="w-32 rounded-full">
    <img src={getAvatarUrl(data.user)} alt="{data.user.name}'s icon"/>
  </div>
</div>
<h1>
  <span>{data.user.name || data.user.username}</span> -
  <span>{capitaliseOnlyFirst(data.authorityName)}</span>
</h1>
{#if data.user.name}
  <h3>{data.user.username}</h3>
{/if}

{Object.keys(data.user)}
