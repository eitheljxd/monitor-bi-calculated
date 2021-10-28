const express = require("express");
const { waveform, surveys } = require("../config/db");
const { fixNormalize,calcFft } = require("../utils/utils.math");

const routes = express.Router({
  mergeParams: true,
});

routes.get("/", async (req, res) => {
  let result = await getWaveforms();
  for (let i = 0; i < result.length; i++) {
    //fixNormalize(result[i].dataValues.waveforms_accelerations);
    calcFft(result[i].dataValues.waveforms_accelerations);
      break;
  }
  res.json({
    success: true,
    rows_affected: result.length,
  });
});
async function getWaveforms() {
  return await surveys.findAll({
    limit: 1,
    where: { state: 1,  row_survey: 17584  },
    include: [waveform],
  });
}
module.exports = {
  routes,
};
