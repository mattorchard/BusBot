const octranspoService = require('../services/octranspo-service');
const googleMapsService = require('../services/google-maps-service')();
const mockOctranspo = require('./mock-octranspo-api');


describe('getGoogleMapsUrl', () => {

  beforeEach(mockOctranspo);

  test('getGoogleMapsUrl', async() => {
    const stopInfo = await octranspoService.getStopInfo(3022);
    const googleMapsUrl = googleMapsService.getGoogleMapsUrl(stopInfo);
    expect(googleMapsUrl).toContain("markers=color:red");
  });

});
