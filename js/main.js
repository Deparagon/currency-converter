if (navigator.serviceWorker){
if(navigator.serviceWorker.register('sw.js' )){	
}
} 
else{
	console.log('No service worker support');
}


