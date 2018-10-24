const octranspoService = require('../services/octranspo-service');
const slackFormatService = require('../services/slack-format-service');
const mockOctranspo = require('./mock-octranspo-api');


beforeEach(mockOctranspo);


test('Should contain stop name', async() => {
  const stopInfo = await octranspoService.getStopInfo(3022);
  const reply = slackFormatService.formatStopInfo(stopInfo);
  expect(reply.text).toContain("*LEES");
});

test('Should contain route name', async() => {
  const stopInfo = await octranspoService.getStopInfo(3022);
  const reply = slackFormatService.formatStopInfo(stopInfo);
  expect(reply.attachments.some(attachment => attachment.title === "103 Moodie")).toBeTruthy();
});
