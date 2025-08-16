import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    await params,
    options
  );
  const postImageUrl = post.image
    ? urlFor(post.image)?.width(800).height(400).url()
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="border-b border-amber-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors duration-300 font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Events
          </Link>
        </div>
      </div>

      <main className="container mx-auto max-w-4xl px-6 py-12">
        <article className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-amber-500/20 shadow-2xl overflow-hidden">
          {postImageUrl && (
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10" />
              <Image
                src={postImageUrl || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-80 object-cover"
                width="800"
                height="400"
              />
              <div className="absolute top-6 right-6 z-20">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  PREMIUM EVENT
                </div>
              </div>
            </div>
          )}

          <div className="p-8 lg:p-12">
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" />
            </div>

            <div className="mb-8 p-6 bg-slate-800/50 rounded-xl border border-amber-500/10">
              <div className="flex items-center gap-4 text-amber-400">
                <svg
                  className="w-5 h-5"
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
                <span className="font-medium">
                  Event Date:{" "}
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="prose prose-lg prose-invert prose-amber max-w-none">
              <div className="text-slate-300 leading-relaxed">
                {Array.isArray(post.body) && <PortableText value={post.body} />}
              </div>
            </div>
          </div>

          <div className="h-4 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent relative">
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="flex gap-2">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 bg-amber-500/40 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
