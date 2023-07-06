<script>
  import { browser } from '$app/environment';
  import Message from './Message.svelte';

  export let data;
  if (browser) console.log(data);
</script>

<div class="flex">
  <div class="grid-flow-row mx-auto">
    {#each data.messages as message}
      <Message {message} />
    {/each}
  </div>
</div>
