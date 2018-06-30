// Declarations
const baseUrl= 'https://free.currencyconverterapi.com/api/v5/';
const curUrl  =`${baseUrl}currencies`;
const conUrl =`${baseUrl}convert`;
const listFrom = document.getElementById('listCurrencyFrom');
const listTo = document.getElementById('listCurrencyTo');
const cFrom = document.getElementById('convertFrom');
const cTo = document.getElementById('convertTo');
const reportDiv = document.getElementById('reportdata');
const getData =function(url) {
  return fetch(url)
  .then(response => response.json()) 
}
const roundAmount = (n)=>parseFloat(n).toFixed(2);

const storeCur = function(data, key){
let DBOpenRequest = indexedDB.open("CurConverterDb", 1);
DBOpenRequest.onsuccess = function(event) {
db = DBOpenRequest.result;
let tx = db.transaction("curPair", "readwrite");
let store = tx.objectStore("curPair");
store.put(data, key)
tx.oncomplete = function() {
}; 
}
}

const listenNcall =function(){
  if(listTo.value.length >0){
        if(cFrom.value.length >0){
         convertCurrency(cFrom.value, listFrom.value, listTo.value);
        }
       }
}

const runLiveConversion = function(url, query, amount)
{
     let request = getData(url);
      request.then(function(response){
      storeCur(response, query);  
    let converted= parseFloat(amount*(response[Object.keys(response)[0]])).toFixed(2);
    cTo.value = converted;
    reportDiv.innerHTML = `<p class="result-f">${roundAmount(amount)} ${listFrom.options[listFrom.selectedIndex].text} equals <span class="result-t"> ${converted} ${listTo.options[listTo.selectedIndex].text} </p>`;
    
      }) 
}


function convertCurrency(amount, fromCurrency, toCurrency) {
  fromCurrency = encodeURIComponent(fromCurrency);
  toCurrency = encodeURIComponent(toCurrency);
  let query = `${fromCurrency}_${toCurrency}`;
  let url = `${conUrl}?q=${query}&compact=ultra`;


    let DBOpenRequest = indexedDB.open("CurConverterDb", 1);
    DBOpenRequest.onsuccess = function(e) {
    db = DBOpenRequest.result;
    let transaction = db.transaction("curPair", "readwrite");
    let objectStore = transaction.objectStore("curPair");
    let objectStoreRequest = objectStore.get(query);
    objectStoreRequest.onsuccess = function(e) {
    let convertedValues = objectStoreRequest.result;
     
     if(convertedValues){
       console.log(convertedValues);
        let converted= parseFloat(amount*(convertedValues[Object.keys(convertedValues)[0]])).toFixed(2);
        cTo.value = converted;
        reportDiv.innerHTML = `<p class="result-f">${roundAmount(amount)} ${listFrom.options[listFrom.selectedIndex].text} equals <span class="result-t"> ${converted} ${listTo.options[listTo.selectedIndex].text} </p>`;
      return true;
     }
   
     }
     }

    runLiveConversion(url, query, amount); 
  }

// events
window.addEventListener('load',function(){
  let request = getData(curUrl);
   request.then(function(response){
    let currencies = response.results;
    let options = '';
     for (const cur in currencies ){
      options+=`<option value="${cur}">${currencies[cur].currencyName}</option>`;  
     }
     listTo.innerHTML =options;
     listFrom.innerHTML= options;
     return true;
  });
     
     
});

cFrom.addEventListener('change', function(){
  listenNcall();
});
listFrom.addEventListener('change', function(){
   listenNcall();
});

listTo.addEventListener('change', function(ev){
  listenNcall();     
});





