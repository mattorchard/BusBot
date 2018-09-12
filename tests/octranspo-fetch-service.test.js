const octranspoService = require('../services/octranspo-fetch-service');
const mockOctranspo = require('./mock-octranspo-api');


beforeAll(mockOctranspo);

test('Should contain stop name', async() => {
  const stopInfo = await octranspoService.stopInfo(3022);
  expect(stopInfo.stopName).toContain("LEES");
});

test('Should contain upcoming stop information', async() => {
  const stopInfo = await octranspoService.stopInfo(3022);
  expect(stopInfo.routes.some(route => route.routeId && route.heading)).toBeTruthy()
});