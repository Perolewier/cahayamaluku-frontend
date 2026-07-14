// src/app/berita/[id]/page.tsx

async function getPostDetail(id: string) {
  const BLOG_ID = "2049192292947520754";
  const API_KEY = "AIzaSyAqP9mopQoqPnu3P3jIrWXYDuNzWRfTzKI";

  const res = await fetch(
    `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/${id}?key=${API_KEY}`,
    { next: { revalidate: 1800 } }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function PostDetail(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const post = await getPostDetail(params.id);

  if (!post) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Artikel Tidak Ditemukan</h1>
        <a href="/" className="text-blue-700 font-bold hover:underline mt-4 inline-block">← Kembali ke Beranda</a>
      </main>
    );
  }

  const formattedDate = new Date(post.published).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans pb-16">
      {/* Top Banner Accent */}
      <div className="bg-blue-950 h-2 w-full"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Navigasi Back */}
        <a href="/" className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-blue-950 transition gap-1 mb-8">
          ← Kembali ke Beranda
        </a>

        <article className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-200/60">
          {/* Label Berita */}
          {post.labels && (
            <span className="inline-block bg-blue-50 text-blue-950 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-md mb-4">
              {post.labels[0]}
            </span>
          )}

          {/* Judul Utama */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-950 leading-tight tracking-tight mb-6">
            {post.title}
          </h1>

          {/* Meta Data Penulis */}
          <div className="flex items-center gap-3 border-y border-gray-100 py-4 mb-8 text-sm text-gray-500">
            <div className="w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center text-white font-bold text-base shadow-inner shadow-black/20">
              {post.author?.displayName?.charAt(0) || 'R'}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{post.author?.displayName || 'Redaksi'}</p>
              <p className="text-xs text-gray-400">{formattedDate} WIT</p>
            </div>
          </div>

          {/* ISI KONTEN UTAMA (Sangat rapi, berjarak, teks besar nyaman dibaca) */}
          <div 
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed tracking-normal
              [&>p]:mb-6 [&>p]:text-[17px] sm:[&>p]:text-[18px] [&>p]:leading-loose
              [&_img]:rounded-xl [&_img]:my-8 [&_img]:mx-auto [&_img]:shadow-sm [&_img]:max-w-full
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-950 [&_h2]:mt-8 [&_h2]:mb-4
              [&_a]:text-blue-700 [&_a]:underline font-serif"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </article>
      </div>
    </div>
  );
}