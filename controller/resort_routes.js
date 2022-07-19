const express = require("express");
const router = express.Router();
const Resort = require("../models/resort");
const Region = require("../models/region");

const axios = require("axios");
const State = require("../models/state");

router.get("/", async (req, res) => {
  try {
    res.send("help");
  } catch {
    console.log("error");
  }
});

//DELETE - RESORT
router.delete("/home", async (req, res) => {
  let destroy = await req.body.resortId;
  await Resort.deleteOne({
    $and: [{ owner: req.session.userId }, { resortId: destroy }],
  });
  res.redirect("http://localhost:3000/resorts/home");
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
      if (home.length > 0
        ) {
        

        console.log(home.length)
        
        let userRegions = await Region.find({ owner: req.session.userId });
        let homeState = await State.find({ code: home[0].state });
        
        //thank you fei
        //linking state codes to their names so they place nice with openweather
        //i need to fix this and not query the database every time. i need to get all docs with a find and then filter.
        //USE FILTER METHOD
        let cardState = await Promise.all(
          resorts.map(async (i) => {
            try {
              let cardName = await State.find({ code: i.state });
              return cardName[0];
            } catch {
              console.log("ruh roh");
            }
          })
        );
        let homeWeather = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${homeState[0].name}&appid=8fb137f32bd26f624e9cd15073b51fec&units=imperial`
        );
        homeWeather.data.main.temp = Math.round(homeWeather.data.main.temp);
        //getting weather for all other resorts followed. again thank you fei for the sync iterator tip
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
        res.render("resorts/index", {
          resorts,
          home,
          userRegions,
          homeWeather,
          cardWeather,
        });
      } else if (
        resorts.length > 0) {
          console.log(resorts)
        let cardState = await Promise.all(
          resorts.map(async (i) => {
            try {
              let cardName = await State.find({ code: i.state });
              return cardName[0];
            } catch {
              console.log("ruh roh");
            }
          })
        );
        console.log(cardState)
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
        console.log(cardWeather)
        //render if user has resorts but no home resort
        res.render('resorts/index', {resorts, cardWeather})
      } else {
        //render if user has absolutely no data
        res.render('resorts/index')
      }
    } else {
      res.redirect("http://localhost:3000/users/login");
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
  await Resort.updateMany(
    { owner: req.session.userId },
    { $set: { isHomeResort: false } }
  );
  await Resort.findOneAndUpdate(
    {
      $and: [{ owner: req.session.userId }, { resortId: update }],
    },
    { $set: { isHomeResort: true } }
  );
  res.redirect("http://localhost:3000/resorts/home");
});

/////////////////////
//CREATE
/////////////////////
router.post("/", async (req, res) => {
  resp = await axios.get(
    `http://feeds.snocountry.net/getSnowReport.php?apiKey=SnoCountry.example&ids=${req.body.resortId}`
  );
  resorts = resp.data.items[0];

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

router.get("/new", (req, res) => {
  res.render("resorts/new");
});

router.post("/new", async (req, res) => {
  resp = await axios.get(
    `http://feeds.snocountry.net/getSnowReport.php?apiKey=SnoCountry.example&ids=${req.body.resortId}`
  );
  resorts = resp.data.items[0];
  let homeState = await State.find({ code: resorts.state });
  let homeWeather = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${homeState[0].name}&appid=8fb137f32bd26f624e9cd15073b51fec&units=imperial`
  );
  homeWeather.data.main.temp = Math.round(homeWeather.data.main.temp);
  res.render("resorts/view", { resorts, homeWeather });
});

//My resort SHOW
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
    console.log(homeWeather);
    res.render("resorts/show", { resorts, homeWeather });
  } catch {
    console.log("ruh roh");
  }
});

module.exports = router;
