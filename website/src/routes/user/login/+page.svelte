<script>
  import LoginList from '$lib/Components/LoginList.svelte';

  export let data;
</script>

<LoginList providers={data.providers} />
