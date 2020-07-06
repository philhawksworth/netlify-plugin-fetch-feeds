const fs        = require('fs');
const fetchData = require('./fetchData');

module.exports = async function (cache, dataDir, feed) {
  // Where fetched data should reside in the buid
  let dataFilePath = `${dataDir}/${feed.name}.json`;

  // reinstate from cache if it is present
  if ( await cache.has(dataFilePath) ) {
    await cache.restore(dataFilePath);
    return true;
  }
  // Or if it's not cached, let's fetch it and cache it.
  else {
    const data = await fetchData(feed);

    // put the fetched data in the daa file, and then cache it.
    await fs.writeFileSync(dataFilePath, data);
    await cache.save(dataFilePath, { ttl: feed.ttl });
    return false;
  }
}
