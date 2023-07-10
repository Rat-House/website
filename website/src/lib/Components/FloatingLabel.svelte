<script>
  import { onMount } from 'svelte';
  import './FloatingLabel.pcss';

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
      select.onchange = () => {
        select.setAttribute('value', select.value);
      };
    }
  });
</script>

<fieldset class="floating relative border border-solid border-gray-300" bind:this={fieldSet}>
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
  }
</style>
