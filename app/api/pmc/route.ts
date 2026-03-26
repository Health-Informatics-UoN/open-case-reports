
import { getPmcArticle } from '@/lib/services/pmcService';


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pmcid = searchParams.get('pmcid');

  if (!pmcid) {
    return Response.json(
      { error: 'Missing pmcid' },
      { status: 400 }
    );
  }

  const article = await getPmcArticle(pmcid);

  return Response.json(article);
}