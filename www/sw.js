/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "build/app.js",
    "revision": "3f8780f4571129a6e7f57b9b2a44af61"
  },
  {
    "url": "build/app/app.bhwurwm0.js",
    "revision": "6c75aeaf03342ada6d62a36bba9ffe6a"
  },
  {
    "url": "build/app/app.lntph5ll.js",
    "revision": "2cd4cf1f994ba419a505dee7a0eaba97"
  },
  {
    "url": "build/app/datkf489.entry.js",
    "revision": "75a4e4178f3db98c569f50e7fa9766b7"
  },
  {
    "url": "build/app/datkf489.sc.entry.js",
    "revision": "75a4e4178f3db98c569f50e7fa9766b7"
  },
  {
    "url": "index.html",
    "revision": "f7ad59747cc9f2c9f416aca40fabab60"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
