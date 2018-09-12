const octranspoService = require('../services/octranspo-fetch-service');
const slackFormatService = require('../services/slack-format-service');
const mockOctranspo = require('./mock-octranspo-api');


beforeAll(mockOctranspo);

test('Should contain stop name', async() => {
  const stopInfo = await octranspoService.stopInfo(3022);
  const reply = slackFormatService.formatStopInfo(stopInfo);
  expect(reply).toContain("*LEES");
});
