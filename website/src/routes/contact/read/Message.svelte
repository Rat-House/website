<script>
  import { enhance } from '$app/forms';
  /**
   * @type {import("../../../dbtypes.d").ReadableContact}
   */
  export let message;
  let isRead = message.read;
</script>

<div class="bg-neutral rounded shadow-lg shrink my-2 p-2 relative">
  <p class="float-right">{new Date(message.created).toLocaleString()}</p>
  <h5 class="text-xs select-none">Reason</h5>
  <p>{message.reason}</p>
  <h5 class="text-xs select-none pt-1">Name</h5>
  <p>
    {message.name} (<a
      href="mailto:{message.email}?subject=&body={encodeURIComponent(`Hello ${message.name}`)}"
      >{message.email}</a
    >)
  </p>
  <h5 class="text-xs select-none py-1">Message</h5>
  <textarea readonly class="textarea">{message.message}</textarea>
  <form
    method="POST"
    action="?/{isRead ? 'unread' : 'read'}"
    use:enhance={() => {
      isRead = !isRead;
    }}
  >
    <input type="hidden" name="id" value={message.id} />
    <button
      type="submit"
      class="btn btn-circle btn-sm absolute bottom-1 right-1"
      title="mark as {isRead ? 'unread' : 'read'}"
    >
      <svg viewBox="0 0 10 10" class="fill-none {isRead ? 'fill-neutral' : ''}">
        <circle cx="5" cy="5" r="4.5" />
      </svg>
    </button>
  </form>
</div>
