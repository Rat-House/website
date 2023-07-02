<script>
  import './blogpost.pcss';
  import { renderMarkdown } from './markdownitParser.js';
  import { onMount } from 'svelte';

  export let text = '';

  onMount(() => {
    /** @type {Array.<HTMLLinkElement>} */
    const users = Array.from(document.querySelectorAll('a.user'));
    if (users.length !== 0) {
      fetch(`/dynamic/userList?=${users.map((u) => `user=${u.innerText}`).join('&')}`).then(
        async (r) => {
          const results = await r.json();
          for (let user of users) {
            if (user.innerText in results) {
              user.innerText = results[user.innerText].name;
            } else {
              const noUser = document.createElement('span');
              noUser.innerHTML = user.innerHTML;
              noUser.classList.add(...user.classList);
              if (user.parentNode == null) continue;
              user.parentNode.insertBefore(noUser, user);
              user.parentNode.removeChild(user);
            }
          }
        }
      );
    }
  });
</script>

<div class="markdown">
  <!-- eslint-disable-next-line svelte/no-at-html-tags-->
  {@html renderMarkdown(text)}
</div>
