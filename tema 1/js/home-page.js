
let wordInput = document.getElementById('wordInput');
let countryInput = document.getElementById('countryInput');
let searchSubmit = document.getElementById('searchSubmit');
let searchInput = document.getElementById('searchInput');


wordInput.addEventListener("keyup",function(event){
    let word = wordInput.value;
    let result = document.getElementById('firstResult');
    if (event.keyCode === 13) {
        if(word.trim()!=""){
            getSynonym(word,function(res){
            result.innerHTML = `Synonym: <span id="synonym">${res}</span>`;
            updateSearchInput();
            });
        }
        else{
            result.innerHTML = "";
        }
    }
});

countryInput.addEventListener("keyup",function(event){
    let country = countryInput.value;
    let result = document.getElementById('secondResult');

    if (event.keyCode === 13) {
        event.preventDefault();
        if(country.trim()!=""){
            getCapital(country,function(res){
                if(res.trim()!="")
                    result.innerHTML = `Capital city: <span id="capital">${res}</span>`;
                else 
                    result.innerHTML = "";
                updateSearchInput();
            });
        }
        else{
            result.innerHTML = "";
        }
      }
});

searchSubmit.addEventListener("click",function(){
    let query = searchInput.value;
    let result = document.getElementById('thirdResult');
    if(query.trim()!=""){
        result.innerHTML = '<p id="resultsMessage">Loading results...</p>';
        getGoogleSearch(query,function(res){
            res = JSON.parse(res);
            document.getElementById('resultsMessage').innerHTML='Results:';
            for(r in res){
                result.innerHTML += `<a href="${res[r].url}" target="_blank" class="resultLink">${res[r].title}</a><br>
                                    <div class="snippet">${res[r].snippet}</div>`;
            }
        });
    }
    else{
        result.innerHTML = "";
    }
});

function getSynonym(word,callback){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange=function() {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.stringify(JSON.parse(this.responseText).synonym);
            return callback(res.split('"').join(''));
        }
    };
    xhttp.open("GET", "/first?word=" + word, true);
    xhttp.send();
}

function getCapital(country,callback){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange=function() {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(this.responseText);
            if(res.error){
                return callback("");
            }
            return callback(res.capital.split('"').join(''));
        }
    };
    xhttp.open("GET", "/second?country=" + country, true);
    xhttp.send();
}

function getGoogleSearch(query,callback){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange=function() {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(this.responseText);
            return callback(JSON.stringify(res));
        }
    };
    xhttp.open("GET", "/third?query=" + query, true);
    xhttp.send();
}

function updateSearchInput(){
    let synonym = document.getElementById('synonym');
    let capital = document.getElementById('capital');
    if(synonym && capital){
        searchInput.value=synonym.innerHTML+" "+capital.innerHTML;
    }
    else if(synonym){
        searchInput.value=synonym.innerHTML;
    }
    else if(capital){
        searchInput.value=capital.innerHTML;
    }
}

