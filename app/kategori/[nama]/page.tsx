// src/app/kategori/[nama]/page.tsx

async function getPostsByCategory(categoryName: string) {
  const BLOG_ID = "2049192292947520754";
  const API_KEY = "AIzaSyAqP9mopQoqPnu3P3jIrWXYDuNzWRfTzKI";
  
  // Memanfaatkan parameter &labels dari Blogger API untuk filter data langsung dari server
  const res = await fetch(
    `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?labels=${categoryName}&key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

function getFirstImage(content: string) {
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop";
}

export default async function CategoryPage(props: { params: Promise<{ nama: string }> }) {
  const params = await props.params;
  // decodeURIComponent mengubah teks URL aman (misal: Berita%20Politik) menjadi teks normal (Berita Politik)
  const namaKategori = decodeURIComponent(params.nama);
  
  const data = await getPostsByCategory(namaKategori);
  const posts = data?.items || [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Header Portal Berita */}
      <header className="border-b-4 border-blue-900 pb-4 mb-6 text-center bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-4xl font-extrabold text-blue-900 tracking-wider">
          <a href="/">CAHAYA MALUKU</a>
        </h1>
        <p className="text-gray-500 mt-2 italic text-sm">Portal Berita dan Informasi Terpercaya</p>
      </header>

      {/* Penanda Kategori Terpilih */}
      <div className="mb-8 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-900">
        <h2 className="text-xl font-bold text-gray-800">
          Kategori: <span className="text-blue-900 uppercase">{namaKategori}</span>
        </h2>
        <a href="/" className="text-sm font-semibold text-blue-600 hover:underline">
          ← Kembali ke Semua Berita
        </a>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white text-center p-12 rounded-lg shadow-sm border">
          <p className="text-gray-500 text-lg">Belum ada berita di kategori ini.</p>
        </div>
      ) : (
        /* Grid Berita Berdasarkan Kategori */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => {
            const thumbnailUtama = getFirstImage(post.content);

            return (
              <article key={post.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
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
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      {namaKategori}
                    </span>
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
      )}
    </main>
  );
}