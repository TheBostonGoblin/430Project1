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

const getChartNames = (request,response) =>{
  let keys =  Object.keys(charts);
  return respondJSON(request,response,200,keys);
}
const addBarToChart = (request, response, body) => {
  if (!body.name || !body.qualitNam || !body.quantNam || !body.qualitVal || !body.quantVal) {
    const responseJSON = {
      message: 'To Create a chart you need a Name, qualitative data name, as well as a quantitative data name',
      id: 'missingParams',
    };
    return respondJSON(request, response, 400, responseJSON);
  }
  if (!charts[body.name]) {
    const responseJSON = {
      message: 'Chart Created Sucessfully',
    };

    const qualitName = body.qualitNam;

    const quantName = body.quantNam;

    charts[body.name] = [
      {
        [quantName]: body.quantVal,
        [qualitName]: body.qualitVal,
      }
    ];

    return respondJSON(request, response, 201, responseJSON);
  }

  const qualitName = body.qualitNam;

  const quantName = body.quantNam;

  charts[body.name].push(
    {
      [quantName]: body.quantVal,
      [qualitName]: body.qualitVal,
    }
  );
  return respondJSONMeta(request, response, 204);

  // else{//changing/updating the labels on your qualitave and quantitative
  //     charts[body.name].qualit = body.qualit;
  //     charts[body.name].quant = body.quant;
  //     return respondJSONMeta(request, response, 204);
  // }
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'the page you are looking for is not found',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};
const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  getCharts,
  addBarToChart,
  notFound,
  notFoundMeta,
  getChartNames
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
