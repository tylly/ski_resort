const express = require("express");
const router = express.Router();
const Region = require("../models/region");
const Resort = require("../models/resort");
const State = require("../models/state");
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    res.render("regions/index");
  } catch {
    console.log("error");
  }
});

//DELETE region
router.delete("/delete/:regionName", async (req, res) => {
  destroy = req.body.regionId;
  await Region.deleteOne({
    $and: [{ owner: req.session.userId }, { regionName: destroy }],
  });
  res.redirect("http://localhost:3000/resorts/home");
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const newRegion = {
    regionName: regionId,
    owner: req.session.userId,
  };
  Region.create(newRegion);
  res.redirect("resorts/home");
});

router.get("/new", async (req, res) => {
  try {
    res.render("regions/new");
  } catch {
    console.log("error");
  }
});

router.post("/new", async (req, res) => {
  resp = await axios.get(
    `http://feeds.snocountry.net/getSnowReport.php?apiKey=SnoCountry.example&regions=${req.body.regionId}`
  );

  regions = resp.data.items;
  regionId = req.body.regionId;
  regionId = regionId.toUpperCase();
  console.log(req.body);

  res.render("regions/view", { regions, regionId });
});

//SHOW for User Regions

router.get("/show/:regionId", async (req, res) => {
  let regionId = req.params.regionId;
  resp = await axios.get(
    `http://feeds.snocountry.net/getSnowReport.php?apiKey=SnoCountry.example&regions=${regionId}`
  );
  let regions = resp.data.items;
  //i need to fix this so its not looping through database
  let testStates = await State.find({});
  let cardState = regions.map((i) => {
    for (let j = 0; j < testStates.length; j++) {
      if (i.state === testStates[j].code) {
        return testStates[j];
      }
    }
  });
  //getting weather for each resort in region
  let cardWeather = await Promise.all(
    cardState.map(async (i) => {
      try {
        let eachWeather = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${i[0].name}&appid=8fb137f32bd26f624e9cd15073b51fec&units=imperial`
        );
        return eachWeather.data;
      } catch {
        console.log("ruh roh");
      }
    })
  );
  console.log(cardWeather)
  res.render("regions/show", { regions, regionId, cardWeather });
});

module.exports = router;
