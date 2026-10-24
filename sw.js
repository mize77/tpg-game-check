// Game Check service worker: app shell offline; libraries cached once, the app file refreshed on update.
const APP="gc-app-e2e71dac78", LIB="gc-lib-1";
const LIBS=["vendor/supabase.js","vendor/591.supabase.js","vendor/jspdf.umd.min.js","vendor/pdf.min.js","vendor/pdf.worker.min.js","icons/logo.png","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/favicon-32.png"];
self.addEventListener("install",e=>{ e.waitUntil(Promise.all([
  caches.open(APP).then(c=>c.addAll(["./","manifest.webmanifest"])),
  caches.open(LIB).then(async c=>{ for(const u of LIBS){ if(!(await c.match(u))) await c.add(u); } })
]).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==APP&&k!==LIB).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET") return;
  const u=new URL(r.url); if(u.origin!==location.origin) return;
  const isPage=r.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith(".html");
  if(isPage){ e.respondWith(fetch(r).then(res=>{ const cp=res.clone(); caches.open(APP).then(c=>c.put("./",cp)); return res; }).catch(()=>caches.match("./"))); return; }
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{ if(res.ok){ const cp=res.clone(); caches.open(/\/(vendor|icons)\//.test(u.pathname)?LIB:APP).then(c=>c.put(r,cp)); } return res; })));
});
