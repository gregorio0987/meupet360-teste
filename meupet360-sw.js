const CACHE='meupet360-notify-v1';

self.addEventListener('install',()=>self.skipWaiting());

self.addEventListener('activate',event=>
  event.waitUntil(self.clients.claim())
);

self.addEventListener('push',event=>{
  let data={
    title:'🐾 MeuPet 360',
    body:'Você tem um novo lembrete do seu pet.',
    url:'./'
  };

  try{
    if(event.data)data={...data,...event.data.json()}
  }catch(_){
    if(event.data)data.body=event.data.text()
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title||'🐾 MeuPet 360',
      {
        body:data.body||'',
        tag:data.tag||'meupet360-reminder',
        data:{url:data.url||'./'}
      }
    )
  );
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();

  const url=event.notification.data?.url||'./';

  event.waitUntil(
    clients.matchAll({
      type:'window',
      includeUncontrolled:true
    }).then(list=>{
      for(const c of list){
        if('focus' in c){
          c.navigate(url);
          return c.focus();
        }
      }

      return clients.openWindow
        ? clients.openWindow(url)
        : undefined;
    })
  );
});
