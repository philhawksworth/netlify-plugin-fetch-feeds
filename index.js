const fs     = require('fs');
const axios  = require('axios');
const feed   = require('rss-to-json');


function netlifyPlugin(conf) {

  // For convenient access.
  // At init, ensure the paths are created.
  var PLUGIN_CACHE_DIR;

  // Use temporary methods until implemented in core
  var tempUtils = {

    cache : {
      // Save the data with an optional expiry date
      save: (props) => {
        const data = {
          'expires': props.ttl ? (new Date().valueOf() + (props.ttl * 1000)) : null,
          'content': props.content
        };
        // write our cache file
        fs.writeFile(`${PLUGIN_CACHE_DIR}/${props.file}`, JSON.stringify(data), err => {
          if(err) {
            console.log(`Problem while saving: ${props.file}`, err);
          } else {
            console.log(`Data saved: ${props.file}`);
          }
        });
      },

      // Return the data held in a given cache file
      get: (props) => {
        return require(`${PLUGIN_CACHE_DIR}/${props.file}`).content;
      },

      // Check if a cached file has exceeded its ttl or if it is still valid
      check: (props) => {
        try {
          var cached = require(`${PLUGIN_CACHE_DIR}/${props.file}`);
          return !(new Date().valueOf() > cached.expires);
        } catch {
          return false;
        }
      }
    }

  };



  // Add the content from a feed to the .netlify cache
  function getFeed(name, url, ttl) {

    // check if we have a vaild cache for this item
    var cached = tempUtils.cache.check({'file': `${name}.json`});

    // If cached and within ttl, don't fetch
    if(cached) {
      console.log(`${name} - still freshly cached from ${url}`);
    } else {
      // otherwise fetch data and save with a ttl
      console.log(`${name} - fetching from ${url} with a ttl of ${ttl} seconds`);

      // support both json and xml formats (should we really?)
      if(url.indexOf(".js") != -1) {
        axios.get(url)
          .then(response => {
            // save the data to the cache
            tempUtils.cache.save({
              'file': `${name}.json`,
              'content': JSON.stringify(response.data),
              'ttl': ttl
            });
          })
          .catch(err => {
            console.log(`Error while fetching ${url}`, err);
          });

      } else {

        // using traditional xml rss
        feed.load(url, function(err, rss){

          // save the data to the cache
          tempUtils.cache.save({
            'file': `${name}.json`,
            'content': JSON.stringify(rss),
            'ttl': ttl
          });
          if(err) {
            console.log(`Error while fetching ${url}`, err);
          }
        });

      }

    }
  }


  return {

    // Hook into lifecycle
    init: (data) => {
      // set up our caching location
      PLUGIN_CACHE_DIR = `${data.constants.CACHE_DIR}/netlify-plugin-fetch-feeds`;
      if (!fs.existsSync(PLUGIN_CACHE_DIR)){
        fs.mkdirSync(PLUGIN_CACHE_DIR, {recursive: true})
      };
    },

    postinstall: (data) => {
      // fetch and cache all the feeds
      conf.feeds.forEach(feed => {
        var tll = feed.ttl ? feed.ttl : null;
        getFeed(feed.name, feed.url, tll);
      });
    }

  };
};

module.exports = netlifyPlugin;
