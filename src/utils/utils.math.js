const { createModel } = require("polynomial-regression");
const { evaluate } = require("mathjs");
const fs = require("fs");
var fft = require("fft-js").fft,
  fftUtil = require("fft-js").util;
const FIXED_MULTIPLIER_VS = 670.0;

const fixNormalize = async (curve) => {
  let data = [];
  let dataPurge = [];
  let data128 = [];
  curve.map((a) => {
    if (a.row_point == 707) {
      data.push([
        Number(a.dataValues.wfa_measure_x),
        Number(a.dataValues.wfa_measure_Y),
      ]);
    }
  });

  ///

  for (let index = 0; index < 128; index++) {
    data128.push(data[index]);
  }

  data = data128;
  console.log(data);
  ///
  const model = createModel();
  model.fit(data, [3, 100]);
  let assertModel = model.expressions();
  assertModel = assertModel["100"];
  console.log("assertModel", assertModel);
  for (let i = 0; i < data.length; i++) {
    let replace = assertModel.replace(/\x/g, i);
    let y = evaluate(replace);
    dataPurge.push({
      x: curve[i].dataValues.wfa_measure_x,
      y: y,
    });
  }

  fs.writeFileSync(
    "./expressionsForGraphss2.json",
    JSON.stringify(dataPurge, null, 2)
  );
};

const calcFft = async (curve) => {
  let consolid = [];
  let points = [];
  //Extract the points
  curve.map((object) => {
    var ob = points.findIndex((x) => x == object.dataValues.row_point);
    ob === -1 ? points.push(object.dataValues.row_point) : null;
  });
  // Search data for each points
  for (let index = 0; index < points.length; index++) {
    let data = [];
    let dataY = [];
    let dataX = [];
    let result = {
      row_point: null,
      data: [],
    };

    let row_point = points[index];

    curve.find((o) => {
      if (o.dataValues.row_point === points[index]) {
        dataY.push(Number(o.dataValues.wfa_measure_Y));
        dataX.push(Number(o.dataValues.wfa_measure_x));
      }
    });

    var phasors = fft(dataY);
    const magnitudes = fftUtil.fftMag(phasors);

    magnitudes.map((object, i) => {
      data.push({
        x: dataX[i],
        y: object,
      });
    });

    result.row_point = row_point;
    result.data = data;
    consolid.push(result);
  }

  return consolid;
};

const integrateAcceleration = async (curve) => {
  let consolid = [];
  curve.map((row) => {
    const row_point = row.row_point;
    let result = {
      row_point: row_point,
      data: [],
    };
    let dataAux = [];
    const data = row.data;
    data.map((object, i) => {
      dataAux.push({
        x: object.x,
        y: object.y / (FIXED_MULTIPLIER_VS * (i + 1)),
      });
    });
    result.data = dataAux;
    consolid.push(result);
  });
  return consolid;
};

const integrateVelocity = async (curve) => {
  let consolid = [];
  curve.map((row) => {
    const row_point = row.row_point;
    let result = {
      row_point: row_point,
      data: [],
    };
    let dataAux = [];
    const data = row.data;
    data.map((object, i) => {
      dataAux.push({
        x: object.x,
        y: FIXED_MULTIPLIER_VS * (object.y / (2 * Math.PI * (i + 1))),
      });
    });
    result.data = dataAux;
    consolid.push(result);
  });
  return consolid;
};
// Or

module.exports = {
  fixNormalize,
  calcFft,
  integrateAcceleration,
  integrateVelocity,
};
