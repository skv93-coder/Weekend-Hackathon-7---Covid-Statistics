const express = require("express");
const mongoose = require("mongoose");
//const { connection } = require("./connector");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require("./connector");
app.get("/totalRecovered", (req, res) => {
  let totalRecovered = 0;
  connection
    .find({}, (err, data) => {
      if (err) {
        res.send(err);
        return;
      } else {
        data.forEach((element) => {
          totalRecovered += element.recovered;
        });
      }
    })
    .then((result) =>
      res.send({ data: { _id: "total", recovered: totalRecovered } })
    )
    .catch((err) => res.send(err));
});
app.get("/totalActive", (req, res) => {
  let totalRecovered = 0;
  connection
    .find({}, (err, data) => {
      if (err) {
        res.send(err);
        return;
      } else {
        data.forEach((element) => {
          totalRecovered += element.infected - element.recovered;
        });
      }
    })
    .then((result) =>
      res.send({ data: { _id: "total", active: totalRecovered } })
    )
    .catch((err) => res.send(err));
});

app.get("/totalDeath", (req, res) => {
  let totalRecovered = 0;
  connection
    .find({}, (err, data) => {
      if (err) {
        res.send(err);
        return;
      } else {
        data.forEach((element) => {
          totalRecovered += element.death;
        });
      }
    })
    .then((result) =>
      res.send({ data: { _id: "total", death: totalRecovered } })
    )
    .catch((err) => res.send(err));
});

app.get("/hotspotStates", (req, res) => {
  let totalRecovered = 0;
  let hotspotData = [];
  connection
    .find({}, (err, data) => {
      if (err) {
        res.send(err);
        return;
      } else {
        hotspotData = [];
        for (let i = 0; i < data.length; i++) {
          let rate = (data[i].infected - data[i].recovered) / data[i].infected;
          rate = rate.toFixed(5);
          if (rate > 0.1) {
            hotspotData.push({ state: data[i].state, rate: rate });
          }
        }

        return hotspotData;
      }
    })
    .then(() => res.send(hotspotData))
    .catch((err) => res.send(err));
});

app.get("/healthyStates", (req, res) => {
  let totalRecovered = 0;
  let hotspotData = [];
  connection
    .find({}, (err, data) => {
      if (err) {
        res.send(err);
        return;
      } else {
        hotspotData = [];
        for (let i = 0; i < data.length; i++) {
          let rate = data[i].death / data[i].infected;
          rate = rate.toFixed(5);
          if (rate < 0.005) {
            hotspotData.push({ state: data[i].state, mortality: rate });
          }
        }

        return hotspotData;
      }
    })
    .then(() => res.send(hotspotData))
    .catch((err) => res.send(err));
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
