<script>
  import PocketBase from 'pocketbase';
  import { PUBLIC_POCKETBASE_PAGEURL } from '$env/static/public';

  const pb = new PocketBase(PUBLIC_POCKETBASE_PAGEURL); //'/');

  const result = pb.collection('tags').getList(1, 50, {
    filter: 'created >= "2022-01-01 00:00:00"'
  });
</script>

tags:<br />
{#await result}
  loading...
{:then r}
  {#each r.items as item}
    {item.name} - {item.description}<br />
  {/each}
{/await}
