const mongoose = require("./connection");
const State = require("./state");
const db = mongoose.connection;
db.on("open", () => {
  const startStates = [
    { name: "Alabama", code: "AL"},
    { name: "Alaska", code: "AK"},
    { name: "Arizona", code: "AZ"},
    { name: "Australia", code: "AU"},
    { name: "Austria", code: "AT" },
    { name: "Arkansas", code: "AR"},
    { name: "California", code: "CA"},
    { name: "Colorado", code: "CO"},
    { name: "Connecticut", code: "CT"},
    { name: "Delaware", code: "DE"},
    { name: "Florida", code: "FL"},
    { name: "Georgia", code: "GA"},
    { name: "Hawaii", code: "HI"},
    { name: "Idaho", code: "ID"},
    { name: "Illinois", code: "IL"},
    { name: "Indiana", code: "IN"},
    { name: "Iowa", code: "IA"},
    { name: "Kansas", code: "KA"},
    { name: "Kentucky", code: "KY"},
    { name: "Louisiana", code: "LA"},
    { name: "Maine", code: "ME"},
    { name: "Maryland", code: "MD"},
    { name: "Massachusetts", code: "MA"},
    { name: "Michigan", code: "MI"},
    { name: "Minnesota", code: "MN"},
    { name: "Mississippi", code: "MS"},
    { name: "Missouri", code: "MO"},
    { name: "Montana", code: "MT"},
    { name: "Nebraska", code: "NE"},
    { name: "Nevada", code: "NV"},
    { name: "New Hampshire", code: "NH"},
    { name: "New Jersey", code: "NJ"},
    { name: "New Mexico", code: "NM"},
    { name: "New York", code: "NY"},
    { name: "North Carolina", code: "NC"},
    { name: "North Dakota", code: "ND"},
    { name: "Ohio", code: "OH"},
    { name: "Oklahoma", code: "OK"},
    { name: "Oregon", code: "OR"},
    { name: "Pennsylvania", code: "PA"},
    { name: "Rhode Island", code: "RI"},
    { name: "South Carolina", code: "SC"},
    { name: "South Dakota", code: "SD"},
    { name: "Switzerland", code: "SW"},
    { name: "Switzerland", code: "SUI"},
    { name: "Tennessee", code: "TN"},
    { name: "Texas", code: "TX"},
    { name: "Utah", code: "UT"},
    { name: "Vermont", code: "VT"},
    { name: "Virginia", code: "VA"},
    { name: "Washington", code: "WA"},
    { name: "West Virginia", code: "WV"},
    { name: "Wisconsin", code: "WI"},
    { name: "Wyoming", code: "WY"},
  ];

  State.remove({})
    .then((deletedStates) => {
      console.log("this is what remove return", deletedStates);
      State.create(startStates)
        .then((data) => {
          console.log("the new states", data);
          db.close();
        })
        .catch((error) => {
          console.log(error);
          db.close();
        });
    })
    .catch((error) => {
      console.log("error:", error);
      db.close;
    });
});
