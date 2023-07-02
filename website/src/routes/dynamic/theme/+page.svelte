<script>
  import { capitaliseOnlyFirst } from '$lib/tools';
  /** @type {import("./$types").PageServerData}  */
  export let data;
</script>

you are using {capitaliseOnlyFirst(data.theme)} theme
