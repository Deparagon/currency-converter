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

const listenNcall =function(){
  if(listTo.value.length >0){
        if(cFrom.value.length >0){
         convertCurrency(cFrom.value, listFrom.value, listTo.value);
        }
       }
}

function convertCurrency(amount, fromCurrency, toCurrency) {
  fromCurrency = encodeURIComponent(fromCurrency);
  toCurrency = encodeURIComponent(toCurrency);
  let query = fromCurrency + '_' + toCurrency;
  let url = `${conUrl}?q=${query}&compact=ultra`;

  let request = getData(url);
      request.then(function(response){
        console.log(response);
        const{query} = response;
        console.log(query);
  let converted= parseFloat(amount*(response[Object.keys(response)[0]]));
    cTo.value = converted;

    reportDiv.innerHTML = `${amount} ${fromCurrency} equals ${converted} ${toCurrency}`;
    
      })   
}

// events
window.addEventListener('load',function(){
  let request = getData(curUrl);
   request.then(function(response){
    let currencies = response.results;
    let options = '';
     for (const cur in currencies ){
      options+=`<option value="${cur}">${currencies[cur].currencyName} |${currencies[cur].currencySymbol} </option>`;  
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





