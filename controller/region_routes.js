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
    console.log(regions)

    res.render("regions/view", { regions });
  });

module.exports = router;