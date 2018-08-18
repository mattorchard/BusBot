const fetch = require('node-fetch');

//API and APP keys now utilized in octranspo-service.js
const util = require('./octranspo-link-service.js');

// nextBus() and stopInfo() return JSON in the form:
// {
//   "text": "Info\nMoreInfo"
// }


async function fetchData (stop,route,direction) {

  const postData={};
  if(stop){postData.stopNo = stop;}
  if(route){postData.routeNo = route;}
  if(direction){postData.direction = direction;}
  
  // Check cached data.

  const response =  await fetch(util.getUrl("GetNextTripsForStopAllRoutes",postData)); 
  const busData = await response.json(); 
  return busData.GetRouteSummaryForStopResult;
}


async function nextBus (stop, route=null, direction=null) {


  return stopInfo(stop);//Temporary: Direct all input to stopInfo.
  
  console.log("[oct-fetch] nextBus("+stop+" "+route+" "+direction+")");

  //If no route provided, return stopinfo.
  if(!route){
    console.log("[oct-fetch] no route data provided, returning stopinfo."); 
    return stopInfo(stop);
  }
  
  const output = [];
  
  const busData = await fetchData(stop).catch(function(err) {
      console.log('Error: '+err);
      });

  console.log(busData);
  output.push("Connections at stop *"+busData.StopNo+"*, "+busData.StopDescription+":");
  for(busNum in busData.Routes.Route){
    const Route = busData.Routes.Route[busNum];
    const TripArray=[]; 
    for(tripNum in Route.Trips){
      const Trip = Route.Trips[tripNum];
      TripArray.push(Trip.TripStartTime);
    }
    output.push("*"+Route.RouteNo+"* "+Route.Direction+" to "+Route.RouteHeading+" at "+
    TripArray.join(", ")+".");
  }

  jsonOut = { "text" : output.join("\n") };
  console.log("\n[oct-fetch] Replying with Slack Message:\n\n"+JSON.stringify(jsonOut,null,2)+"\n");
  return jsonOut;  

}


async function stopInfo (stop) {
  
  const output = [];
  
  const busData = await fetchData(stop).catch(function(err) {
      console.log('Error: '+err);
      });

  console.log(busData);
  output.push("Connections at stop *"+busData.StopNo+"*, "+busData.StopDescription+":");
  for(busNum in busData.Routes.Route){
    const Route = busData.Routes.Route[busNum];
    const TripArray=[]; 
    for(tripNum in Route.Trips){
      const Trip = Route.Trips[tripNum];
      TripArray.push(Trip.TripStartTime);
    }
    output.push("*"+Route.RouteNo+"* "+Route.Direction+" to "+Route.RouteHeading+" at "+
    TripArray.join(", ")+".");
  }

  jsonOut = { "text" : output.join("\n") };
  console.log("\nReplying with Slack Message:\n\n"+JSON.stringify(jsonOut,null,2)+"\n");
  return jsonOut;  
}

module.exports = { nextBus, stopInfo };
