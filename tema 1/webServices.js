const http = require("https");
const config = require('./config.json');
const fs = require('fs');

function first(word,callback){
    let start_time = new Date().getTime();//for measuring the response time
    let options = {
        "method": "GET",
        "hostname": config.firstApi.host,
        "port": null,
        "path": `/words/${word}/synonyms`,
        "headers": {
            "x-rapidapi-host": config.firstApi.host,
            "x-rapidapi-key": config.firstApi.key
        }
    };
    let req = http.request(options, function (res) {
        let chunks = [];
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            let currentDate = new Date();
            let responseTime = new Date().getTime() - start_time; 
            let url = config.firstApi.host+'/words/'+word+'/synonyms';
            let status = res.statusCode;

            let body = Buffer.concat(chunks);
            let result = body.toString();

            logInformation(currentDate,url,"GET",status,responseTime);
            if(JSON.parse(result).message){
                return callback(`{"synonym":""}`)
            }
            else{
                result = result.replace('[','');
                result = result.replace(']','');
                result = result.split('"').join('');
                result = result.split(',')[0];
                return callback(`{"synonym":"${result}"}`);
            }
        });
    });
    req.end();
}

function second(country,callback){
    country = escape(country);
    let start_time = new Date().getTime();//for measuring the response time
    let options = {
        "method": "GET",
        "hostname": config.secondApi.host,
        "port": null,
        "path": `/name/${country}`,
        "headers": {
            "x-rapidapi-host": config.secondApi.host,
            "x-rapidapi-key": config.secondApi.key
        }
    };
    let req = http.request(options, function (res) {
        let chunks = [];
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            let currentDate = new Date();
            let responseTime = new Date().getTime() - start_time; 
            let url = config.secondApi.host+'/name/'+country;
            let status = res.statusCode;

            let body = Buffer.concat(chunks);
            let result = body.toString();
            result = JSON.parse(result);

            logInformation(currentDate,url,"GET",status,responseTime);
            if(result.status){
                result = `{"error":"country not found"}`;
            }
            else{
                result = result[0].capital;
                result = `{"capital":"${result}"}`;
            }
            return callback(result);
        });
    });
    req.end();
}

function third(query,callback){
    let start_time = new Date().getTime();//for measuring the response time
    query = escape(query);
    let options = {
        "method": "GET",
        "hostname": config.thirdApi.host,
        "port": null,
        "path": `/google-search?q=${query}&hl=en&gl=us`,
        "headers": {
            "x-rapidapi-host": config.thirdApi.host,
            "x-rapidapi-key": config.thirdApi.key
        }
    };

    let req = http.request(options, function (res) {
        let chunks = [];
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            let currentDate = new Date();
            let responseTime = new Date().getTime() - start_time; 
            let url = config.thirdApi.host+'/google-search?q='+query+'&hl=en&gl=us';
            let status = res.statusCode;

            let body = Buffer.concat(chunks);
            let result = body.toString();
            result = JSON.parse(result);

            logInformation(currentDate,url,"GET",status,responseTime);
            return callback(JSON.stringify(result.organic));
        });
    });
    req.end();
}

function metrics(){
    let file = fs.readFileSync("requests_log.txt","utf-8");
    file = "["+file.substring(0, file.length - 2)+"]";
    let requests = JSON.parse(file);
    let totalRequests = 0;
    let averageResponseTime = 0;
    let totalTime = 0;
    let status200 = 0;
    let status400 = 0;
    for(let i=0;i<requests.length;i++){
        let request = requests[i];

        if(parseInt(request['Status Code']) >= 200 && parseInt(request['Status Code'])<300){
            status200++;
        }
        else if(parseInt(request['Status Code']) >= 400 && parseInt(request['Status Code'])<500){
            status400++;
        }
        respTime = request['Response Time'].replace("ms","");
        totalTime += parseInt(respTime);
        totalRequests++;
    }

    averageResponseTime = parseInt(totalTime/totalRequests);

    let metrics = `{"totalRequests":"${totalRequests}","status200":"${status200}","status400":"${status400}","averageResponseTime":"${averageResponseTime}ms"}`;
    return metrics;
}

/* log information about request */
function logInformation(date,url,method,status,time){
    let text = "";
    text +=`  {\n`;    
    text +=`    "Date":"${date}",\n`; 
    text +=`    "Request URL": "${url}",\n`;
    text +=`    "Request Method": "${method}",\n`;
    text +=`    "Status Code": "${status}",\n`;
    text +=`    "Response Time": "${time}ms"\n`;
    text +=`  },\n`;
    fs.appendFile('requests_log.txt',text, function (err) {
        if (err) throw err;
    });
}

module.exports.first = first;
module.exports.second = second;
module.exports.third = third;
module.exports.metrics = metrics;