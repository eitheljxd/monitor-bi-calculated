const { createModel } = require("polynomial-regression");

const fixNormalize = async (curve) => {
  let data = [];
  curve.map((a) => {
    data.push([a.dataValues.wfa_measure_x, a.dataValues.wfa_measure_Y]);
  });

  const model = createModel();
  model.fit(data, [3, 20]);
  model.saveExpressions("./expressionsForGraphs.json");
};

module.exports = {
  fixNormalize,
};
