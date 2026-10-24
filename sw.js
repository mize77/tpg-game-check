// Game Check service worker: app shell offline, fresh code when online.
const CACHE="gc-055e373446";
const SHELL=["./","index.html","manifest.webmanifest","vendor/supabase.js","vendor/591.supabase.js","vendor/jspdf.umd.min.js","vendor/pdf.min.js","vendor/pdf.worker.min.js","icons/logo.png","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/favicon-32.png"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET") return;
  const u=new URL(r.url); if(u.origin!==location.origin) return;           // Supabase, fonts, video links: straight to the network
  const isPage=r.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith(".html");
  if(isPage){ e.respondWith(fetch(r).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put("index.html",cp)); return res; }).catch(()=>caches.match("index.html"))); return; }
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{ if(res.ok){ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(r,cp)); } return res; })));
});
