const fetch = require('node-fetch');
const util = require('./octranspo-link-service.js');

async function fetchData (stop,route,direction) {

  const postData={};
  if(stop){postData.stopNo = stop;}
  if(route){postData.routeNo = route;}
  if(direction){postData.direction = direction;}
  
  const response =  await fetch(util.getUrl("GetNextTripsForStopAllRoutes",postData)); 
  const busData = await response.json(); 
  return busData.GetRouteSummaryForStopResult;
}

async function nextBus (stop, route=null, direction=null) {

  return stopInfo(stop, route, direction);//Temporary: Direct all input to stopInfo.
  /*  
  console.log("[oct-fetch] nextBus("+stop+" "+route+" "+direction+")");

  if(!route){
    console.log("[oct-fetch] no route data provided, returning stopinfo."); 
    return stopInfo(stop);
  }*/
}

async function stopInfo (stop, route=null, direction=null) {
  
  const output = [];
  let route_present=false;
  
  const busData = await fetchData(stop).catch(function(err) {
      console.log('Error: '+err);
      });

  output.push("Connections at stop *"+busData.StopNo+"*, "+busData.StopDescription+":");
  
  if( Array.isArray(busData.Routes.Route)){ 
    for(busNum in busData.Routes.Route){
      const Route = busData.Routes.Route[busNum];
      const TripArray=[]; 
      for(tripNum in Route.Trips){
        const Trip = Route.Trips[tripNum];
        TripArray.push(Trip.TripStartTime);
      }
      if(Route.RouteNo==route){route_present=true;}
      if(route==null || Route.RouteNo==route){ 
        output.push("*"+Route.RouteNo+"* "+Route.Direction+" to "+Route.RouteHeading+" at "+
        TripArray.join(", ")+".");
      }
    }
  } else {
    const TripArray=[]; 
    const Route = busData.Routes.Route; 
    for(tripNum in Route.Trips.Trip){
      const Trip = Route.Trips.Trip[tripNum];
      TripArray.push(Trip.TripStartTime);
    }
    if(Route.RouteNo==route){route_present=true;}
    if(route==null || Route.RouteNo==route){ 
      output.push("*"+Route.RouteNo+"* "+Route.Direction+" to "+Route.RouteHeading+" at "+
      TripArray.join(", ")+".");
    }
  }
 
  if(output.length==1){
    switch(route){
      case null:
        output.push("No connecting routes found.");
        break;
      default:
        output.push("Route "+route+" does not pass stop "+stop+" at this time.");
        //Separate output-building into another method so all routes can be repeated here.
        break; 
    }
  }
  
  jsonOut = { "text" : output.join("\n") };
  console.log("\nReplying with Slack Message:\n\n"+JSON.stringify(jsonOut,null,2)+"\n");
  return jsonOut;  
}

console.log(nextBus(3010,16).text);
//console.log(stopInfo(3010).text);

module.exports = { nextBus, stopInfo };
