/** Builds a consistent head() meta block for a page. */
export function pageMeta(title: string, description: string) {
  const fullTitle = `${title} | RCM Analytics`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
