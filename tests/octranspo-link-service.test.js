const octranspoLinkService = require('../services/octranspo-link-service');

test('url should include default query parameters', () =>{
  const url = octranspoLinkService.getUrl("stopInfo");
  expect(url).toContain("format=json");
});

test('url should include endpoint', () => {
  const url = octranspoLinkService.getUrl("stopInfo");
  expect(url).toContain("GetNextTripsForStopAllRoutes");
});

test('url should include custom query parameters', () => {
  const url = octranspoLinkService.getUrl("stopInfo", {'key': 'value'});
  expect(url).toContain("key=value");
});

test('url should not include falsey parameters', () => {
  const url = octranspoLinkService.getUrl("stopInfo", {'key': ''});
  expect(url).not.toContain("key");
});
