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
    resorts = await Resort.find({ owner: req.session.userId });
    res.render("resorts/index", { resorts });
  } catch {
    console.log("no");
  }
});

router.get("/resorts/add", async (req, res) => {
  res.redirect("resorts/home");
});

router.get("/update/1", async (req, res) => {
  resorts = await Resort.find({ owner: req.session.userId });
  console.log(resorts[1].resortName)
  for (let i = 0; i < resorts.length; i++){
      if(i === 1){
        return Resort.findOneAndUpdate({resortName: resorts[1].resortName},[{$set:{isHomeResort:{$eq:[false,"$isHomeResort"]}}}])
      } else {
          return Resort.findOneAndUpdate({resortName: resorts[i].resortName}, {$set: {isHomeResort: false}})
      }
  }
  console.log(resorts[1]);
  res.redirect("http://localhost:3000/resorts/home");
});

router.get("/update/2", async (req, res) => {
  resorts = await Resort.find({ owner: req.session.userId });
  console.log(resorts[2]);
  for (let i = 0; i < resorts.length; i++){
    if(i === 2){
      return Resort.findOneAndUpdate({resortName: resorts[2].resortName},[{$set:{isHomeResort:{$eq:[false,"$isHomeResort"]}}}])
    } 
    
}
  
  res.redirect("http://localhost:3000/resorts/home");
});

router.get("/update/3", async (req, res) => {
  resorts = await Resort.find({ owner: req.session.userId });
  console.log(resorts[3]);
    


  res.redirect("http://localhost:3000/resorts/home");
});

router.post("/update", async (req, res) => {
  console.log(req.session);
  res.send("hey");
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
