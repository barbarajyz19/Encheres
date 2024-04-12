import * as fs from 'fs/promises';
import { getContentTypeFrom } from '../public/scripts/contentTypeUtil.js';

const BASE = 'http://localhost/';

export default class RequestController {
  #request;
  #response;
  #url;

  constructor(request, response) {
    this.#request = request;
    this.#response = response;
    this.#url = new URL(this.request.url, BASE).pathname;
    this.routes();
  }

  get response() {
    return this.#response;
  }

  get request() {
    return this.#request;
  }

  get url() {
    return this.#url;
  }

  async handleRequest() {
    this.response.setHeader("Content-Type", getContentTypeFrom(this.url));
    await this.buildResponse();
    this.response.end();
  }

  async buildResponse() {
    try {
      const data = await fs.readFile(`.${this.url}`);
      this.response.statusCode = 200;
      this.response.write(data);
    } catch (err) {
      this.response.statusCode = 404;
      this.response.write('erreur');
    }
  }

  routes() {
    let newUrl;

    if (this.#url === '/') {
        newUrl = '/public/index.html';
    } else if (this.#url === '/about') {
        newUrl = '/public/about.html';
    } else if (this.#url === '/auctioneer') {
        newUrl = '/public/auctioneer.html';
    } else if (this.#url === '/bidder') {
        newUrl = '/public/bidder.html';
    } else if (this.#url === '/style/style.css') {
        newUrl = '/public/style/style.css';
    } else if (this.#url.startsWith('/scripts/') && this.#url.endsWith('.js')) {
        const scriptName = this.#url.slice(9, -3);
        newUrl = `/public/scripts/${scriptName}.js`;
    } else if (this.#url.startsWith('/images/') && this.#url.endsWith('.png')) {
        const imageName = this.#url.slice(8, -4);
        newUrl = `/public/images/${imageName}.png`;
    } else {
        newUrl = '/public/error.html';
    }
    this.#url = newUrl;
  }
}
