const fetch  = require('node-fetch');
const parser = require('xml2json');

module.exports = async function fetchData (feed) {
  const res = await fetch(feed.url);
  if (feed.type === 'direct') {
    // Directly passing data through
    return new Uint8Array(await res.arrayBuffer());
  }

  const contentType = res.headers.get('content-type');
  if (/^application\/json$/i.test(contentType)) {
    // Reformat JSON
    return JSON.stringify(await res.json());
  }

  // Turning structured text into JSON
  return parser.toJson(await res.text());
}
