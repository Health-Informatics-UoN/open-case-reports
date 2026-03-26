import { Client } from '@elastic/elasticsearch';
const isDev = process.env.NODE_ENV === 'development';
export const es = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME!,
    password: process.env.ELASTICSEARCH_PASSWORD!,
  },
  tls: isDev
    ? { rejectUnauthorized: false }
    : undefined,
});