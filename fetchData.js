const fetch   = require('node-fetch');
const parser  = require('xml2json');

module.exports = async function fetchData (feed) {
  var data = await fetch(feed.url)
    .then(async function(res) {

      // Stash all data as JSON.
      let contentType = res.headers.get('content-type');
      if(/^application\/json$/i.test(contentType)) {
        return res.json();
      } else {
        let text = await res.text();
        let json = parser.toJson(text);
        return JSON.parse(json);
      }
    });
  return JSON.stringify(data);
};
