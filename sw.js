const C='ytp-v25',F=['./','./index.html','./manifest.webmanifest','./icon.svg','./favicon.svg','./favicon.ico','./icon-192.png','./icon-256.png','./icon-384.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
const SDK=u=>u.hostname==='www.gstatic.com'&&u.pathname.startsWith('/firebasejs/');
const ok=u=>u.origin===location.origin||SDK(u);
const put=(r,x)=>{if(x&&x.ok){const y=x.clone();caches.open(C).then(c=>c.put(r,y))}return x};
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(!ok(u))return;
 // Firebase SDK files have a fixed version in the URL -> never change -> serve from cache instantly
 if(SDK(u)){e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>put(r,x))));return}
 // app files: open the saved copy instantly, refresh it in the background (new version shows on next open)
 const nav=r.mode==='navigate';
 e.respondWith(caches.match(r,{ignoreSearch:nav}).then(h=>{
  const n=fetch(nav?r.url:r,nav?{cache:'no-cache'}:undefined).then(x=>put(r,x)).catch(()=>h||(nav?caches.match('./index.html'):undefined));
  if(h){e.waitUntil(n.catch(()=>{}));return h}
  return n}))});
