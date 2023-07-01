<script>
  import './blogpost.pcss';
  import MarkdownIt from 'markdown-it';
  import Token from 'markdown-it/lib/token';
  import hljs from 'highlight.js';
  import sanitizeHtml from "sanitize-html";
  import GithubSlugger from 'github-slugger';

  //borrowing from https://github.com/Flet/markdown-it-github-headings/blob/master/index.js

  export let text = '';

  const headerslugger = new GithubSlugger();
  const linkSlugger = new GithubSlugger();

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

  /** @type {import("markdown-it/lib/parser_core")} */ (md.core).ruler.push(
    'headingLinks',
    function () {
      headerslugger.reset();
      linkSlugger.reset();
    }
  );

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
    // text.content = "";
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
    if (token.attrGet('class') === null && href != null && href.length > 0 && href.at(0) === '#')
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
      let tId = clearGetHeaderId(token.children[i]);
      if (tId !== '') {
        return tId;
      }
    }

    return '';
  }

  /**
   * @param {string} markdown
   * @return {string}
   */
  function parseMarkdown(markdown) {
    return md.render(sanitizeHtml(markdown));
  }
</script>

<div class="markdown">
  <!-- eslint-disable-next-line svelte/no-at-html-tags-->
  {@html parseMarkdown(text)}
</div>
