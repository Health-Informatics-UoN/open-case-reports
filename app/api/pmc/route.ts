import { XMLParser } from 'fast-xml-parser';


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pmcid = searchParams.get('pmcid');

    if (!pmcid) {
      return Response.json({ error: 'Missing pmcid' });
    }

    const url = `${process.env.PMC_BASE_URL}?verb=GetRecord&identifier=oai:pubmedcentral.nih.gov:${pmcid}&metadataPrefix=${process.env.PMC_METADATA_PREFIX}`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/xml'
      }
    });
    const xml = await res.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
    });

    const json = parser.parse(xml);

    const article =
      json['OAI-PMH']?.GetRecord?.record?.metadata?.['oai_dc:dc'] || null;

    let articleUrl = null;

    const identifiers = article?.['dc:identifier'];

    if (Array.isArray(identifiers)) {
      articleUrl = identifiers.find((id: string) =>
        id.includes('/articles')
      );
    }
    const title = article?.['dc:title'] || null;

    return Response.json({
      pmcid,
      articleUrl,
      title
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: 'PMC fetch failed' });
  }
}