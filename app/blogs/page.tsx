import Link from "next/link";

export default async function BlogsListPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/blogs?userId=${process.env.LOLA_USER_ID}`, {
    cache: "no-store",
  });
  if (!res.ok) return <div>Error al cargar los blogs</div>;
  const { grouped } = await res.json();

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Blogs por Categoría</h1>
      {Object.entries(grouped).map(([category, blogs]) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <ul>
            {(blogs as any[]).map((blog) => (
              <li key={blog._id} className="mb-2">
                <Link href={`/blogs/${blog._id}`} className="text-blue-600 hover:underline">
                  {blog.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
