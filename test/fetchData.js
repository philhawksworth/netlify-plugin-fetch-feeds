const test = require('tape');
const simpleServer = require('./util/simpleServer');
const fetchData = require('../fetchData');

async function serveAndFetch({ content, contentType, feed = {} }, handler) {
  const { server, url } = await simpleServer({ content, contentType });
  try {
    feed.url = url;
    return handler({ data: await fetchData(feed), feed });
  } finally {
    server.close();
  }
}

test('fetching json data', async t => {
  const content = '{"hello":"world"}';
  await serveAndFetch({
    content,
    contentType: 'application/json'
  }, ({ data: received }) => {
    t.equals(received, content, 'content is fetched from server');
  });
});

test('fetching json data - header case shouldnt matter', async t => {
  const content = '{"hello":"world"}';
  await serveAndFetch({
    content,
    contentType: 'APPLICATION/jSoN'
  }, ({ data: received }) => {
    t.equals(received, content, 'content is fetched from server');
  });
});

test('reformatting json data', async t => {
  const content = '{ "hello": "world" }';
  await serveAndFetch({
    content,
    contentType: 'application/json'
  }, ({ data: received }) => {
    t.equals(received, '{"hello":"world"}', 'content is reformatted');
  });
});

test('html content', async t => {
  await serveAndFetch({
    content: '<html><body><![CDATA[hi]]></body></html>',
    contentType: 'text/html'
  }, ({ data }) => {
    t.equals(data, '{"html":{"body":"hi"}}', 'html content is turned into structured json');
  });
});

test('html content without contentType', async t => {
  await serveAndFetch({
    content: '<html><body><![CDATA[hi]]></body></html>',
  }, ({ data }) => {
    t.equals(data, '{"html":{"body":"hi"}}', 'html content is returned even though contentType is not given');
  });
});
