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
  const keys = Object.keys(charts);
  return respondJSON(request, response, 200, keys);
};
const deleteChart = (request, response, body) => {
  if (charts[body.name]) {
    const responseJSON = {
      message: `Chart ${body.name} Has Been Sucessfully Removed`,
    };
    delete charts[body.name];
    return respondJSON(request, response, 200, responseJSON);
  }

  const responseJSON = {
    message: 'You Must Create a Chart to Remove One',
    id: 'chartDoesNotExist',
  };
  return respondJSON(request, response, 400, responseJSON);
};
const createChart = (request, response, body) => {
  if (!body.name
    || !body.qualitNam
    || !body.quantNam
    || body.prefix === null
    || body.prefix === undefined
    || body.suffix === null
    || body.suffix === undefined) {
    const responseJSON = {
      message: 'To Create a chart you need a Name, qualitative name,and quantitative name',
      id: 'missingParams',
    };
    return respondJSON(request, response, 400, responseJSON);
  }
  if (!charts[body.name]) {
    const responseJSON = {
      message: `The Chart Named "${body.name}" Created Sucessfully`,
    };

    let qualitName = body.qualitNam;

    let quantName = body.quantNam;

    let chartName = body.name;

    qualitName = qualitName.replace(/\s/g,'');
    quantName = quantName.replace(/\s/g,'');
    chartName = chartName.replace(/\s/g,'');

    charts[chartName] = [
      {
        [quantName]: null,
        [qualitName]: null,
        prefix: body.prefix,
        suffix: body.suffix,
      },
    ];

    return respondJSON(request, response, 201, responseJSON);
  }

  const responseJSON = {
    message: 'You cannot create a chart of the same name',
    id: 'missingParams',
  };
  return respondJSON(request, response, 400, responseJSON);
};

const createBar = (request, response, body) => {
  // const chartSelected = Function(`return charts.${body.name}`);
  // const e = eval;
  // e(`const chartSelected = charts.${body.name}`);
  // getting the keys for the items

  let chartSelected = charts[body.name];
  const keys = Object.keys(chartSelected[0]);
  const quantKey = keys[0];
  const qualitKey = keys[1];
  let updated = false;

  if (!body.name || !body.qualitVal || !body.quantVal) {
    const responseJSON = {
      message: 'To Create a bar you need to pass in the charts name and the qualitive and quantative data as well as the qualitiveName',
      id: 'missingParams',
    };
    return respondJSON(request, response, 400, responseJSON);
  }
  if (chartSelected[0][qualitKey] === null) {
    updated = false;

    chartSelected = chartSelected.map((_bar) => {
      if (_bar[qualitKey] === body.qualitVal) {
        const bar = { ..._bar };
        bar[quantKey] = body.quantVal;
        updated = true;
        return bar;
      }
      return _bar;
    });

    if (!updated) {
      // using a variable to test if this is the first time data is being added
      const testingChart = chartSelected[0][quantKey];

      /* determines if this is the first time
      a bar is being added and thus fills in the null
      data other wise it will create an new object */
      if (testingChart === null) {
        chartSelected[0][quantKey] = body.quantVal;
        chartSelected[0][qualitKey] = body.qualitVal;
        const responseJSON = {
          message: `Bar "${body.qualitVal}" Has Been Created & Added to The Chart "${body.name}"`,
        };
        return respondJSON(request, response, 201, responseJSON);
      }
    }
    charts[body.name] = chartSelected;
    return respondJSONMeta(request, response, 204);
  }
  updated = false;
  chartSelected = chartSelected.map((_bar) => {
    if (_bar[qualitKey] === body.qualitVal) {
      const bar = { ..._bar };
      bar[quantKey] = body.quantVal;
      updated = true;
      return bar;
    }
    return _bar;
  });
  if (!updated) {
    const newData = {
      [quantKey]: body.quantVal,
      [qualitKey]: body.qualitVal,
    };
    charts[body.name].push(newData);

    const responseJSON = {
      message: `Bar "${body.qualitVal}" Has Been Created & Added to The Chart "${body.name}"`,
    };
    return respondJSON(request, response, 201, responseJSON);
  }
  charts[body.name] = chartSelected;
  return respondJSONMeta(request, response, 204);
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
  createChart,
  createBar,
  // addBarToChart,
  notFound,
  notFoundMeta,
  getChartNames,
  deleteChart,
};
