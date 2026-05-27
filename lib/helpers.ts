export function buildSearchParams({
  conceptIds = [],
  domain,
  page = 1,
}: {
  conceptIds?: string[];
  domain?: string | null;
  page?: number;
}) {
  const params = new URLSearchParams();

  // Set domain
  if (domain && domain !== "All") {
    params.set("domain", domain);
  }

  // Sort and add unique conceptIds
  [...new Set(conceptIds)]
    .map(String)
    .sort()
    .forEach((id) => params.append("conceptId", id));

  // Set page
  params.set("page", String(page));

  return params.toString();
}