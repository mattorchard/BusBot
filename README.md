# BusBot
<!--TODO: Insert Travis Status, Repo Owner.-->

Busbot queries Ottawa's OC-Transpo API to respond to slash commands in slack:
1. `/nextbus [stop] [bus]` returns a list of the next buses arriving at a stop.
1. `/stopinfo [stop]` returns a list of buses that connect at a stop.

<br />

### Resources

- [Botkit NPM page](https://www.npmjs.com/package/botkit)
- [Botkit + Slack documentation](https://botkit.ai/docs/readme-slack.html)

**OC-Transpo Methods:**
1. GetRouteSummaryForStop: Retrieves the routes for a given stop number.
2. GetNextTripsForStop: Retrieves next three trips on the route for a given stop number.
3. GetNextTripsForStopAllRoutes: Retrieves next three trips for all routes for a given stop number.

As described on [OC Transpo's developer documentation.](http://www.octranspo.com/developers/documentation).

**GetRouteSummaryForStop:**
```json
{
  "GetRouteSummaryForStopResult":{
    "StopNo":"7659",
    "StopDescription":"BANK \/ FIFTH",
    "Error":"",
    "Routes":{
      "Route":[
        {
          "RouteNo":6,
          "DirectionID":1,
          "Direction":"Northbound",
          "RouteHeading":"Rockcliffe"
        },
        {
          "RouteNo":7,
          "DirectionID":1,
          "Direction":"Eastbound",
          "RouteHeading":"St-Laurent"
        }
      ]
    }
  }
}
```

**GetNextTripsForStop:**
```json
{
  "GetNextTripsForStopResult":{
    "StopNo":"1600",
    "StopLabel":"MARCH \/ TERON",
    "Error":"",
    "Route":{
      "RouteDirection":{
        "RouteNo":63,
        "RouteLabel":"Mackenzie King via Briarbrook",
        "Direction":"Outbound",
        "Error":"",
        "RequestProcessingTime":"20180811204146",
        "Trips":{
          "Trip":[
            {
              "TripDestination":"Tunney's Pasture",
              "TripStartTime":"20:25",
              "AdjustedScheduleTime":"7",
              "AdjustmentAge":"2.14",
              "LastTripOfSchedule":false,
              "BusType":"4L - IN",
              "Latitude":"45.345884",
              "Longitude":"-75.931735",
              "GPSSpeed":"10.3"
            },
            {
              "TripDestination":"Tunney's Pasture",
              "TripStartTime":"20:55",
              "AdjustedScheduleTime":"39",
              "AdjustmentAge":"-1",
              "LastTripOfSchedule":false,
              "BusType":"4L - IN",
              "Latitude":"",
              "Longitude":"",
              "GPSSpeed":""
            },
            {
              "TripDestination":"Tunney's Pasture",
              "TripStartTime":"21:25",
              "AdjustedScheduleTime":"69",
              "AdjustmentAge":"-1",
              "LastTripOfSchedule":false,
              "BusType":"4L - IN",
              "Latitude":"",
              "Longitude":"",
              "GPSSpeed":""
            }
          ]
        }
      }
    }
  }
}
```

**GetNextTripsForStopAllRoutes:**
```json
{
  "GetRouteSummaryForStopResult":{
    "StopNo":"7659",
    "StopDescription":"BANK \/ FIFTH",
    "Error":"",
    "Routes":{
      "Route":[
        {
          "RouteNo":6,
          "DirectionID":1,
          "Direction":"Northbound",
          "RouteHeading":"Rockcliffe",
          "Trips":[
            {
              "TripDestination":"Rockcliffe",
              "TripStartTime":"20:15",
              "AdjustedScheduleTime":"10",
              "AdjustmentAge":"0.20",
              "LastTripOfSchedule":false,
              "BusType":"6EB - 60",
              "Latitude":"45.380491",
              "Longitude":"-75.668516",
              "GPSSpeed":"5.0"
            },
            {
              "TripDestination":"Rideau Centre \/ Centre Rideau",
              "TripStartTime":"20:48",
              "AdjustedScheduleTime":"22",
              "AdjustmentAge":"1.28",
              "LastTripOfSchedule":false,
              "BusType":"6E - 60",
              "Latitude":"45.384852",
              "Longitude":"-75.676752",
              "GPSSpeed":"0.5"
            },
            {
              "TripDestination":"Rockcliffe",
              "TripStartTime":"20:45",
              "AdjustedScheduleTime":"37",
              "AdjustmentAge":"-1",
              "LastTripOfSchedule":false,
              "BusType":"6EB - 60",
              "Latitude":"",
              "Longitude":"",
              "GPSSpeed":""
            }
          ]
        },
        {
          "RouteNo":7,
          "DirectionID":1,
          "Direction":"Eastbound",
          "RouteHeading":"St-Laurent",
          "Trips":[
            {
              "TripDestination":"Rideau Centre \/ Centre Rideau",
              "TripStartTime":"20:25",
              "AdjustedScheduleTime":"5",
              "AdjustmentAge":"0.18",
              "LastTripOfSchedule":false,
              "BusType":"4L - IN",
              "Latitude":"45.390631",
              "Longitude":"-75.692211",
              "GPSSpeed":"31.3"
            },
            {
              "TripDestination":"St-Laurent",
              "TripStartTime":"20:40",
              "AdjustedScheduleTime":"16",
              "AdjustmentAge":"0.31",
              "LastTripOfSchedule":false,
              "BusType":"4E - DEH",
              "Latitude":"45.384982",
              "Longitude":"-75.696378",
              "GPSSpeed":"0.5"
            },
            {
              "TripDestination":"Rideau Centre \/ Centre Rideau",
              "TripStartTime":"20:55",
              "AdjustedScheduleTime":"31",
              "AdjustmentAge":"-1",
              "LastTripOfSchedule":false,
              "BusType":"4LB - IN",
              "Latitude":"",
              "Longitude":"",
              "GPSSpeed":""
            }
          ]
        }
      ]
    }
  }
}
```

