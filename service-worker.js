// Nama cache untuk aset statis
const CACHE_NAME = 'cloosed-belajarbahasa-hub-cache-v1';
// Daftar aset yang akan di-cache saat instalasi
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    // Tambahkan gambar ilustrasi utama Anda di sini
    '/images/Gemini_Generated_Image_4j7kjo4j7kjo4j7k.jpg',
    // Tambahkan ikon PWA Anda di sini setelah Anda membuatnya
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    // URL gambar bendera
    'https://flagcdn.com/w320/us.png',
    'https://flagcdn.com/w320/jp.png',
    'https://flagcdn.com/w320/kr.png',
    'https://flagcdn.com/w320/cn.png',
    'https://flagcdn.com/w320/de.png',
    'https://flagcdn.com/w320/es.png',
    // Tambahkan logo Anda di sini
    '/images/logo.png'
];

// Event: Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching assets');
                return cache.addAll(urlsToCache);
            })
    );
});

// Event: Fetch (mengelola permintaan jaringan)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Jika aset ditemukan di cache, kembalikan dari cache
                if (response) {
                    return response;
                }
                // Jika tidak, ambil dari jaringan
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Kloning respons karena stream respons hanya bisa dibaca sekali
                        const responseToCache = networkResponse.clone();
                        // Tambahkan respons ke cache untuk penggunaan di masa mendatang
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        return networkResponse;
                    })
                    .catch(() => {
                        // Jika offline dan aset tidak ada di cache, bisa mengembalikan halaman offline khusus
                        // return caches.match('/offline.html'); // Contoh: jika Anda punya halaman offline
                        console.log('Service Worker: Fetch failed, and no cache match.');
                        // Fallback to a generic offline message or image if no specific offline page
                        // For this example, we'll just let the browser handle the offline error
                    });
            })
    );
});

// Event: Activate (membersihkan cache lama)
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Hapus cache yang tidak ada dalam whitelist
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
