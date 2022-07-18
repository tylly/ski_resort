const express = require("express");
const router = express.Router();
const Region = require("../models/region");

const axios = require("axios");


router.get("/", async (req, res) => {
  try {
    res.render("regions/index");
  } catch {
    console.log("error");
  }
});

router.post("/", async (req, res) => {
    console.log(req.body)
    const newRegion = {
      regionName: regionId,
      owner: req.session.userId
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
        
    regions = resp.data.items
    regionId = req.body.regionId
    regionId = regionId.toUpperCase()
    console.log(req.body)

    res.render("regions/view", { regions, regionId });
  });

  //SHOW for User Regions

  router.get('/show/:regionId', async (req, res) => {
      regionId = req.params.regionId
      resp = await axios.get(
        `http://feeds.snocountry.net/getSnowReport.php?apiKey=SnoCountry.example&regions=${regionId}`
      );
      regions = resp.data.items
      res.render('regions/show', {regions, regionId})
  })

module.exports = router;