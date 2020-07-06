const chalk       = require('chalk');
const processFeed = require('./processFeed');

module.exports = {

  async onPreBuild({ inputs, utils }) {

    // Gather the data from all the specified feeds
    for (const feed of inputs.feeds) {
      if (await processFeed(utils.cache, inputs.dataDir, feed)) {
        console.log('Restored from cache:', chalk.green(feed.url));
      } else {
        console.log('Fetched and cached: ', chalk.yellow(feed.url), chalk.gray(`(TTL:${feed.ttl} seconds)`));
      }
    }
  }
}
