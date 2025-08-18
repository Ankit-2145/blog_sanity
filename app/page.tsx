import Link from "next/link";
import type { SanityDocument } from "next-sanity";
import { urlFor } from "@/utils/sanityImageUrl";

import { client } from "@/sanity-client/client";
import Image from "next/image";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt, image, description,  author->{
    name,
    slug,
    image,
    bio
  }}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Thoughts, ideas, and insights on web development and technology
          </p>
        </header>

        {/* Blog Posts */}
        <div className="grid grid-cols-2 gap-4 space-y-12">
          {posts.map((post) => (
            <article key={post._id} className="group">
              <Link href={`/blogs/${post.slug.current}`} className="block">
                <div className="border-b border-gray-100 pb-12 transition-all duration-200 hover:border-gray-200">
                  <div className="grid md:grid-cols-3 gap-8 items-start">
                    {/* Image */}
                    {post.image && (
                      <div className="md:col-span-1">
                        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={
                              urlFor(post.image)
                                .width(800)
                                .height(500)
                                .quality(80)
                                .auto("format")
                                .url() || "/placeholder.svg"
                            }
                            alt={post.title}
                            width={800}
                            height={500}
                            className="object-cover w-full h-full transition-all duration-500 group-hover:scale-110"
                          />
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="md:col-span-2">
                      <time className="text-sm text-gray-500 font-medium">
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </time>

                      <h2 className="text-lg font-semibold text-gray-900 mt-2 mb-3 group-hover:text-gray-700 transition-colors duration-200">
                        {post.title}
                      </h2>
                      <p className="text-black">{post.description}</p>

                      <div className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                        <span className="text-sm font-medium">Read more</span>
                        <svg
                          className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                      {post.author && (
                        <div className="flex items-center gap-2 mt-2">
                          {post.author.image && (
                            <Image
                              src={urlFor(post.author.image)
                                .width(10)
                                .height(10)
                                .url()}
                              alt={post.author.name}
                              width={10}
                              height={10}
                              className="rounded-full"
                            />
                          )}
                          <Link
                            href={`/author/${post.author.slug.current}`}
                            className="text-sm text-gray-600 hover:underline"
                          >
                            By {post.author.name}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600">Check back soon for new content.</p>
          </div>
        )}
      </div>
    </main>
  );
}
