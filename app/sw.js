/* NCITIS’26 app service worker: offline shell, cached documents and fonts.
   Bump VERSION whenever index.html, app.css, app.js or data.js change. */
var VERSION = "ncitis26-app-v1";
var SHELL = [
  "./",
  "./index.html",
  "./app.css",
  "./app.js",
  "./data.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png",
  "../assets/logo-univ-batna2.png",
  "../assets/logo-faculte-mi.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(VERSION).then(function (cache) { return cache.addAll(SHELL); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function putInCache(request, response) {
  if (response && (response.ok || response.type === "opaque")) {
    var copy = response.clone();
    caches.open(VERSION).then(function (cache) { cache.put(request, copy); });
  }
  return response;
}

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);

  // Pages: network first, then the cached app shell
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then(function (res) { return putInCache(req, res); }).catch(function () {
        return caches.match(req, { ignoreSearch: true }).then(function (hit) { return hit || caches.match("./index.html"); });
      })
    );
    return;
  }

  // Google Fonts: cache first
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) { return putInCache(req, res); });
    }));
    return;
  }

  // Same-origin files (app, logos, PDF, template, form): stale while revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(req, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(req).then(function (res) { return putInCache(req, res); }).catch(function () { return hit; });
      return hit || net;
    }));
  }
});
