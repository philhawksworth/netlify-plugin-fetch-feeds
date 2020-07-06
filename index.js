const fs        = require('fs');
const chalk     = require('chalk');
const fetchData = require('./fetchData');

module.exports = {

  async onPreBuild({ inputs, utils }) {

    // Gather the data from all the specified feeds
    for (const feed of inputs.feeds) {

      // Where fetched data should reside in the buid
      let dataFilePath = `${inputs.dataDir}/${feed.name}.json`;

      // reinstate from cache if it is present
      if ( await utils.cache.has(dataFilePath) ) {
        await utils.cache.restore(dataFilePath);
        console.log('Restored from cache:', chalk.green(feed.url));
      }
      // Or if it's not cached, let's fetch it and cache it.
      else {
        const data = await fetchData(feed);

        // put the fetched data in the daa file, and then cache it.
        await fs.writeFileSync(dataFilePath, data);
        await utils.cache.save(dataFilePath, { ttl: feed.ttl });
        console.log('Fetched and cached: ', chalk.yellow(feed.url), chalk.gray(`(TTL:${feed.ttl} seconds)`));

      }
    }
  }
}
