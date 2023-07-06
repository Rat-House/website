<script>
  import { enhance } from "$app/forms";

  export let form;
  export let data;

  let sending = false;

  let email, reason, name, message;

  function initFields() {
    email = form?.email ?? "";
    name = form?.name ?? "";
    reason = form?.reason || "";
    message = form?.message ?? "";

    if (data.isLoggedIn && form?.error === undefined) {
      email = data.user.email ?? "";
      name = data.user.name ?? "";
    }
  }

  initFields();
  // if (form) console.log(form);
</script>

{#if form?.error}
  <div class="alert alert-error">
    <span>{form.error}</span>
  </div>
{/if}

{#if form?.contactId}
  <div class="alert alert-success">
    <p>Success! your message id is <span class="pre">{form.contactId}</span></p>
  </div>
{/if}

<h2 class="text-3xl text-center">Contact us:</h2>

<form
  method="POST"
  action="?/post"
  class="mx-auto md:w-2/3 xl:w-96"
  use:enhance={()=>{
    sending = true;
    return async ({ update })=>{
      await update();
      sending = false;
      initFields();
    }
  }}
>
  <div class="form-control">
    <label class="label" for="name">
      <span class="label-text">Name</span>
    </label>
    <input class="input input-bordered w-full"
           id="name"
           name="name"
           type="text"
           value={name}
           required
           disabled={sending}
           placeholder="Your name"
    />

    <label class="label" for="email">
      <span class="label-text">Email</span>
    </label>
    <input class="input input-bordered w-full"
           id="email"
           name="email"
           type="email"
           value={email}
           required
           disabled={sending}
           placeholder="Email Address"
    />

    <label class="label" for="reason">
      <span class="label-text">Reason for contacting</span>
    </label>
    <select class="select select-bordered w-full"
            name="reason"
            id="reason"
            disabled={sending}
    >
      <!--      <option disabled selected>Reason</option>-->
      {#key reason}
        {#each ["Other", "Game idea", "Website issue"] as contactReason}
          <option value="{contactReason}" selected={reason === contactReason}>{contactReason}</option>
        {/each}
      {/key}
    </select>

    <label class="label" for="message">
      <span class="label-text">Message</span>
    </label>
    <textarea class="textarea textarea-bordered textarea-lg w-full"
              id="message"
              name="message"
              required
              disabled={sending}
              placeholder="Message"
    >{message}</textarea>
  </div>
  <button
    disabled={sending}
    type="submit"
    class="btn float-right mt-4"
  >
    {#if sending}
      <span class="loading loading-spinner" />
      loading
    {:else}
      Send
    {/if}
  </button>
</form>
