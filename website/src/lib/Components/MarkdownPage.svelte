<script>
  import './blogpost.pcss';
  import MarkdownIt from 'markdown-it';
  import hljs from 'highlight.js';
  import GithubSlugger from 'github-slugger';

  //borowing from https://github.com/Flet/markdown-it-github-headings/blob/master/index.js

  export let text = '';

  const slugger = new GithubSlugger();
  let Token;

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

  md.core.ruler.push('headingLinks', function (state) {
    slugger.reset();

    if (!Token) {
      Token = state.Token;
    }
  });

  const proxy = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);
  const defaultHeadingRenderer = md.renderer.rules.heading_open || proxy;
  const titleId = /[^\\]{#(.+)}$/g;
  const canceledId = /(\\){#.+}$/g;

  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const content = tokens[idx + 1];
    if (!(content.children && content.children.length)) {
      return defaultHeadingRenderer(tokens, idx, options, env, self);
    }

    let id = clearGetHeaderId(content);
    if (id === '') {
      id = content.content.toLowerCase().replace(/[<>]/g, '');
    }
    id = slugger.slug(id);

    token.attrJoin('tabindex', '-1');

    // add 3 new token objects link_open, text, link_close
    const linkOpen = new Token('link_open', 'a', 1);
    const text = new Token('html_inline', '', 0);
    // text.content = "";
    const linkClose = new Token('link_close', 'a', -1);

    // add some link attributes
    linkOpen.attrSet('id', id);
    linkOpen.attrSet('class', 'anchor');
    linkOpen.attrSet('href', '#' + id);
    linkOpen.attrSet('aria-hidden', 'true');

    // add new token objects as children of heading
    content.children.unshift(linkClose);
    content.children.unshift(text);
    content.children.unshift(linkOpen);

    return defaultHeadingRenderer(tokens, idx, options, env, self);
  };

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
    return /*sanitizeHtml(*/ md.render(markdown); //);
  }
</script>

<div class="markdown">
  <!-- eslint-disable-next-line svelte/no-at-html-tags-->
  {@html parseMarkdown(text)}
</div>
