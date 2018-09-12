const octranspoService = require('../services/octranspo-fetch-service');
const slackFormatService = require('../services/slack-format-service');
const mockOctranspo = require('./mock-octranspo-api');


beforeEach(mockOctranspo);

test('Should contain stop name', async() => {
  const stopInfo = await octranspoService.stopInfo(3022);
  const reply = slackFormatService.formatStopInfo(stopInfo);
  expect(reply).toContain("*LEES");
});

test('Should contain route name', async() => {
  const stopInfo = await octranspoService.stopInfo(3022);
  const reply = slackFormatService.formatStopInfo(stopInfo);
  expect(reply).toContain("*101 Moodie");
});

test('Should contain route name of filtered route', async() => {
  const stopInfo = await octranspoService.stopInfo(3022, 101);
  const reply = slackFormatService.formatStopInfo(stopInfo);
  expect(reply).toContain("*101 Moodie");
});
