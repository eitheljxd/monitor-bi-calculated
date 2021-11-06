const express = require("express");
const { waveform, surveys } = require("../config/db");
const { fixNormalize, calcFft } = require("../utils/utils.math");

let array = [];
const routes = express.Router({
  mergeParams: true,
});

routes.get("/", async (req, res) => {
  let result = await getWaveforms();
  for (let i = 0; i < result.length; i++) {
    let data = {
      survey: result[i].dataValues.row_survey,
      data: {
        displacement: {},
        acceleration: {},
        velocity: {},
        bands: {},
      },
    };
    fixNormalize(result[i].dataValues.waveforms_accelerations);
    data.acceleration = await calcFft(
      result[i].dataValues.waveforms_accelerations
    );
    array.push(data);
  }
  res.json({
    success: true,
    data: array,
    rows_affected: result.length,
  });
});
async function getWaveforms() {
  return await surveys.findAll({
    limit: 10,
    where: { state: 1 },
    include: [waveform],
  });
}
module.exports = {
  routes,
};
