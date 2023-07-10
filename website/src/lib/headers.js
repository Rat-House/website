/**
 * @typedef {import("svelte-meta-tags").MetaTagsProps} MetaTagsProps
 * @typedef {import("svelte-meta-tags").Twitter} TwitterProps
 * @typedef {import("svelte-meta-tags").OpenGraph} OGPProps
 */

export class HeaderBuilder {
  constructor() {
    /**
     * @type {MetaTagsProps}
     */
    this._props = {
      titleTemplate: '%s | RatHouse',
      openGraph: {
        images: [],
        site_name: 'RatHouse'
      },
      twitter: {
        cardType: 'summary'
      }
    };

    this.setTitle('RatHouse webpage').setDescription('A webpage on RatHouse');
  }

  useLargeImage() {
    /** @type {TwitterProps} */ (this._props.twitter).cardType = 'summary_large_image';
    return this;
  }

  /**
   * @param {string|URL} imageAddr
   * @param {string} alt
   */
  setImage(imageAddr, alt) {
    const addr = imageAddr.toString();
    /** @type {OGPProps} */ (this._props.openGraph).images = [
      {
        url: addr,
        alt: alt
      }
    ];
    /** @type {TwitterProps} */ (this._props.twitter).image = addr;
    /** @type {TwitterProps} */ (this._props.twitter).imageAlt = alt;
    return this;
  }

  removeTitleTemplate() {
    this._props.titleTemplate = '';
    return this;
  }

  /**
   * @param {string}title
   */
  setTitle(title) {
    this._props.title = title;
    /** @type {OGPProps} */ (this._props.openGraph).title = title;
    /** @type {TwitterProps} */ (this._props.twitter).title = title;
    return this;
  }

  /**
   * @param {string}description
   */
  setDescription(description) {
    this._props.description = description;
    /** @type {OGPProps} */ (this._props.openGraph).description = description;
    /** @type {TwitterProps} */ (this._props.twitter).description = description;
    return this;
  }

  /**
   * @param {string|URL} url
   */
  setUrl(url) {
    /** @type {OGPProps} */ (this._props.openGraph).url = url.toString();
    return this;
  }

  /**
   * @param {string|URL} url
   */
  updateUrl(url) {
    if (/** @type {OGPProps} */ (this._props.openGraph).url === undefined) this.setUrl(url);
    return this;
  }

  /**
   * @param {string|URL} imageAddr
   * @param {string} alt
   */
  updateImage(imageAddr, alt) {
    if (/** @type {OGPProps} */ (this._props.openGraph).images.length === 0)
      this.setImage(imageAddr, alt);
    return this;
  }

  /** @return {MetaTagsProps} */
  export() {
    return this._props;
  }

  reset() {
    Header._props = new HeaderBuilder()._props;
    return Header;
  }

  save() {
    Header._props = this._props;
    return Header;
  }
}

export const Header = new HeaderBuilder();
