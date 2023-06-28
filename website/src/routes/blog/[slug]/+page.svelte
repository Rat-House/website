<script>
  export let data;
</script>

<h1>{data.title}</h1>
<!-- eslint-disable-next-line svelte/no-at-html-tags-->
<p>{@html data.content}</p>
