const STATIC_CACHE = 'pokedex-static-v1';
const DYNAMIC_CACHE = 'pokedex-dynamic-v1';

// APP SHELL real del proyecto
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// --------------------
// INSTALACIÓN
// --------------------
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(APP_SHELL);
    })
  );

  // Activar el nuevo SW automáticamente
  self.skipWaiting();
});

// --------------------
// ACTIVACIÓN
// --------------------
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// --------------------
// FETCH (CACHE DINÁMICO + OFFLINE)
// --------------------
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedRes => {
      if (cachedRes) {
        return cachedRes; // Cargar desde cache
      }

      return fetch(event.request)
        .then(networkRes => {
          return caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(event.request, networkRes.clone());
            return networkRes;
          });
        })
        .catch(() => {
          // devolver una vista offline si quieres
        });
    })
  );
});



/*self.addEventListener('fetch',(event)=>{
    if(event.request.method==='GET'){
        const resp=fetch(event.request)
        .then((response)=>{
            caches.match(event.request) 
            .then(cache=>{
                if(cache==undefined){
                    caches.open('dynamic-v1.0')
                    .then(cacheDyn=>{
                        cacheDyn.put(event.request,respuesta);
                    });

                }
            });
            return response.clone();
        })
        .catch(err=>{
            //cuando no hay conexion
            return caches.match(event.request);
        });
        event.respondWith(resp);

    }

});*/

