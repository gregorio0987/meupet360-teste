const CACHE = 'meupet360-notify-v2';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event =>
  event.waitUntil(self.clients.claim())
);

self.addEventListener('push', event => {
  let data = {
    title: '🐾 MeuPet 360',
    body: 'Você tem um novo lembrete do seu pet.',
    url: './'
  };

  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch (_) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body || '',
    icon: './icon-192.png',
    badge: './badge-96.png',
    tag: data.tag || 'meupet360-reminder',
    renotify: true,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || './'
    }
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || '🐾 MeuPet 360',
      options
    )
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || './',
    self.registration.scope
  ).href;

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(windowClients => {

      for (const client of windowClients) {
        if ('navigate' in client && 'focus' in client) {
          return client.navigate(targetUrl)
            .then(() => client.focus());
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
