import { Client } from '@elastic/elasticsearch';

export const es = new Client({
  node: process.env.ELASTICSEARCH_URL,
  tls: {
    rejectUnauthorized: false
  }
});