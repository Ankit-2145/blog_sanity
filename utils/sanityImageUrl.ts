import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/client"; // your configured Sanity client

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}
