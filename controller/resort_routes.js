const express = require("express");
const router = express.Router();
const Resort = require("../models/resort");

const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    res.send("help");
  } catch {
    console.log("error");
  }
});

router.get("/home", async (req, res) => {
  try {
    resorts = await Resort.find({owner: req.session.userId})
    console.log(resorts)
    res.render("resorts/index", { resorts });
  } catch {
    console.log("no");
  }
});

router.get("/resorts/add", async (req, res) => {
  res.redirect("resorts/home");
});

router.post("/", async (req, res) => {
  resp = await axios.get(
    `http://feeds.snocountry.net/getSnowReport.php?apiKey=SnoCountry.example&ids=${req.body.resortId}`
  );
  resorts = resp.data.items[0];
  
  const newResort = {
    resortName: resorts.resortName,
    resortId: resorts.id,
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
  };
  Resort.create(newResort);
  res.redirect("resorts/home");
});


/////////////////////
//CREATE
/////////////////////
router.get("/new", (req, res) => {
  res.render("resorts/new");
});

router.post("/new", async (req, res) => {
  resp = await axios.get(
    `http://feeds.snocountry.net/getSnowReport.php?apiKey=SnoCountry.example&ids=${req.body.resortId}`
  );
  resorts = resp.data.items[0];
  console.log(resorts)
  res.render("resorts/view", { resorts });
});

module.exports = router;
