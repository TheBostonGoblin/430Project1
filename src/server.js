const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponse.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);
    handler(request, response, bodyParams);
  });
};

const handleGet = (request, response, parsedURL) => {
  if (parsedURL.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedURL.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedURL.pathname === '/getCharts') {
    jsonHandler.getCharts(request, response);
  } else if (parsedURL.pathname === '/images/rabbit.png') {
    htmlHandler.getImage(request, response);
  } else if (parsedURL.pathname === '/getPreExisting') {
    jsonHandler.getChartNames(request, response);
  } else {
    jsonHandler.notFoundMeta(request, response);
  }
};

const handlePost = (request, response, parsedURL) => {
  if (parsedURL.pathname === '/addChart') {
    parseBody(request, response, jsonHandler.createChart);
  } else if (parsedURL.pathname === '/removeChart') {
    parseBody(request, response, jsonHandler.deleteChart);
  } else if (parsedURL.pathname === '/addBar') {
    parseBody(request, response, jsonHandler.createBar);
  }
};

const handleHead = (request, response, parsedURL) => {
  if (parsedURL.pathname === '/notFound') {
    jsonHandler.notFoundMeta(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedURL);
  } else if (request.method === 'GET') {
    handleGet(request, response, parsedURL);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedURL);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
