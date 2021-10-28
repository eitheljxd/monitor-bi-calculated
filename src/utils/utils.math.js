const { createModel } = require("polynomial-regression");
const {
 evaluate
} = require("mathjs");
const fs = require('fs');
var fft = require('fft-js').fft,
    fftUtil = require('fft-js').util,
    signal = [1,0,1,0];

const fixNormalize = async (curve) => {
  let data = [];
  let dataPurge = [];
  let data128 = []
  curve.map((a) => {

      if(a.row_point == 707){
        data.push([Number(a.dataValues.wfa_measure_x), Number(a.dataValues.wfa_measure_Y)]);
      }
  });


  ///

   for(let index = 0; index < 128; index++) {
      data128.push(data[index]);
    
    }

    data = data128;
    console.log(data);
  ///
  const model = createModel();
  model.fit(data, [3, 100]);
  let assertModel = model.expressions();
  assertModel = assertModel['100'];
  console.log("assertModel",assertModel);
  for(let i = 0 ; i< data.length; i++){
    let replace = assertModel.replace(/\x/g, i);
    let y =  evaluate(replace);
    dataPurge.push({
      x: curve[i].dataValues.wfa_measure_x,
      y: y
    })
  }

  fs.writeFileSync('./expressionsForGraphss2.json', JSON.stringify(dataPurge, null, 2));
};



const calcFft = async (curve) => {


  let data = [];
  let dataTest =[];
  curve.map((a) => {
      if(a.row_point == 709){
        data.push(Number(a.dataValues.wfa_measure_Y));
      }
  });



  var phasors= fft(data);
  const magnitudes = fftUtil.fftMag(phasors); 

  for(let i = 0 ; i< magnitudes.length; i++){
    dataTest.push({
      x: curve[i].dataValues.wfa_measure_x,
      y: magnitudes[i]
    })
  }
  console.log("dataTest",dataTest);
  fs.writeFileSync('./expressionsForGraphss2.json', JSON.stringify(dataTest, null, 2));

 
};






// Or

module.exports = {
  fixNormalize,
  calcFft
};
