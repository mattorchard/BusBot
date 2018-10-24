const octranspoService = require('../services/octranspo-service');
const mockOctranspo = require('./mock-octranspo-api');


describe('getUrl', () => {

  test('url should include default query parameters', () =>{
    const url = octranspoService.getUrl("stopInfo");
    expect(url).toContain("format=json");
  });

  test('url should include endpoint', () => {
    const url = octranspoService.getUrl("stopInfo");
    expect(url).toContain("GetNextTripsForStopAllRoutes");
  });

  test('url should include custom query parameters', () => {
    const url = octranspoService.getUrl("stopInfo", {'key': 'value'});
    expect(url).toContain("key=value");
  });

  test('url should not include falsey parameters', () => {
    const url = octranspoService.getUrl("stopInfo", {'key': ''});
    expect(url).not.toContain("key");
  });

});

describe('getStopInfo', () => {

  beforeEach(mockOctranspo);

  test('Should contain stop name', async() => {
    const stopInfo = await octranspoService.getStopInfo(3022);
    expect(stopInfo.stopName).toContain("LEES");
  });

  test('Should contain upcoming stop information', async() => {
    const stopInfo = await octranspoService.getStopInfo(3022);
    expect(stopInfo.routes.some(route => route.routeId && route.heading)).toBeTruthy()
  });

  test('Should only contain bus route requested', async() => {
    const filteredRoute = 16;
    const stopInfo = await octranspoService.getStopInfo(3022, filteredRoute);
    expect(stopInfo.routes.length > 0
      && stopInfo.routes.every(route =>
        route.routeId === filteredRoute)
    ).toBeTruthy();
  });

  test('Should only contain bus route and direction requested', async() => {
    const filteredRoute = 16;
    const filteredDirection = 1;
    const stopInfo = await octranspoService.getStopInfo(3022, filteredRoute, filteredDirection);
    expect(stopInfo.routes.length > 0 &&
      stopInfo.routes.every(route =>
        route.routeId === filteredRoute &&
        route.directionId === filteredDirection)
    ).toBeTruthy();
  });

});