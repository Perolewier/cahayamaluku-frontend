// src/app/page.tsx

async function getPosts() {
  const BLOG_ID = "2049192292947520754";
  const API_KEY = "AIzaSyAqP9mopQoqPnu3P3jIrWXYDuNzWRfTzKI";
  
  const res = await fetch(
    `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error('Gagal mengambil data dari Blogger');
  }

  return res.json();
}

function getFirstImage(content: string) {
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop";
}

export default async function Home() {
  const data = await getPosts();
  const posts = data.items || [];

  // 🛠️ Mengumpulkan semua label unik dari seluruh artikel untuk dijadikan menu
  const allLabels: string[] = [];
  posts.forEach((post: any) => {
    if (post.labels) {
      post.labels.forEach((label: string) => {
        if (!allLabels.includes(label)) {
          allLabels.push(label);
        }
      });
    }
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Header Portal Berita */}
      <header className="border-b-4 border-blue-900 pb-4 mb-6 text-center bg-white p-6 rounded-t-lg shadow-sm">
        <h1 className="text-4xl font-extrabold text-blue-900 tracking-wider">
          <a href="/">CAHAYA MALUKU</a>
        </h1>
        <p className="text-gray-500 mt-2 italic text-sm">Portal Berita dan Informasi Terpercaya</p>
      </header>

      {/* 🛠️ MENU NAVIGASI KATEGORI OTOMATIS */}
      <nav className="bg-white px-6 py-3 rounded-b-lg shadow-sm mb-8 border-t border-gray-100 overflow-x-auto flex gap-2">
        <a 
          href="/" 
          className="px-4 py-2 text-sm font-semibold rounded-md bg-blue-900 text-white transition whitespace-nowrap"
        >
          Semua Berita
        </a>
        {allLabels.map((label) => (
          <a 
            key={label}
            href={`/kategori/${encodeURIComponent(label)}`} 
            className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-900 transition whitespace-nowrap"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Grid Berita Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: any) => {
          const thumbnailUtama = getFirstImage(post.content);

          return (
            <article key={post.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                {/* Gambar Utama */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                  <a href={`/berita/${post.id}`}>
                    <img 
                      src={thumbnailUtama} 
                      alt={post.title}
                      className="object-cover w-full h-full hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                  </a>
                </div>

                <div className="p-5">
                  {/* Menampilkan label pertama jika artikel memiliki label */}
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    {post.labels && post.labels.length > 0 ? post.labels[0] : 'Berita'}
                  </span>
                  
                  {/* Judul berita */}
                  <h2 className="text-xl font-bold mt-2 mb-3 text-gray-800 line-clamp-2 hover:text-blue-900 transition">
                    <a href={`/berita/${post.id}`}>
                      {post.title}
                    </a>
                  </h2>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                  </p>
                </div>
              </div>
              
              {/* Tombol Baca Selengkapnya */}
              <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50 text-right">
                <a 
                  href={`/berita/${post.id}`} 
                  className="text-blue-600 font-semibold text-sm hover:underline"
                >
                  Baca Selengkapnya →
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}