const baseContentCache = 'converter-base-v5';
const currenciesCache = 'converter-currencies-v5';
const conversionCache = 'converter-convert-v5';
conCaches =[
baseContentCache,
currenciesCache,
conversionCache
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
  //console.log('originurl='+objurl.origin);
  //console.log('location url='+location.origin);
  console.log(objurl.pathname);  
    if(objurl.origin === location.origin){  
         event.respondWith(
    caches.open(baseContentCache).then(function(cache) {
      return fetch(event.request).then(function(response) {
        return response;
      });
    })
  );
    }


    if(objurl.pathname.endsWith('currencies')){	
    event.respondWith(
    caches.open(currenciesCache).then(function(cache) {
      return fetch(event.request).then(function(response) {
        cache.put(event.request, response.clone());
        return response;
      });
    })
  );
    }
  
   // let arurl = requestUrl.split('?');
   // if(arurl[0] == conUrl){
   //    event.respondWith(
   //     caches.open(conversionCache).then(function(cache) {
   //    return fetch(event.request).then(function(response) {
   //      cache.put(event.request, response.clone());
   //      return response;
   //    });
   //  })
   //    	)
   // }
   
});


self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('converter-') &&
                 !conCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});