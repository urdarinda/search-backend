import Fastify, { FastifyInstance } from 'fastify';
import { SearchAPI } from './search';
import { buildIndex } from './search/models/build';
const server: FastifyInstance = Fastify({});

server.get('/searchPost', async (request, reply) => {
  return await SearchAPI.searchPost(request.query);
});

const start = async () => {
  try {
    buildIndex();
    await server.listen({ port: 3000 });

    const address = server.server.address();
    const port = typeof address === 'string' ? address : address?.port;
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
