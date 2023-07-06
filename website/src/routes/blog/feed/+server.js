import { Feed } from 'feed';
import { json } from '@sveltejs/kit';

/** @type {import("./$types").RequestHandler} */
export async function GET({ locals, url, setHeaders }) {
  let format;
  /** @type{Promise<string>|null} */
  let contentPromise = null;
  if (url.searchParams.get('rss') !== null) {
    format = 'application/xml';
    contentPromise = getFeed(locals.pb, url).then((f) => f.rss2());
  } else if (url.searchParams.get('atom') !== null) {
    format = 'application/atom+xml';
    contentPromise = getFeed(locals.pb, url).then((f) => f.atom1());
  } else if (url.searchParams.get('json') !== null) {
    format = 'application/json';
    contentPromise = getFeed(locals.pb, url).then((f) => f.json1());
  }

  if (contentPromise === null || !format) {
    return json({
      json: new URL('/blog/feed?json', url),
      atom: new URL('/blog/feed?atom', url),
      rss: new URL('/blog/feed?rss', url)
    });
  }

  const content = await contentPromise;
  setHeaders({
    'content-length': String(content.length),
    'content-type': format
  });
  return new Response(content);
}

/**
 * @typedef {import("../../../dbtypes.d").User} User
 *
 * @param {import("../../../dbtypes.d").PocketBase} pb
 * @param {URL} url
 * @return {Promise<Feed>}
 */
async function getFeed(pb, url) {
  const feed = new Feed({
    title: 'RatHouse blogposts',
    description: 'Blogposts made by RatHouse',
    id: url.origin,
    link: new URL('/blog', url).href,
    language: 'en',
    image: new URL('/favicon-128.png', url).href,
    favicon: new URL('/favicon.ico', url).href,
    copyright: 'All rights reserved 2023, RatHouse',
    feedLinks: {
      json: new URL('/blog/feed?json', url).href,
      rss: new URL('/blog/feed?rss', url).href,
      atom: new URL('/blog/feed?atom', url).href
    }
  });

  const posts = /** @type {Array<import("../../../dbtypes.d").Post>} */ await pb
    .collection('posts')
    .getFullList({
      expand: 'creator,editors,tags',
      sort: '-created',
      filter: 'published=true'
    });

  posts.forEach((post) => {
    const creator = /** @type {User} */ (post.expand.creator);
    const editors = /** @type {Array<User>} */ (post.expand.editors);
    const tags = /** @type {Array<import("../../../dbtypes.d").Tag>} */ (post.expand.tags);

    /** @type {Array.<import("feed").Author>} */
    const contributors = [];
    if (editors) {
      editors.forEach((editor) => {
        contributors.push({
          name: editor.name,
          link: new URL(`/user/${editor.id}`, url).href
        });
      });
    }

    /** @type {Array.<import("feed/lib/typings/index.d").Category>} */
    const categorys = [];
    if (tags) {
      tags.forEach((tag) => {
        categorys.push({
          name: tag.name
        });
      });
    }

    const item = /** @type {import("feed").Item} */ {
      title: post.title,
      id: new URL(`/blog/${post.id}`, url).href,
      link: new URL(`/blog/${post.id}`, url).href,
      // description: post.description,
      // content: post.content, -- alot of data, do we really send this?
      date: new Date(post.created),
      // image: post.image
      author: [
        {
          name: creator.name,
          // email: creator.email,
          link: new URL(`/user/${creator.id}`, url).href
        }
      ],
      contributor: contributors,
      category: categorys
    };

    feed.addItem(item);
  });

  return feed;
}
