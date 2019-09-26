# netlify-plugin-fetch-feeds

A Netlify plugin to source content from remote feeds including RSS and JSON

> NOTICE: This is an experimental feature. Subject to lots of change.

## Overview

This plugin requests data from the RSS and JSON resources that you specify. It will save this data as JSON in the Netlify build cache and only re-request each feed after a specified time-to-live value has elapsed. Requests fail harmlessly if data for a feed was previously cached, adding greater resilience to builds which depend on remote data.

Use this plugin in combination with other plugins to present the gathered data in the appropriate format for your chosen SSG. For example:

- netlify-plugin-yield-data-for-eleventy
- netlify-plugin-yield-data-for-jekyll
- netlify-plugin-yield-data-for-hugo
- netlify-plugin-yield-data-for-gatsby

## Demonstration

See this plugin being used in this simplified demo site: https://demo-plugin-fetch-feed.netlify.com


## Usage

### Prerequisites

- npm and node
- @Netlify/build (later this will be included in the Netlify CLI)
- A free [Netlify account](https://netlify.com)
- Opt-in to Netlify Build Plugin feature support (Not yet publicly available, sorry)


### Including this plugin in a project

This plugin can be included via npm. Install it as a dependency for your project like so:

```
npm install --save netlify-plugin-fetch-feeds
```

### Configuration

This plugin will fetch the specified feeds and stash their data prior to the execution of the `build` command you have specified in your Netlify configuration. The desired feeds can be specified in the `netlify.toml` config file. For simpler configuration syntax, I recommend using yaml rather than toml by instead including a `netlify.yml` file.

To use plugins, a `plugins` array should be specified in your `netlify.yml`. Each plugin can then be specified with its parameters like so:

```yaml
plugins:
  - netlify-plugin-fetch-feeds:
    # Make the content from these feeds available to templates
    # in our SSG via a collection with a given name
      feeds:
        # - name: used as a key for our data collection
        #   url: where to find this resource, in xml or json format
        #   ttl: don't fetch this again if cached less than this many seconds ago
        - name: netlify
          url: https://www.netlify.com/blog/index.xml
          ttl: 86400 # 24 hours
        - name: hawksworx
          url: https://hawksworx.com/feed.json
          ttl: 180  # 3 minutes

```

### Execution in Netlify

Once installed and configured, the plugin will automatically run in the Netlify CI during its specified Netlify Build lifecycle event.

### Executing locally

To test the execution of the Netlify Build lifecycle locally, first ensure that netlify-build is installed:

```bash
# Ensure that you have the netlify build command available
# (in future this will be provided via the CLI)
npm install @netlify/build -g

# In the project working directory, run the build as netlify would with the build bot
netlify-build
```
