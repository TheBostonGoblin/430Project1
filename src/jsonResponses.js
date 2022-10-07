const charts = {};

const respondJSON = (request, response, status, content) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(content));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};
const getCharts = (request, response) => { // used to get a specific chart
  const responseJSON = {
    charts,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getChartNames = (request, response) => {
  let keys = Object.keys(charts);
  return respondJSON(request, response, 200, keys);
}
const deleteChart = (request, response, body) => {
  let keys = Object.keys(charts);
  if (charts[body.name]) {
    const responseJSON = {
      message: `Chart ${body.name} Has Been Sucessfully Removed`,
    };
    delete charts[body.name];
    return respondJSON(request, response, 200, responseJSON);
  }
  else {
    const responseJSON = {
      message: 'You Must Create a Chart to Remove One',
      id: 'chartDoesNotExist',
    };
    return respondJSON(request, response, 400, responseJSON);
  }

}
const createChart = (request, response, body) => {

  if (!body.name || !body.qualitNam || !body.quantNam || body.prefix === null || body.prefix === undefined || body.suffix === null || body.suffix === undefined) {
    const responseJSON = {
      message: 'To Create a chart you need a Name, qualitative data name, as well as a quantitative data name',
      id: 'missingParams',
    };
    return respondJSON(request, response, 400, responseJSON);

  }
  else if (!charts[body.name]) {
    const responseJSON = {
      message: `The Chart Named "${body.name}" Created Sucessfully`,
    };

    const qualitName = body.qualitNam;

    const quantName = body.quantNam;

    charts[body.name] = [
      {
        [quantName]: null,
        [qualitName]: null,
        prefix: body.prefix,
        suffix: body.suffix
      }
    ];

    return respondJSON(request, response, 201, responseJSON);
  }
  else {
    const responseJSON = {
      message: 'You cannot create a chart of the same name',
      id: 'missingParams',
    };
    return respondJSON(request, response, 400, responseJSON);
  }


};

const createBar = (request, response, body) => {
  let chartSelected = eval(`charts.${body.name}`)
  //getting the keys for the items
  let keys = Object.keys(chartSelected[0]);
  let quantKey = keys[0];
  let qualitKey = keys[1];
  let updated = false;

  if (!body.name || !body.qualitVal || !body.quantVal) {
    const responseJSON = {
      message: 'To Create a bar you need to pass in the charts name and the qualitive and quantative data as well as the qualitiveName',
      id: 'missingParams',
    }
    return respondJSON(request, response, 400, responseJSON);
  }
  else if (eval(`chartSelected[0].${qualitKey} === null`)) {
    updated = false;



    chartSelected.forEach(bar => {
      if (eval(`bar.${quantKey} != null`)) {
        eval(`bar.${quantKey} = body.quantVal`);
        updated = true;
        return respondJSONMeta(request, response, 204);
      }
    });

    if (!updated) {
      //using a variable to test if this is the first time data is being added
      let testingChart = eval(`chartSelected[0].${quantKey}`);
      if (testingChart === null) {//determines if this is the first time a bar is being added and thus fills in the null data other wise it will create an new object
        eval(`chartSelected[0].${quantKey} = body.quantVal`);
        eval(`chartSelected[0].${qualitKey} = body.qualitVal`);
        const responseJSON = {
          message: `Bar "${body.qualitVal}" Has Been Created & Added to The Chart "${body.name}"`
        }
        return respondJSON(request, response, 201, responseJSON);
      }
    }

  }
  else {
    updated = false;
    chartSelected.forEach(bar => {
      if (eval(`bar.${qualitKey} === body.qualitVal`)) {
        eval(`bar.${quantKey} = body.quantVal`);
        updated = true;
        return respondJSONMeta(request, response, 204);
      }
    });

    if(!updated){
      const newData = {
        [quantKey]: body.quantVal,
        [qualitKey]: body.qualitVal
      }
      console.log(newData);
      charts[body.name].push(newData);
  
      const responseJSON = {
        message: `Bar "${body.qualitVal}" Has Been Created & Added to The Chart "${body.name}"`
      }
      return respondJSON(request, response, 201, responseJSON);
    }
    


  }

}

const notFound = (request, response) => {
  const responseJSON = {
    message: 'the page you are looking for is not found',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};
const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// const createChart = (request,response,body) =>{
//   if (!body.name || !body.qualitNam || !body.quantNam){
//     const responseJSON = {
//       message: 'To Create a chart you need to name the chart a give names to the qualitative and quantatative data',
//       id: 'missingParams',
//     };
//     return respondJSON(request, response, 400, responseJSON);
//   }
//   else if(!charts[body.name]){
//     const responseJSON = {
//       message: 'Chart Created Sucessfully',
//     };

//     const qualitName = body.qualitNam;

//     const quantName = body.quantNam;

//     charts[body.name] = [
//       {
//         qualitiveName: qualitName,
//         quantativeName: quantName,
//         data : []
//       }
//     ];

//     return respondJSON(request, response, 201, responseJSON);
//   }
//   else{

//     const responseJSON = {
//       message: 'Charts quantative/qualitative data names has been changed/updated',
//     };

//     const qualitName = body.qualitNam;
//     const quantName = body.quantNam;
//     charts[body.name].qualitiveName = qualitName;
//     charts[body.name].quantativeName = quantName;

//     return respondJSON(request, response, 201, responseJSON);
//   }
// }
// const addBar  = (request,response,body) =>{
//   if(!body.name || !body.qualitNam || !body.quantNam || !body.qualitVal || !body.quantVal){
//     const responseJSON = {
//       message: 'To Create a chart you need a Name, qualitative data name, as well as a quantitative data name',
//       id: 'missingParams',
//     };
//     return respondJSON(request, response, 400, responseJSON);
//   }
//   else{
//     const responseJSON = {
//       message: 'A Bar has been added to the chart',
//     };

//     const dataSet = {
//       [body.quantNam] : body.quantVal,
//       [body.qualitNam] : body.qualitVal
//     }
//     charts[body.name].data.push(dataSet);
//     return respondJSON(request, response, 201, responseJSON);
//   }



// }
// const getChartKeys = (request,response) =>{
//   let keys =  Object.keys(charts);
//   return respondJSON(request,response,200,keys);
// }

module.exports = {
  getCharts,
  createChart,
  createBar,
  //addBarToChart,
  notFound,
  notFoundMeta,
  getChartNames,
  deleteChart
};
// const addBar = (request, response, body) => {//selected value should be the charts name
//     if (!body.name || !body.qualitVal || !body.quantVal) {
//         const responseJSON = {
//             message: 'To Create chart/add bar to existing chart all parameters must be filled',
//             id: 'missingParams',
//         };
//         return respondJSON(request, response, 400, responseJSON);
//     }
//     else if (!selected) {
//         const responseJSON = {
//             message: 'In order to add bars to a chart a chart must be selected and or created',
//             id: 'chartNotSelected',
//         };
//         return respondJSON(request, response, 400, responseJSON);
//     }
//     else {

//         let newData = {

//         }
//     }
// }
