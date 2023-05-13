import Fastify, { FastifyInstance } from 'fastify';
import { SearchAPI } from './search';
import { buildIndex } from './search/models/build';
const server: FastifyInstance = Fastify({});


const opts = {
  schema: {
    querystring: {
      query: { type: 'string' },
      page: { type: 'integer' },
      pageSize: { type: 'integer' },
      sortKey: {
        type: 'string',
        enum: ['name', 'dateLastEdited']
      },
    }
  },
}


server.get('/searchPost',opts, async (request, reply) => {
  return await SearchAPI.searchPost(request.query);
});

const start = async () => {
  try {
    buildIndex();
    await server.listen({ port: 3000 });
    console.log("listening on 3000")
    const address = server.server.address();
    const port = typeof address === 'string' ? address : address?.port;
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
