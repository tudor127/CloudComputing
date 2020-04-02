const fs = require('fs');

function showHomePage(){
    let pageStyle = fs.readFileSync('style/home-page.css',"utf-8");
    let pageJs = fs.readFileSync('js/home-page.js',"utf-8");

    return `
<!Doctype html>
<html>
    <head>
        <title>Home Page</title>
        <style type="text/css">
            ${pageStyle}
        </style>
        <meta charset="utf-8">
    </head>
    <body>
        <div class="main-container">
        
        <div class="left-box">
            <p>Type a word:</p>
            <input type="text" id="wordInput" autocomplete="off"/>
            <div class="result" id="firstResult"></div>
        </div>

        <div class="right-box">
            <p>Type a country</p>
            <input type="text" id="countryInput" autocomplete="off"/>
            <div class="result" id="secondResult"></div>
        </div>

        <div class="bottom-box">
            <p>Google Search:</p>
            <div class="search-box">
                <input type="text" id="searchInput" autocomplete="off"/>
                <button id="searchSubmit">Show Results</button>
            <div class="result" id="thirdResult"></div>
        </div>

        </div>
        <script type="text/javascript">
            ${pageJs}
        </script>
    </body>
</html>
    `;
}


module.exports.showHomePage = showHomePage; 