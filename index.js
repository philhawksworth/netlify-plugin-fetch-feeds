const fs      = require('fs');
const fetch   = require('node-fetch');
const parser  = require('xml2json');
const chalk   = require('chalk');


module.exports = {

  async onPreBuild({ inputs, utils }) {

    // Gather the data from all the specified feeds
    for (const feed of inputs.feeds) {

      // Where fetched data should reside in the buid
      let dataFilePath = `${inputs.dataDir}/${feed.name}.json`;

      // reinstate from cache if it is present
      if ( await utils.cache.has(dataFilePath) ) {
        await utils.cache.restore(dataFilePath);
        console.log('Restored from cache: ', chalk.green(feed.url));
      }
      // Or if it's not cached, let's fetch it and cache it.
      else {
        var data = await fetch(feed.url)
          .then(async function(res) {

            // Stash all data as JSON.
            let contentType = res.headers.get('content-type').toLowerCase();
            if(contentType == 'application/json') {
              return res.json();
            } else {
              let text = await res.text();
              let json = parser.toJson(text);
              return JSON.parse(json);
            }
          });

        // put the fetched data in the daa file, and then cahce it.
        // await saveFeed(JSON.stringify(data), dataFilePath);
        await fs.writeFileSync(dataFilePath, JSON.stringify(data));
        await utils.cache.save(dataFilePath, { ttl: feed.ttl });
        console.log('Fetched and cached: ',  chalk.blue(feed.url), chalk.gray(`(TTL:${feed.ttl} seconds)`));

      }
    }
  }
}
