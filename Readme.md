# Netlify Plugin - Fetch Feeds

This [plugin](https://www.netlify.com/build/plugins-beta?utm_source=github&utm_medium=plugin-fetchfeeds-pnh&utm_campaign=devex) adds the ability to source content from remote feeds including RSS and JSON, and cache them between builds.

## Overview

This plugin requests data from the RSS and JSON resources that you specify. It will save this data as JSON in the Netlify build cache and only re-request each feed after a specified time-to-live value has elapsed. Requests are skipped harmlessly if data for a feed was previously cached, adding greater resilience to builds which depend on remote data.

Configure this plugin to present the gathered data in the appropriate location, so your chosen [static site generator](https://www.netlify.com/blog/2020/04/14/what-is-a-static-site-generator-and-3-ways-to-find-the-best-one/?utm_source=github&utm_medium=whatisanssg-pnh&utm_campaign=devex) can leverage it during the build.


## Demonstration

See this plugin being used in this simplified demo site: https://demo-plugin-fetch-feeds.netlify.app/


## Installation

To include this plugin in your site deployment:


### 1. Add the plugin as a dependency

```bash

# Add the plugin as a dependency of your build
npm i --s netlify-plugin-fetch-feeds

```


### 2. Add the plugin and its options to your netlify.toml

This plugin will fetch the specified feeds and stash their data prior to the execution of the `build` command you have specified in your Netlify configuration. The desired feeds can be specified in the `netlify.toml` config file.


```toml
# Config for the Netlify Build Plugin: netlify-plugin-fetch-feeds
[[plugins]]
  package = "netlify-plugin-fetch-feeds"

  [plugins.inputs]
    # Where should data files reside
    dataDir = "site/_data"

    # All the feeds we wish to gather for use in the build

    [[plugins.inputs.feeds]]
      name = "hawksworx"
      url = "https://hawksworx.com/feed.json"
      ttl = 3600
    [[plugins.inputs.feeds]]
      name = "netlify"
      url = "https://www.netlify.com/blog/index.xml"
      ttl = 86400
    [[plugins.inputs.feeds]]
      # Content will not be processed if type is set to "direct". The path will be taken as-is.
      type = "direct"
      name = "Netlify_logo.svg"
      url = "https://en.wikipedia.org/wiki/Netlify#/media/File:Netlify_logo.svg"
      ttl = 86400
```



## Quick try-out

You can try out this plugin by deploying [a simple site](https://demo-plugin-fetch-feeds.netlify.app/) which uses it.

Clicking the button below will clone [a test site repo](https://github.com/philhawksworth/demo-netlify-plugin-fetch-feeds), setup a new site [on Netlify](https://netlify.com?utm_source=github&utm_medium=plugin-fetchfeeds-pnh&utm_campaign=devex) and deploy the site complete with the plugin configured and operational.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/philhawksworth/demo-netlify-plugin-fetch-feeds)
