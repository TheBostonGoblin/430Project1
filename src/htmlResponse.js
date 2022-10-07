const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const image = fs.readFileSync(`${__dirname}/../images/rabbit.png`);
const respondFunction = (request, response, status, content, contentType) => {
  response.writeHead(status, { 'Content-Type': contentType });
  response.write(content);
  response.end();
};

const getImage = (request, response) => {
  respondFunction(request, response, 200, image, 'image/png');
};
const getIndex = (request, response) => {
  respondFunction(request, response, 200, index, 'text/html');
};

const getCSS = (request, response) => {
  respondFunction(request, response, 200, css, 'text/css');
};

module.exports = {
  getIndex,
  getCSS,
  getImage,
};
