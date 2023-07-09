<script>
  import { onMount } from 'svelte';

  /** @type HTMLFieldSetElement */
  let fieldSet;

  onMount(() => {
    const element = fieldSet.querySelector('fieldset>input,fieldset>textarea');
    if (element) {
      element.setAttribute('placeholder', ' ');
    }

    /** @type {HTMLSelectElement|null} */
    const select = fieldSet.querySelector('fieldset>select');
    if (select) {
      select.setAttribute('value', select.value);
      select.onclick = () => {
        select.setAttribute('value', select.value);
      };
    }
  });
</script>

<fieldset class="relative border border-solid border-gray-300" bind:this={fieldSet}>
  <legend>
    <slot name="label">
      <label for="demoItem">Label</label>
    </slot>
  </legend>
  <slot name="field">
    <input type="text" id="demoItem" placeholder=" " />
  </slot>
</fieldset>

<style lang="postcss">
  fieldset {
    border-radius: var(--rounded-btn, 0.5rem);
    border-width: 1px;
    --tw-border-opacity: 1;
    --tw-bg-opacity: 1;
    border-color: hsl(var(--b2) / var(--tw-border-opacity));
    background-color: hsl(var(--b1) / var(--tw-bg-opacity));

    > :global(input) {
      @apply input input-ghost w-full focus:outline-none -mt-2.5 pb-1.5;
    }

    > :global(select) {
      @apply select select-ghost w-full focus:outline-none -mt-2.5 pb-1.5;
    }

    > :global(textarea) {
      @apply textarea textarea-ghost w-full focus:outline-none -mt-2.5 pb-1.5;
    }

    legend {
      @apply transform w-auto px-1 ml-2 duration-300 pointer-events-none;

      :global(label) {
        @apply select-auto text-accent truncate;
        @apply transform scale-75;
      }

      &:has(+ input:focus),
      &:has(+ textarea:focus),
      &:has(+ select:focus) {
        :global(label) {
          @apply text-accent-focus;
        }
      }

      &:not(
          &:has(+ input:focus),
          &:has(+ input:not(:placeholder-shown)),
          &:has(+ textarea:focus),
          &:has(+ textarea:not(:placeholder-shown)),
          &:has(+ select:focus),
          &:has(+ select:not([value='']):valid)
        ) {
        @apply w-0 px-0 translate-y-6 translate-x-2 scale-100 pointer-events-none;

        :global(label) {
          @apply select-none scale-100;
        }
      }
    }
  }
</style>
