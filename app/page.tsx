import Link from "next/link";
import type { SanityDocument } from "next-sanity";
import { urlFor } from "@/utils/sanityImageUrl";

import { client } from "@/sanity/client";
import Image from "next/image";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt, image}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto max-w-7xl p-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 rounded-full border border-amber-400/30 mb-6">
            <span className="text-amber-400 text-sm font-medium tracking-wider uppercase">
              Premium Events
            </span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-6">
            Exclusive Access
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover premium events and exclusive experiences curated for
            discerning clientele
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article key={post._id} className="group">
              <Link href={`/blogs/${post.slug.current}`} className="block">
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl transition-all duration-500 hover:shadow-amber-500/20 hover:shadow-2xl hover:-translate-y-2 hover:border-amber-500/30">
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                      #{String(index + 1).padStart(3, "0")}
                    </div>
                  </div>

                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-900 rounded-full -ml-3 border-4 border-slate-700"></div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-900 rounded-full -mr-3 border-4 border-slate-700"></div>

                  {post.image && (
                    <div className="relative aspect-[16/10] overflow-hidden">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  )}

                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-4 line-clamp-2 group-hover:text-amber-400 transition-colors duration-300">
                      {post.title}
                    </h2>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-300">
                        <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4 text-slate-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">
                          {new Date(post.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <div className="text-amber-400 text-xs font-bold tracking-wider uppercase opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                        VIP Access
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg
                className="w-12 h-12 text-slate-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              No Premium Events Available
            </h3>
            <p className="text-gray-300 text-lg">
              Exclusive experiences are being curated. Check back soon for VIP
              access.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
