<script>
  import { enhance } from '$app/forms';
  import FloatingLabel from '$lib/Components/FloatingLabel.svelte';

  export let form;
  export let data;

  let sending = false;

  let /** @type {string} */ email,
    /** @type {string} */ reason,
    /** @type {string} */ name,
    /** @type {string} */ message;

  function initFields() {
    email = (form?.email ?? '').toString();
    name = (form?.name ?? '').toString();
    reason = (form?.reason ?? '').toString();
    message = (form?.message ?? '').toString();

    if (data.isLoggedIn && form?.error === undefined) {
      email = data.user?.email ?? '';
      name = data.user?.name ?? '';
    }
  }

  initFields();
  // if (form) console.log(form);
</script>

{#if data.isLoggedIn}
  <a href="/contact/read" class="btn">Read messages</a>
{/if}

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

<div class="mx-2 md:mx-0">
  <form
    method="POST"
    action="?/post"
    class="mx-auto md:w-2/3 xl:w-96"
    use:enhance={() => {
      sending = true;
      return async ({ update }) => {
        await update();
        sending = false;
        initFields();
      };
    }}
  >
    <div class="form-control gap-y-3">
      <FloatingLabel>
        <label slot="label" for="name">Name</label>
        <input
          slot="field"
          id="name"
          name="name"
          type="text"
          value={name}
          maxlength="256"
          required
          placeholder=" "
          disabled={sending}
        />
      </FloatingLabel>

      <FloatingLabel>
        <label slot="label" for="email">Email Address</label>
        <input
          slot="field"
          id="email"
          name="email"
          type="email"
          value={email}
          required
          placeholder=" "
          disabled={sending}
        />
      </FloatingLabel>

      <FloatingLabel>
        <label slot="label" for="reason">Reason for contacting</label>
        <select slot="field" name="reason" id="reason" disabled={sending}>
          <!--      <option disabled selected>Reason</option>-->
          {#key reason}
            {#each ['Other', 'Game idea', 'Website issue'] as contactReason}
              <option value={contactReason} selected={reason === contactReason}
                >{contactReason}</option
              >
            {/each}
          {/key}
        </select>
      </FloatingLabel>

      <FloatingLabel>
        <label slot="label" for="message">Message</label>
        <textarea
          slot="field"
          class="textarea-lg"
          id="message"
          name="message"
          required
          rows="5"
          placeholder=" "
          disabled={sending}>{message}</textarea
        >
      </FloatingLabel>
    </div>
    <button disabled={sending} type="submit" class="btn float-right mt-4 mb-2">
      {#if sending}
        <span class="loading loading-spinner" />
        loading
      {:else}
        Send
      {/if}
    </button>
  </form>
</div>
