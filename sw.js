const convertUrl = 'https://free.currencyconverterapi.com/api/v5/convert';
const baseContentCache = 'converter-base-v1';
const currenciesCache = 'converter-currencies-v1';
conCaches =[
baseContentCache,
currenciesCache,
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(baseContentCache).then(function(cache) {
      return cache.addAll([
        './dist/css/bootstrap.min.css',
        './css/style.css',
        './images/favicon.png',
        './js/jquery.js',
        './dist/js/bootstrap.min.js',
        './js/main.js',
        './js/calls.js',
        'index.html',
      ]);
    })
  );
});


self.addEventListener('fetch', function(event) {
  const objurl =  new URL(event.request.url);
    if(objurl.pathname.endsWith('/') ){  
         event.respondWith(
    caches.open(baseContentCache).then(function(cache) {
       return cache.match('index.html').then(function(response){
          if(response){  
            return response;
          }
       return fetch(event.request).then(function(response){
             cache.put(event.request, response.clone());
              return response;
          });
       })
    })
  );
    }

    if(objurl.pathname.startsWith('/currency-converter/')){  
         event.respondWith(
    caches.open(baseContentCache).then(function(cache) {
       return cache.match(event.request).then(function(response){
          if(response){
          
            return response;
          }
       return fetch(event.request).then(function(response){
             cache.put(event.request, response.clone());
              return response;
          });
       })
    })
  );
    }



    if(objurl.pathname.endsWith('currencies')){	
    event.respondWith(
    caches.open(currenciesCache).then(function(cache) {
      return cache.match('/api/v5/currencies').then(function(response){
         
       return response || fetch(event.request).then(function(resp) {
        cache.put(event.request, resp.clone());
        return resp;
      });

        
      })
     
    })
  );
    }
  
   let arurl = event.request.url.split('?');
   if(arurl[0] == convertUrl){
    
    let q = getParamName('q', arurl[1]);
    let DBOpenRequest = indexedDB.open("CurConverterDb", 1);
    DBOpenRequest.onsuccess = function(e) {
    db = DBOpenRequest.result;
    let transaction = db.transaction("curPair", "readwrite");
    let objectStore = transaction.objectStore("curPair");
    let objectStoreRequest = objectStore.get(q);
    objectStoreRequest.onsuccess = function(e) {
    let convertedValues = objectStoreRequest.result;
    
     if(convertedValues){
      console.log(convertedValues);
            return new Response(objectStoreRequest.result);
     }
   }
 }
      event.respondWith(
         fetch(event.request).then(function(response){
           // console.log(response);
            return response;
          })
         )
      
   }
   
});


self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      let delCal = Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('converter-') &&
                 !conCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })

      );

        dbCreator();
        return delCal;
    })

  );
});



const dbCreator = function(){
let request = indexedDB.open("CurConverterDb");
request.onupgradeneeded = function() {
let db = request.result;
let store = db.createObjectStore("curPair");
};

request.onsuccess = function() {
  db = request.result;
};

}






const getCurConversion = function (curIDs) {
let DBOpenRequest = indexedDB.open("CurConverterDb", 1);
DBOpenRequest.onsuccess = function(event) {
db = DBOpenRequest.result;
let transaction = db.transaction("curPair", "readwrite");
  let objectStore = transaction.objectStore("curPair");
  let objectStoreRequest = objectStore.get(curIDs);
  objectStoreRequest.onsuccess = function(event) {
    let convertedValues = objectStoreRequest.result;
    return convertedValues;
  };

};
  
};
// 
const getParamName = function (name, url){ 
   let args = url.split('&');
   let f = args[0].split('=');
   return f[1];
}