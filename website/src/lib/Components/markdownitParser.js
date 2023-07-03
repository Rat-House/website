import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token';
import hljs from 'highlight.js';
import sanitizeHtml from 'sanitize-html';
import GithubSlugger from 'github-slugger';

//borrowing from https://github.com/Flet/markdown-it-github-headings/blob/master/index.js

const headerslugger = new GithubSlugger();
const linkSlugger = new GithubSlugger();
const usernames = /(?<![[\\])@([a-z0-9-_]+)/gi;

const md = MarkdownIt({
  html: true,
  xhtmlOut: true,
  /**
   * @param {string} str
   * @param {string} lang
   * @return {string}
   */
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (e) {
        console.warn(e);
      }
    }

    return ''; // use external default escaping
  }
});

/** @type {import("markdown-it/lib/parser_core")} */ (md.core).ruler.push('headingLinks', () => {
  // {src}
  headerslugger.reset();
  linkSlugger.reset();
});

/**
 * @typedef {import("markdown-it/lib/renderer")} Renderer
 * @param {Array.<Token>} tokens
 * @param {number} idx
 * @param {Object} options
 * @param {Renderer} self
 * @return {*}
 */
const proxy = (tokens, idx, options, self) => self.renderToken(tokens, idx, options);
// const defaultLinkRenderer = /** @type {Renderer} */ (md.renderer).rules.link_open || proxy;
const defaultTextRenderer = /** @type {Renderer} */ (md.renderer).rules.text || proxy;
const titleId = /[^\\]{#(.+)}$/g;
const canceledId = /(\\){#.+}$/g;

/**
 * @param {Array.<Token>} tokens
 * @param {number} idx
 * @param {Object} options
 * @param {*} env
 * @param {import("markdown-it/lib/renderer")} self
 * @return {*}
 */
function headingRenderer(tokens, idx, options, env, self) {
  const token = tokens[idx];
  const content = tokens[idx + 1];
  if (!(content.children && content.children.length)) {
    return proxy(tokens, idx, options, self);
  }

  let id = clearGetHeaderId(content);
  if (id === '') {
    id = content.content.toLowerCase().replace(/[<>]/g, '');
  }
  id = headerslugger.slug(id);

  token.attrJoin('tabindex', '-1');

  // add 3 new token objects link_open, text, link_close
  const linkOpen = new Token('link_open', 'a', 1);
  const text = new Token('html_inline', '', 0);
  text.content =
    '<svg viewBox="0 0 24 24" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>';
  const linkClose = new Token('link_close', 'a', -1);

  // add some link attributes
  linkOpen.attrSet('id', id);
  linkOpen.attrSet('href', '#' + id);
  linkOpen.attrSet('aria-hidden', 'true');

  // add new token objects as children of heading
  content.children.unshift(linkClose);
  content.children.unshift(text);
  content.children.unshift(linkOpen);

  return proxy(tokens, idx, options, self);
}

/**
 * @param {Array.<Token>} tokens
 * @param {number} idx
 * @param {Object} options
 * @param {*} env
 * @param {Renderer} self
 * @return {*}
 */
function linkRenderer(tokens, idx, options, env, self) {
  const token = tokens[idx];
  const href = /** @type {string|null} */ token.attrGet('href');
  if (href != null && '#' + token.attrGet('id') !== href && href.length > 0 && href.at(0) === '#')
    token.attrSet('href', '#' + linkSlugger.slug(href.slice(1)));

  return proxy(tokens, idx, options, self);
}

/** @type {Renderer} */ (md.renderer).rules.heading_open = headingRenderer;
/** @type {Renderer} */ (md.renderer).rules.link_open = linkRenderer;

/**
 *
 * @param {Token} token
 * @return {string}
 */
function clearGetHeaderId(token) {
  if (token.type === 'text') {
    if (token.content.match(titleId)) {
      const match = [...token.content.matchAll(titleId)];
      token.content = token.content.replace(titleId, '');
      return match[0][1];
    } else if (token.content.match(canceledId)) {
      token.content = token.content.replace(canceledId, '');
      return '';
    }
  }

  for (const i in token.children) {
    const tId = clearGetHeaderId(token.children[i]);
    if (tId !== '') {
      return tId;
    }
  }

  return '';
}

/**
 * @param {Array.<Token>} tokens
 * @param {number} idx
 * @param {Object} options
 * @param {*} env
 * @param {Renderer} self
 * @return {*}
 */
function userNameParser(tokens, idx, options, env, self) {
  const originalText = tokens[idx].content;
  if (!originalText.match(usernames)) {
    return defaultTextRenderer(tokens, idx, options, self);
  }

  const users = [...originalText.matchAll(usernames)];
  const content = [];

  let lastMatchEnd = 0;
  for (const match of users) {
    const start = new Token('text', '', 0);
    content.push(start);
    const userValid = env.users !== undefined && match[1] in env.users;

    const linkOpen = new Token('link_open', userValid ? 'a' : 'span', 1);
    content.push(linkOpen);
    const text = new Token('text', '', 0);
    content.push(text);
    content.push(new Token('link_close', userValid ? 'a' : 'span', -1));

    start.content = originalText.slice(lastMatchEnd, match.index);
    text.content = match[1];
    if (userValid) {
      text.content = env.users[match[1]].name;
      linkOpen.attrSet('href', '/user/' + match[1]);
    }

    linkOpen.attrSet('class', 'user');

    lastMatchEnd = (match.index || 0) + match[0].length;
  }

  const end = new Token('text', '', 0);
  content.push(end);
  end.content = originalText.slice(lastMatchEnd);
  return self.renderInline(content, options, env);
}

/** @type {Renderer} */ (md.renderer).rules.text = userNameParser;

/**
 * @param {string} markdown
 * @param {import("../../dbtypes.d").PocketBase=} pocketbase
 * @return {string|Promise.<string>}
 */
export function renderMarkdown(markdown, pocketbase) {
  markdown = sanitizeHtml(markdown);
  /** @type {string} */
  if (pocketbase === undefined) return md.render(markdown);

  return new Promise((resolve) => {
    const userList = [...markdown.matchAll(usernames)].map((u) => u[1]);
    GetUsers(pocketbase, userList).then((users) => {
      resolve(md.render(markdown, { users: users }));
    });
  });
}

/**
 * @typedef {import("../../dbtypes.d").User} User
 * @typedef {import("../../dbtypes.d").PocketBase} PocketBase
 */

/** @type {Object.<string,User>} */
let users = {};
/** @type {Set.<string>} */
let notUsers = new Set();

/**
 * @param {PocketBase} pocketbase
 * @param {Array.<string>} userList
 * @return {Promise.<Object.<string,User>>}
 */
async function GetUsers(pocketbase, userList) {
  if (userList.length === 0) return {};

  const returnF = () => {
    /** @type {Object.<string,User>} */
    const requested = {};
    for (let user of userList) {
      if (user in users) requested[user] = users[user];
    }
    return requested;
  };

  const filter = [...new Set(userList)]
    .filter((u) => !(u in users || notUsers.has(u)))
    .map((s) => `username="${s}"`)
    .join('||');

  if (filter.length === 0) return returnF();

  /** @type {Array.<User>} */
  const userRecords = await pocketbase.collection('userList').getFullList({ filter: filter });

  const userGot = userRecords.reduce(
    /** @param {Object.<string,User>}o
     * @param {User}i
     */ (o, i) => {
      o[i.username] = i;
      return o;
    },
    {}
  );
  for (const username of userList) {
    if (username in userGot) users[username] = userGot[username];
    else notUsers.add(username);
  }
  return returnF();
}
