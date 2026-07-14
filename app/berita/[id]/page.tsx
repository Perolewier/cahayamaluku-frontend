// src/app/berita/[id]/page.tsx

async function getPostDetail(id: string) {
  const BLOG_ID = "2049192292947520754";
  const API_KEY = "AIzaSyAqP9mopQoqPnu3P3jIrWXYDuNzWRfTzKI";

  const res = await fetch(
    `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/${id}?key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

// Komponen Halaman Detail Berita
export default async function PostDetail(props: { params: Promise<{ id: string }> }) {
  // Menunggu resolusi params untuk mendapatkan ID berita dari URL
  const params = await props.params;
  const id = params.id;
  
  const post = await getPostDetail(id);

  // Jika berita tidak ditemukan atau API error
  if (!post) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Berita Tidak Ditemukan</h1>
        <p className="text-gray-500 mt-2">Maaf, artikel yang Anda cari tidak dapat dimuat.</p>
        <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">Kembali ke Beranda</a>
      </main>
    );
  }

  // Format tanggal terbit agar rapi
  const formattedDate = new Date(post.published).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 bg-white min-h-screen shadow-sm border-x border-gray-100">
      {/* Tombol Kembali */}
      <a href="/" className="text-blue-600 hover:underline text-sm font-semibold flex items-center mb-6">
        ← Kembali ke Beranda
      </a>

      <article>
        {/* Judul Berita */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 leading-tight mb-4">
          {post.title}
        </h1>

        {/* Info Penulis & Tanggal */}
        <div className="flex items-center text-gray-500 text-sm border-b pb-6 mb-8">
          <span className="font-medium text-gray-800">{post.author?.displayName || 'Redaksi'}</span>
          <span className="mx-2">•</span>
          <span>{formattedDate}</span>
        </div>

        {/* Isi Konten Berita (HTML dari Blogger) */}
        <div 
          className="prose prose-blue max-w-none text-gray-800 leading-relaxed space-y-4 text-lg
            [&_img]:rounded-lg [&_img]:my-6 [&_img]:mx-auto [&_p]:mb-4 [&_a]:text-blue-600 [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </article>
    </main>
  );
}