<script>
    export let data;
</script>

{#each data.providers as provider}
    <a href="?provider={provider}"
       class="btn"
       data-sveltekit-preload-data="tap"
    >Login with {provider}</a>
{/each}