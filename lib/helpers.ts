export function buildSearchParams({
  ids = [],
  domain,
  page = 1,
}: {
  ids?: string[];
  domain?: string | null;
  page?: number;
}) {
  const params = new URLSearchParams();

  // Set domain
  if (domain && domain !== "All") {
    params.set("domain", domain);
  }
  // Add unique conceptIds
  if (ids.length) {
    params.set("ids", [...new Set(ids)].join(","));
  }
  // Set page
  params.set("page", String(page));

  return params.toString();
}