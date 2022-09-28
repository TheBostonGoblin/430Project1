const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/client.html`);

const respondFunction = (request,response,status,content,contentType) =>{
    response.writeHead(status,{'Content-Type': contentType});
    response.write(content);
    response.end();
}

const getIndex = (request,response) =>{
    respondFunction(request,response,200,index,'text/html');
}

const getCSS = (request,response) =>{
    respondFunction(request,response,200,index,'text/css');
}

module.exports = {
    getIndex,
    getCSS
}