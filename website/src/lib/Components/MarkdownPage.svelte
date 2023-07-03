<script>
  import './blogpost.pcss';
  import { renderMarkdown } from './markdownitParser.js';
  import { afterUpdate, onMount } from 'svelte';

  export let text = '';

  /** @type {Object.<string, import("../../dbtypes").User>} */
  let users = {};
  /** @type {Array.<string>} */
  let notUsers = [];

  /**
   * @param {Array.<HTMLLinkElement>} userNodes
   * @return {Promise<void>}
   */
  async function getNewUsers(userNodes) {
    const userList = userNodes
      .map((u) => u.href.replace(/^.*\//, ''))
      .filter((u) => !(u in users || notUsers.includes(u)));
    if (userList.length === 0) return;

    const results = await fetch(`/dynamic/userList?${userList.map((u) => `user=${u}`).join('&')}`);
    /** @type {Object.<string, import("../../dbtypes").User>} */
    const json = await results.json();
    for (const username of userList) {
      if (username in json) users[username] = json[username];
      else notUsers.push(username);
    }
  }

  /**
   * @param {Array.<HTMLElement>} userNodes
   */
  function updateUserNodes(userNodes) {
    for (let user of userNodes) {
      if (user.innerText in users) {
        user.innerText = users[user.innerText].name;
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

  async function updateUsers() {
    /** @type {Array.<HTMLLinkElement>} */
    const userNodes = Array.from(document.querySelectorAll('a.user'));
    await getNewUsers(userNodes);
    updateUserNodes(userNodes);
  }

  onMount(updateUsers);
  afterUpdate(updateUsers);
</script>

<div class="markdown">
  <!-- eslint-disable-next-line svelte/no-at-html-tags-->
  {@html renderMarkdown(text)}
</div>
