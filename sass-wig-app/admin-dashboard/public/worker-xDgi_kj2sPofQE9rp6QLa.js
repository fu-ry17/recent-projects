(()=>{"use strict";self.addEventListener("push",(function(t){const i=JSON.parse(t.data.text());t.waitUntil(registration.showNotification(i.title,{body:i.message,icon:"https://res.cloudinary.com/duzm9in6w/image/upload/v1665596907/blog/IMG-20221007-WA0002_t3mefa.jpg",badge:"https://res.cloudinary.com/duzm9in6w/image/upload/v1678652742/blog/icon-192x192-removebg-preview_tzjt85.png",actions:[{action:"view-action",title:"view"},{action:"close-action",title:"close"}]}))})),self.addEventListener("notificationclick",(function(t){t.notification.close(),t.waitUntil(clients.matchAll({type:"window",includeUncontrolled:!0}).then((function(t){if(t.length>0){let i=t[0];for(let e=0;e<t.length;e++)t[e].focused&&(i=t[e]);return i.focus()}return clients.openWindow("/")})))}))})();