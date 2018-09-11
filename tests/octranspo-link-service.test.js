const octranspoLinkService = require('../services/octranspo-link-service');

test('url should include default query parameters', () =>{
  const url = octranspoLinkService.getUrl();
  expect(url).toContain("format=json");
});

test('url should include endpoint', () => {
  const url = octranspoLinkService.getUrl("TestEndpoint");
  expect(url).toContain("TestEndpoint");
});

test('url should include custom query parameters', () => {
  const url = octranspoLinkService.getUrl("TestEndpoint", {'key': 'value'});
  expect(url).toContain("key=value");
});

test('url should not include falsey parameters', () => {
  const url = octranspoLinkService.getUrl("TestEndpoint", {'key': ''});
  expect(url).not.toContain("key");
});
