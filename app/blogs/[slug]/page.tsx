import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";

/**
 * GraphQL query to fetch a single blog post by slug
 * Returns the first matching post document from Sanity CMS
 */
const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

/**
 * Configure Sanity image URL builder with project credentials
 * Used to generate optimized image URLs from Sanity image references
 */
const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

/**
 * Next.js fetch options with ISR (Incremental Static Regeneration)
 * Revalidates content every 30 seconds for fresh blog posts
 */
const options = { next: { revalidate: 30 } };

/**
 * Blog Post Page Component
 * Renders a single blog post with clean, readable layout focused on content consumption
 */
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  /**
   * Fetch blog post data from Sanity CMS
   * Uses the slug parameter to find the specific post
   */
  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    await params,
    options
  );

  /**
   * Generate optimized image URL for the blog post hero image
   * Resizes to 1200x600 for better performance and consistent aspect ratio
   */
  const postImageUrl = post.image
    ? urlFor(post.image)?.width(1200).height(600).url()
    : null;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
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
            Back to Posts
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <article>
          {postImageUrl && (
            <div className="mb-12">
              <Image
                src={postImageUrl || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-80 object-cover rounded-lg"
                width={800}
                height={400}
                priority
              />
            </div>
          )}

          <header className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {post.publishedAt && (
              <div className="flex items-center gap-2 text-gray-500">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                </svg>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            )}
          </header>

          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 hover:prose-a:text-blue-800">
            {Array.isArray(post.body) ? (
              <PortableText value={post.body} />
            ) : (
              <div className="text-gray-700 leading-relaxed">
                <p>
                  This is where your blog post content would go. The minimal
                  design focuses on readability with clean typography and
                  generous white space.
                </p>
                <p>
                  You can replace this with your actual blog content, whether
                  its from a CMS like Sanity or static markdown files.
                </p>
              </div>
            )}
          </div>
        </article>

        <footer className="mt-16 pt-8 border-t border-gray-100">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
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
            Return to all posts
          </Link>
        </footer>
      </main>
    </div>
  );
}
