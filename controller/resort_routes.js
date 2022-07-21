const express = require("express");
const router = express.Router();
const Resort = require("../models/resort");
const Region = require("../models/region");
const State = require("../models/state");
const axios = require("axios");

//DELETE - RESORT
router.delete("/home", async (req, res) => {
  //destroy is assigned the id of the resort the button/form correspond with
  let destroy = await req.body.resortId;
  await Resort.deleteOne({
    $and: [{ owner: req.session.userId }, { resortId: destroy }],
  });
  res.redirect("/resorts/home");
});

//GET - INDEX
router.get("/home", async (req, res) => {
  try {
    if (req.session.userId) {
      let resorts = await Resort.find({
        $and: [{ owner: req.session.userId }, { isHomeResort: false }],
      });
      let home = await Resort.find({
        $and: [{ owner: req.session.userId }, { isHomeResort: true }],
      });
      if (home.length > 0) {
        let userRegions = await Region.find({ owner: req.session.userId });
        let homeState = await State.find({ code: home[0].state });

        //Thank you Andrew for this part. put states into an array
        //and looped through it. this is to get state name to make items from snocountry api compatible with openweather api
        //there is probably a better way to write this loop
        let testStates = await State.find({});
        let cardState = resorts.map((i) => {
          for (let j = 0; j < testStates.length; j++) {
            if (i.state === testStates[j].code) {
              return testStates[j];
            }
          }
        });

        //get request for resort data. this originally was stored in db but changed to do a get request each time
        //so the info is real time
        let homeStats = await axios.get(
          `http://feeds.snocountry.net/getSnowReport.php?apiKey=SnoCountry.example&ids=${home[0].resortId}`
        );
        let homeData = homeStats.data.items[0];
        console.log(homeData);
        let homeWeather = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${homeState[0].name}&appid=8fb137f32bd26f624e9cd15073b51fec&units=imperial`
        );
        homeWeather.data.main.temp = Math.round(homeWeather.data.main.temp);

        //getting weather for all other resorts followed. Thank you Fei for the async iterator tip
        let cardWeather = await Promise.all(
          cardState.map(async (i) => {
            try {
              let eachWeather = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${i.name}&appid=8fb137f32bd26f624e9cd15073b51fec&units=imperial`
              );
              return eachWeather.data;
            } catch {
              console.log("ruh roh");
            }
          })
        );

        //round temps
        cardWeather.forEach((i) => {
          i.main.temp = Math.round(i.main.temp);
        });

        //render for user with home resorts, other resorts, and regions
        res.render("resorts/index", {
          resorts,
          home,
          userRegions,
          homeWeather,
          cardWeather,
          homeData,
        });
      } else if (resorts.length > 0) {
        //if a user has resorts but no designated home resort

        //getting state names to be able to use openweather api
        //there is probably a more elegeant way to do this
        let testStates = await State.find({});
        //see which states/countries match the codes in resorts
        let cardState = resorts.map((i) => {
          for (let j = 0; j < testStates.length; j++) {
            if (i.state === testStates[j].code) {
              return testStates[j];
            }
          }
        });
        console.log(cardState);

        //do a get request for every state/country corresponding to resorts.
        //unfortunately the snocountry api doesn't provide town or zip for the resorts so
        //just state weather for now
        let cardWeather = await Promise.all(
          cardState.map(async (i) => {
            try {
              let eachWeather = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${i.name}&appid=8fb137f32bd26f624e9cd15073b51fec&units=imperial`
              );
              return eachWeather.data;
            } catch {
              console.log("ruh roh");
            }
          })
        );
        //get regions if there are any
        let userRegions = await Region.find({ owner: req.session.userId });
        //round temps to whole number
        cardWeather.forEach((i) => {
          i.main.temp = Math.round(i.main.temp);
        });
        console.log(cardWeather);
        //render if user has resorts but no home resort
        res.render("resorts/index1", { resorts, cardWeather, userRegions });
      } else {
        //render if user has absolutely no data
        res.render("resorts/index0");
      }
    } else {
      //redirect to login if no one is logged in
      //you can hate from outside the club
      res.redirect("/users/login");
    }
  } catch {
    console.log("no");
    res.render("resorts/index");
  }
});

router.get("/resorts/add", async (req, res) => {
  res.redirect("resorts/home");
});

router.get("/update", async (req, res) => {
  res.redirect("http://localhost:3000/resorts/home");
});

//EDIT Resort
//Reassigns home resort
router.put("/update", async (req, res) => {
  let update = await req.body.resortId;
  //first set all resorts to not be home resorts
  await Resort.updateMany(
    { owner: req.session.userId },
    { $set: { isHomeResort: false } }
  );
  //then specify this particular resort as the home resort
  await Resort.findOneAndUpdate(
    {
      $and: [{ owner: req.session.userId }, { resortId: update }],
    },
    { $set: { isHomeResort: true } }
  );
  res.redirect("/resorts/home");
});

//CREATE - POST
//adds new resort to resorts collection. this needs to be redone, most
//of this info isnt necessary as the stats are updated with api calss on display pages
router.post("/", async (req, res) => {
  resp = await axios.get(
    `http://feeds.snocountry.net/getSnowReport.php?apiKey=SnoCountry.example&ids=${req.body.resortId}`
  );
  resorts = resp.data.items[0];
  //this is bad and will be redone. none of this needs to be stored in db
  const newResort = {
    resortName: resorts.resortName,
    resortId: resorts.id,
    state: resorts.state,
    logo: resorts.logo,
    primarySurfaceCondition: resorts.primarySurfaceCondition,
    maxOpenDownHillTrails: resorts.maxOpenDownHillTrails,
    openDownHillTrails: resorts.openDownHillTrails,
    terrainParksOpen: resorts.terrainParksOpen,
    terrainParkOpen: resorts.terrainParkOpen,
    openDownHillLifts: resorts.openDownHillLifts,
    maxOpenDownHillLifts: resorts.maxOpenDownHillLifts,
    owner: req.session.userId,
    avgBaseDepthMax: resorts.avgBaseDepthMax,
    avgBaseDepthMin: resorts.avgBaseDepthMin,
    maxOpenDownHillAcres: resorts.maxOpenDownHillAcres,
  };
  Resort.create(newResort);
  res.redirect("resorts/home");
});

//search page for new resorts
router.get("/new", (req, res) => {
  res.render("resorts/new");
});

//SHOW for new resort user serached for
router.post("/new", async (req, res) => {
  try {
    resp = await axios.get(
      `http://feeds.snocountry.net/getSnowReport.php?apiKey=SnoCountry.example&name=${req.body.resortId}`
    );
    resorts = resp.data.items[0];
    let homeState = await State.find({ code: resorts.state });
    let homeWeather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${homeState[0].name}&appid=8fb137f32bd26f624e9cd15073b51fec&units=imperial`
    );
    homeWeather.data.main.temp = Math.round(homeWeather.data.main.temp);
    res.render("resorts/view", { resorts, homeWeather });
  } catch {
    res.redirect("/resorts/new");
  }
});

//SHOW for resorts followed
router.get("/show/:resortId", async (req, res) => {
  try {
    let resortsArr = await Resort.find({
      $and: [{ owner: req.session.userId }, { resortId: req.params.resortId }],
    });
    let resorts = resortsArr[0];
    console.log(resorts);
    let homeState = await State.find({ code: resorts.state });
    let homeWeather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${homeState[0].name}&appid=8fb137f32bd26f624e9cd15073b51fec&units=imperial`
    );
    homeWeather.data.main.temp = Math.round(homeWeather.data.main.temp);
    res.render("resorts/show", { resorts, homeWeather });
  } catch {
    console.log("ruh roh");
  }
});

//Seed route for states/countries to link resorts to openweather
router.get("/seed", (req, res) => {
  const startStates = [
    { name: "Alabama", code: "AL" },
    { name: "Alaska", code: "AK" },
    { name: "Arizona", code: "AZ" },
    { name: "Australia", code: "AU" },
    { name: "Austria", code: "AT" },
    { name: "Arkansas", code: "AR" },
    { name: "California", code: "CA" },
    { name: "Colorado", code: "CO" },
    { name: "Connecticut", code: "CT" },
    { name: "Delaware", code: "DE" },
    { name: "Florida", code: "FL" },
    { name: "France", code: "FR" },
    { name: "France", code: "FRA" },
    { name: "Georgia", code: "GA" },
    { name: "Germany", code: "DEU" },
    { name: "Germany", code: "DE" },
    { name: "Germany", code: "GER" },
    { name: "Hawaii", code: "HI" },
    { name: "Idaho", code: "ID" },
    { name: "Illinois", code: "IL" },
    { name: "Indiana", code: "IN" },
    { name: "Iowa", code: "IA" },
    { name: "Italy", code: "IT" },
    { name: "Italy", code: "ITA" },
    { name: "Kansas", code: "KA" },
    { name: "Kentucky", code: "KY" },
    { name: "Louisiana", code: "LA" },
    { name: "Maine", code: "ME" },
    { name: "Maryland", code: "MD" },
    { name: "Massachusetts", code: "MA" },
    { name: "Michigan", code: "MI" },
    { name: "Minnesota", code: "MN" },
    { name: "Mississippi", code: "MS" },
    { name: "Missouri", code: "MO" },
    { name: "Montana", code: "MT" },
    { name: "Nebraska", code: "NE" },
    { name: "Nevada", code: "NV" },
    { name: "New Hampshire", code: "NH" },
    { name: "New Jersey", code: "NJ" },
    { name: "New Mexico", code: "NM" },
    { name: "New York", code: "NY" },
    { name: "New Zealand", code: "NZ" },
    { name: "North Carolina", code: "NC" },
    { name: "North Dakota", code: "ND" },
    { name: "Ohio", code: "OH" },
    { name: "Oklahoma", code: "OK" },
    { name: "Oregon", code: "OR" },
    { name: "Pennsylvania", code: "PA" },
    { name: "Rhode Island", code: "RI" },
    { name: "South Carolina", code: "SC" },
    { name: "South Dakota", code: "SD" },
    { name: "Switzerland", code: "SW" },
    { name: "Switzerland", code: "SUI" },
    { name: "Tennessee", code: "TN" },
    { name: "Texas", code: "TX" },
    { name: "Utah", code: "UT" },
    { name: "Vermont", code: "VT" },
    { name: "Virginia", code: "VA" },
    { name: "Washington", code: "WA" },
    { name: "West Virginia", code: "WV" },
    { name: "Wisconsin", code: "WI" },
    { name: "Wyoming", code: "WY" },
  ];

  State.deleteMany({}).then(() => {
    State.create(startStates)
      .then((data) => {
        res.json(data);
        console.log("this worked");
      })
      .catch(console.error);
  });
});

module.exports = router;
