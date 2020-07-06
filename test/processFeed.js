const test = require('tape');
const simpleServer = require('./util/simpleServer');
const processFeed = require('../processFeed');
const path = require('path');
const tmpPath = path.join(__dirname, '_tmp');
const fs = require('fs').promises;

test('non-cached data is fetched', async t => {
  await fs.mkdir(tmpPath, { recursive: true });
  const name = 'non-cached';
  const expectedPath = path.join(tmpPath, `${name}.json`);
  const { server, url } = await simpleServer('{}', 'application/json');
  const feed = { name, url, ttl: 10 };
  try {
    const result = await processFeed({ 
      has: () => false,
      save: (dataPath, options) => {
        t.equals(dataPath, expectedPath, 'the expected data path is based on the feeds name and the dataDir');
        t.deepEqual(options, {
          ttl: 10
        }, 'ttl options get passed through');
      }
    }, tmpPath, feed);
    t.equals(result, false, 'returns false to indicate that the data was loaded');
    const storedOnDisk = await fs.readFile(expectedPath, 'utf-8');
    t.equals(storedOnDisk, '{}', 'data got stored on disk');
  } finally {
    server.close();
    try {
      await fs.unlink(expectedPath);
    } catch(_) {}
  }
});

test('cached data is restored', async t => {
  const name = 'non-cached';
  const expectedPath = path.join(tmpPath, `${name}.json`);
  const url = null;
  const feed = { name, url, ttl: 10 };
  let restoreCalled = false;
  const result = await processFeed({ 
    has: () => true,
    restore: async restorePath => {
      restoreCalled = true;
      t.equals(restorePath, expectedPath, 'the expected data path is based on the feeds name and the dataDir');
    },
    save: () => {
      throw new Error('shouldnt save');
    }
  }, tmpPath, feed);
  t.equals(result, true, 'returns true to indicate that it was restored from cache');
  t.equals(restoreCalled, true, 'restore was called');
});

test('direct data comes without .json marker', async t => {
  const name = 'non-cached';
  const expectedPath = path.join(tmpPath, name);
  const url = null;
  const feed = { name, url, ttl: 10, type: 'direct' };
  let restoreCalled = false;
  const result = await processFeed({ 
    has: () => true,
    restore: async restorePath => {
      restoreCalled = true;
      t.equals(restorePath, expectedPath, 'the expected data path is based on the feeds name and the dataDir');
    },
    save: () => {
      throw new Error('shouldnt save');
    }
  }, tmpPath, feed);
  t.equals(result, true, 'returns true to indicate that it was restored from cache');
  t.equals(restoreCalled, true, 'restore was called');
});
