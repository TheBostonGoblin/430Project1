const http = require('http');
const url = require('url');
const htmlHandler = require('./htmlResponse.js');

const port = prcoess.env.PORT || process.env.NODE_PORT || 3000;

const handleGet = (request,response,parsedURL) =>{
    if(parsedURL.pathname == '/'){
        htmlHandler.getIndex(request,response);
    }
    else if(parsedURL.pathname == '/style'){
        htmlHandler.getCSS(request,response);
    }
    else{
        htmlHandler.getIndex(request,response);
    }
}

const onRequest = (request,response) =>{
    const parsedURL = url.parse(request.url);
    handleGet(request,response,parsedURL);
}

http.createServer(onRequest).listen(port, () =>{
    console.log(`Listening on 127.0.0.1:${port}`);
})