"use server";

import { XMLParser } from "fast-xml-parser";

async function getPmcArticle(pmcid: string): Promise<any> {
  "use cache";
  const url = `${process.env.PMC_BASE_URL}?verb=GetRecord&identifier=oai:pubmedcentral.nih.gov:${pmcid}&metadataPrefix=${process.env.PMC_METADATA_PREFIX}`;
  const res = await fetch(url, {
    headers: { Accept: "application/xml" },
  });

  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });

  const json = parser.parse(xml);

  const article =
    json["OAI-PMH"]?.GetRecord?.record?.metadata?.["oai_dc:dc"] || null;

  const identifiers = article?.["dc:identifier"];

  const articleUrl = Array.isArray(identifiers)
    ? (identifiers.find((id: string) => id.includes("/articles")) ?? null)
    : null;

  return {
    pmcid,
    title: article?.["dc:title"] ?? null,
    articleUrl,
    description: article?.["dc:descripton"] ?? null,
  };
}

export async function getMultiplePmcArticles(
  pmcids: string[],
): Promise<Record<string, any>> {
  "use cache";

  const results = await Promise.all(pmcids.map((id) => getPmcArticle(id)));

  return Object.fromEntries(
    results.map((article: { pmcid: any }) => [article.pmcid, article]),
  );
}
