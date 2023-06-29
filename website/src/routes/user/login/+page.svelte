<script>
  import Login from '$lib/Components/Login.svelte';

  export let data;
</script>

<Login providers={data.providers} />
