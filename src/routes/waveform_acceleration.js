const express = require("express");
const { waveform, surveys } = require("../config/db");
const {
  fixNormalize,
  calcFft,
  integrateAcceleration,
  integrateVelocity,
} = require("../utils/utils.math");
const fs = require("fs");

let array = [];
const routes = express.Router({
  mergeParams: true,
});

routes.get("/", async (req, res) => {
  let result = await getWaveforms();
  console.log(result.length);
  for (let i = 0; i < result.length; i++) {
    let data = {
      survey: result[i].dataValues.row_survey,
      data: {
        displacement: [],
        acceleration: [],
        velocity: [],
        bands: {},
      },
    };
    data.data.acceleration = await calcFft(
      result[i].dataValues.waveforms_accelerations
    );
    data.data.velocity = await integrateAcceleration(data.data.acceleration);
    data.data.displacement = await integrateVelocity(data.data.velocity);
    array.push(data);
  }
  res.json(array);
});
async function getWaveforms() {
  return await surveys.findAll({
    limit: 10,
    where: { state: 1, row_survey: 18404 },
    include: [waveform],
  });
}
module.exports = {
  routes,
};
