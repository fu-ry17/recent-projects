/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};


self.addEventListener('push', function (event) {
  const data = JSON.parse(event.data.text());
  event.waitUntil(registration.showNotification(data.title, {
    body: data.message,
    icon: 'https://res.cloudinary.com/duzm9in6w/image/upload/v1665596907/blog/IMG-20221007-WA0002_t3mefa.jpg',
    badge: 'https://res.cloudinary.com/duzm9in6w/image/upload/v1678652742/blog/icon-192x192-removebg-preview_tzjt85.png',
    actions: [{
      action: 'view-action',
      title: 'view'
    }, {
      action: 'close-action',
      title: 'close'
    }]
  }));
});
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then(function (clientList) {
    if (clientList.length > 0) {
      let client = clientList[0];
      for (let i = 0; i < clientList.length; i++) {
        if (clientList[i].focused) {
          client = clientList[i];
        }
      }
      return client.focus();
    }
    return clients.openWindow('/');
  }));
});
/******/ })()
;