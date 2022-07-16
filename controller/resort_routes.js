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


//DELETE - RESORT
router.delete("/home", async (req, res) => {
  console.log(req.body);
  let destroy = await req.body.resortId;
  await Resort.deleteOne({ resortId: destroy });
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
      res.render("resorts/index", { resorts, home });
    } else {
      res.redirect("http://localhost:3000/users/login");
    }
  } catch {
    console.log("no");
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
  console.log(update);
  await Resort.updateMany({owner: req.session.userId}, { $set: { isHomeResort: false } });
  await Resort.findOneAndUpdate({
    $and: [{ owner: req.session.userId }, { resortId: update }], 
  }, { $set: { isHomeResort: true } });
  res.redirect("http://localhost:3000/resorts/home");
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
    maxOpenDownHillAcres: resorts.maxOpenDownHillAcres,
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
  console.log(resorts);
  res.render("resorts/view", { resorts });
});

module.exports = router;
