import Link from "next/link";
import Image from "next/image";

import { client } from "@/sanity/client";
import { urlFor } from "@/utils/sanityImageUrl";

const AUTHOR_QUERY = `
*[_type == "author" && slug.current == $slug][0]{
  name,
  image,
  bio,
  "posts": *[_type == "post" && references(^._id)]{
    title,
    slug,
    publishedAt,
    image
  }
}`;

export default async function AuthorPage({
  params,
}: {
  params: { slug: string };
}) {
  const author = await client.fetch(AUTHOR_QUERY, { slug: params.slug });

  if (!author) return <p>Author not found</p>;

  return (
    <main className="container mx-auto max-w-3xl p-8">
      {/* Author header */}
      <div className="flex items-center gap-4 mb-8">
        {author.image && (
          <Image
            src={urlFor(author.image).width(100).height(100).url()}
            alt={author.name}
            width={100}
            height={100}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{author.name}</h1>
          {author.bio && (
            <p className="text-gray-600">{author.bio[0]?.children[0]?.text}</p>
          )}
        </div>
      </div>

      {/* Posts by author */}
      <h2 className="text-2xl font-semibold mb-4">Posts by {author.name}</h2>
      <ul className="flex flex-col gap-6">
        {author.posts.map((post) => (
          <li key={post._id}>
            <Link href={`/${post.slug.current}`} className="hover:underline">
              {post.image && (
                <Image
                  src={urlFor(post.image).width(800).height(300).url()}
                  alt={post.title}
                  width={800}
                  height={300}
                />
              )}
              <h3 className="text-xl font-semibold mt-2">{post.title}</h3>
              <p className="text-gray-500 text-sm">
                {new Date(post.publishedAt).toLocaleDateString()}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
