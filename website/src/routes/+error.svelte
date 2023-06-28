<script>
    import { page } from '$app/stores';
</script>

<div class="flex justify-center">
<img src="https://http.cat/{$page.status}" alt="{$page.error.message}" class="max-h-[93vh] w-screen object-contain"/>
</div>