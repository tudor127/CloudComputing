const http = require('http');
const url = require('url');
const fs = require('fs');
const config = require('./config.json');
const webServices = require('./webServices');
const layout = require('./layout');

const server = http.createServer((req,res)=>{
  let pageUrl = req.url;
  let query = url.parse(pageUrl,true);
  let page = query.pathname;
  let currentURL = new URL(`http://localhost:${config.server.port+req.url}`);
  let params = currentURL.searchParams;
/* home page */
 if(page == '/'){
    res.setHeader("Content-Type","text/html");
    let homePageLayout = layout.showHomePage(); 
    res.write(homePageLayout);
    res.end();
  }
/* first web service (word synonym) */
  else if(page == '/first'){
      if(!params.has('word')){
        res.setHeader("Content-Type","application/json");
        res.end(`{"error":"word missing"}`);
      }
      else{
        let synonym = params.get('word');
        webServices.first(synonym,(result)=>{
          res.setHeader("Content-Type","application/json");
          res.end(result);
        });
      } 

  }
/* second web service (capital city of country) */
  else if(page == '/second'){
    res.setHeader("Content-Type","application/json");
    if(!params.has('country')){
      res.end(`{"error":"country missing"}`);
    }
    else{
      let country = params.get('country');
      webServices.second(country,(result)=>{
        res.end(result);
      });
    } 
  }
  /* third web service (google search reslults)*/
  else if(page == '/third'){
    res.setHeader("Content-Type","application/json");
    if(!params.has('query')){
      res.end(`{"error":"query missing"}`);
    }
    else{
      let query = params.get('query');
      webServices.third(query,(result)=>{
        res.end(result);
      });
    } 
  }
  else if(page == '/metrics'){
    res.setHeader("Content-Type","application/json");
    res.write(webServices.metrics());
    res.end();
  }
  else{
    res.write('Page not found!');
    res.end();
  }
});

server.listen(config.server.port);