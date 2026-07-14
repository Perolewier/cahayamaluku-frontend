// src/app/page.tsx

async function getPosts() {
  const BLOG_ID = "2049192292947520754";
  const API_KEY = "AIzaSyAqP9mopQoqPnu3P3jIrWXYDuNzWRfTzKI";
  
  const res = await fetch(
    `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}`,
    { next: { revalidate: 1800 } } // Cache 30 menit untuk performa ekstra
  );

  if (!res.ok) {
    throw new Error('Gagal mengambil data dari Blogger');
  }

  return res.json();
}

function getFirstImage(content: string) {
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop";
}

function formatTanggal(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export default async function Home() {
  const data = await getPosts();
  const posts = data.items || [];
  
  // Pisahkan berita utama (pertama) dan berita lainnya
  const headlinePost = posts[0];
  const otherPosts = posts.slice(1);

  // Kumpulkan semua label unik
  const allLabels: string[] = [];
  posts.forEach((post: any) => {
    if (post.labels) {
      post.labels.forEach((label: string) => {
        if (!allLabels.includes(label)) allLabels.push(label);
      });
    }
  });

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900 font-sans">
      {/* Top Bar Aksent */}
      <div className="bg-blue-950 h-2 w-full"></div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Branding */}
        <header className="text-center bg-white py-8 px-4 rounded-xl shadow-sm mb-6 border border-gray-200/60">
          <h1 className="text-4xl sm:text-5xl font-black text-blue-950 tracking-tight">
            <a href="/" className="hover:opacity-90 transition">CAHAYA MALUKU</a>
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base font-medium tracking-wide">
            — Portal Berita & Informasi Terpercaya Terkini —
          </p>
        </header>

        {/* Menu Kategori Navigasi */}
        <nav className="bg-white px-4 py-3 rounded-xl shadow-sm mb-8 border border-gray-200/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <a href="/" className="px-4 py-2 text-xs sm:text-sm font-bold rounded-lg bg-blue-950 text-white shadow-sm whitespace-nowrap">
            Semua Berita
          </a>
          {allLabels.map((label) => (
            <a 
              key={label}
              href={`/kategori/${encodeURIComponent(label)}`} 
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-950 border border-gray-200/50 transition whitespace-nowrap"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* SECTION 1: HERO / HEADLINE BANNER */}
        {headlinePost && (
          <section className="mb-10">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200/60 grid grid-cols-1 lg:grid-cols-12 gap-0 group">
              <div className="lg:col-span-7 aspect-[16/10] overflow-hidden bg-gray-100 relative">
                <a href={`/berita/${headlinePost.id}`}>
                  <img 
                    src={getFirstImage(headlinePost.content)} 
                    alt={headlinePost.title}
                    className="object-cover w-full h-full group-hover:scale-102 transition duration-500"
                  />
                </a>
                <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-md shadow-sm">
                  Topik Utama
                </span>
              </div>
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span className="font-bold text-blue-950 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                      {headlinePost.labels?.[0] || 'Berita'}
                    </span>
                    <span>•</span>
                    <span>{formatTanggal(headlinePost.published)}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-4 group-hover:text-blue-950 transition">
                    <a href={`/berita/${headlinePost.id}`}>{headlinePost.title}</a>
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base line-clamp-4 leading-relaxed">
                    {headlinePost.content.replace(/<[^>]*>/g, '').substring(0, 220)}...
                  </p>
                </div>
                <div className="pt-6 border-t border-gray-100 mt-6">
                  <a href={`/berita/${headlinePost.id}`} className="inline-flex items-center text-sm font-bold text-blue-950 hover:gap-2 transition-all gap-1">
                    Baca Selengkapnya <span className="text-lg">→</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: GRID BERITA LAINNYA */}
        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-3 h-6 bg-blue-950 rounded-sm inline-block"></span>
          Berita Terkini
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherPosts.map((post: any) => (
            <article key={post.id} className="bg-white border border-gray-200/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <a href={`/berita/${post.id}`}>
                    <img 
                      src={getFirstImage(post.content)} 
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-103 transition duration-500"
                      loading="lazy"
                    />
                  </a>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-2">
                    <span className="font-bold text-blue-950 uppercase tracking-wider">
                      {post.labels?.[0] || 'Berita'}
                    </span>
                    <span>•</span>
                    <span>{formatTanggal(post.published)}</span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-gray-900 line-clamp-2 leading-snug mb-2 group-hover:text-blue-950 transition">
                    <a href={`/berita/${post.id}`}>{post.title}</a>
                  </h4>
                  
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 110)}...
                  </p>
                </div>
              </div>
              
              <div className="px-5 pb-5 pt-3 border-t border-gray-50 bg-gray-50/50 text-right">
                <a href={`/berita/${post.id}`} className="text-xs font-bold text-blue-950 hover:underline">
                  Baca Selengkapnya →
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}