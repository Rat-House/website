<script>
    import {pb} from "$lib/pocketbase.js";

    let e = pb.collection("posts").getList(1,50,{filter: "published=true"});
</script>

{#await e}
    loading
{:then data}
    {data}
{/await}