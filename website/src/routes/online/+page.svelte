<script>
  import { onDestroy, onMount } from "svelte";
  import { authFromCookie, pb } from "$lib/pocketbase.js";
  import { browser } from "$app/environment";

  /** @type{import("./$types").PageServerData} */
  export let data;

  /** @type {string|null} */
  let id = null;
  const collection = pb.collection("online");

  let position = { x: 0, y: 0 };

  /** @type {Array.<{position:{x:number,y:number}, id:string}>} */
  let users = [];

  onMount(() => {
    if (!data.id) return;
    authFromCookie(data.pbCookie);
    collection.subscribe("*", function(e) {
      if (e.record.uid === data.id) return;
      for (const user of users) {
        if (user.id !== e.record.uid) continue;

        user.position = e.record.data;
        users = users;
        return;
      }

      // to reload svelte
      // users.push({
      users = [...users,
        {
          id: e.record.uid,
          position: e.record.data
        }];
    });

    users = data.users;
    console.log(data.users);

    collection.getFirstListItem(`uid="${data.id}"`).then((record) => {
      id = record.id;
    }).catch(() => {
      collection.create({
        uid: data.id || "noid",
        data: position
      }).then((record) => {
        id = record.id;
      });
    });

    // let time = 0;
    // setInterval(() => {
    //   position.x = Math.sin(time/Math.PI);
    //   position.y = Math.cos(time/Math.PI);
    //   time++;
    //   if (id)
    //     collection.update(id, { data: position });
    // }, 300);
  });

  function unload() {
    if (!browser) return;
    console.log("unloading");
    collection.unsubscribe();
    if (id) collection.delete(id);
    id = null;
  }

  onDestroy(unload);

  let width = 1;
  let height = 1;

  let time = 0;
  const interval = 100;

  function handleMouse(e) {
    if ((e.timeStamp - time) < interval) return;
    time = e.timeStamp;

    position.x = +(e.clientX / width * 100).toFixed(2);
    position.y = +(e.clientY / height * 100).toFixed(2);
    if (id)
      collection.update(id, { data: position });
  }
</script>


<svelte:window on:mousemove={handleMouse} on:beforeunload={unload}
               bind:innerWidth={width}
               bind:innerHeight={height}
/>

{id}
<div class="absolute inset-0 -z-50 select-none">
  <div class="absolute text-clip whitespace-nowrap" style="left: {position.x}%; top: {position.y}%;">
    <div class="bg-blue-500 rounded-full w-2 h-2 -translate-x-1/2 -translate-y-1/2"></div>
  </div>
  {#each users as user (user.id)}
    <div class="absolute text-clip whitespace-nowrap" style="left: {user.position.x}%; top: {user.position.y}%;">
      <div class="bg-red-700 rounded-full w-2 h-2 -translate-x-1/2 -translate-y-1/2"></div>
      <p class="-translate-y-10 translate-x-2">{user.id}</p>
    </div>
  {/each}
</div>