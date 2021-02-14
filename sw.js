// we'll version our cache (and learn how to delete caches in
// some other post)
const cacheName = 'v1::static';

self.addEventListener('install', e => {
  // once the SW is installed, go ahead and fetch the resources
  // to make this work offline
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',

        '/resources/css/fontawesome.all.min.css',
        '/resources/css/main_mobile.css',
        '/resources/css/robotomono.bold.regular.css',
 
        '/resources/fonts/fa-brands-400.eot',
        '/resources/fonts/fa-brands-400.svg',
        '/resources/fonts/fa-brands-400.ttf',
        '/resources/fonts/fa-brands-400.woff',
        '/resources/fonts/fa-brands-400.woff2',
        '/resources/fonts/fa-regular-400.eot',
        '/resources/fonts/fa-regular-400.svg',
        '/resources/fonts/fa-regular-400.ttf',
        '/resources/fonts/fa-regular-400.woff',
        '/resources/fonts/fa-regular-400.woff2',
        '/resources/fonts/fa-solid-900.eot',
        '/resources/fonts/fa-solid-900.svg',
        '/resources/fonts/fa-solid-900.ttf',
        '/resources/fonts/fa-solid-900.woff',
        '/resources/fonts/fa-solid-900.woff2',
        '/resources/fonts/robotomono-bold-webfont.ttf',
        '/resources/fonts/robotomono-bold-webfont.woff',
        '/resources/fonts/robotomono-bold-webfont.woff2',
        '/resources/fonts/robotomono-regular-webfont.ttf',
        '/resources/fonts/robotomono-regular-webfont.woff',
        '/resources/fonts/robotomono-regular-webfont.woff2',
 
        '/resources/img/favicon.png',
        '/resources/img/icon.png',
 
        '/resources/js/commands.js',
        '/resources/js/library.js',
        '/resources/js/webapp.js', 
 
        '/resources/sound/beep_accept.wav',
        '/resources/sound/beep_alert.wav',
        '/resources/sound/beep_error.wav',
        '/resources/sound/DarthGiveYourself.wav'

      ]).then(() => self.skipWaiting());
    })
  );
});

// when the browser fetches a url, either response with
// the cached object or go ahead and fetch the actual url
self.addEventListener('fetch', event => {
  event.respondWith(
    // ensure we check the *right* cache to match against
    caches.open(cacheName).then(cache => {
      return cache.match(event.request).then(res => {
        return res || fetch(event.request)
      });
    })
  );
});