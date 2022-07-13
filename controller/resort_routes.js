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
    // const url = `http://feeds.snocountry.net/getSnowReport.php?apiKey=SnoCountry.example&ids=100001`;
    // resp = await axios.get(url);
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
  console.log("FUCK");
  resp = await axios.get(
    `http://feeds.snocountry.net/getSnowReport.php?apiKey=SnoCountry.example&ids=${req.body.resortId}`
  );
  resorts = resp.data.items[0];
  console.log(resorts)
  const newResort = {
    resortName: resorts.resortName,
    logo: resorts.logo,
    primarySurfaceCondition: resorts.primarySurfaceCondition,
    openDownHillTrail: resorts.maxOpenDownHillTrails,
    terrainParksOpen: resorts.terrainParksOpen,
    owner: req.session.userId,
  };
  Resort.create(newResort);
  res.redirect("resorts/home");
});

router.get("/view", async (req, res) => {
  res.render("/home");
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
  res.render("resorts/view", { resorts });
});

module.exports = router;
