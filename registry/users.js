async function routes (fastify, options) {
  const db = fastify.mongo.db;
  const collection = db.collection('users');
  const ObjectId = fastify.mongo.ObjectId;

  fastify.get('/api/users/:id', async (request, reply) => {
    let result = await collection.findOne({_id: new ObjectId(request.params.id)});
    return result;
  });

  fastify.get('/api/users', async (request, reply) => {
    return  await collection.find({}).toArray();
  });

  fastify.delete('/api/users/:id', async (request, reply) => {
    let result = await collection.update({_id: new ObjectId(request.params.id)}, { $set: { "deletedAt": new Date()}});
    return result;
  });

  /** user creation **/
  // TODO report schema into a repository for schema
  const opts = {
    schema: {
      body: {
        title: "user",
        type: 'object',
        properties: {
          username: { type: "string"},
          firstName: { type: "string" },
          lastName: { type: "string" },
          email: { type: 'string' },
          birthdate: { type: 'string' }
        },
        required: ['username', 'email']
      }
    }
  }

  fastify.post('/api/users', opts, async (request, reply) => {
    // TODO email verification
    // if (result === null || result.value === null) {
    //   throw new Error('Invalid value')
    // }
    await collection.insert(request.body);
    return request.body;
  })
}

module.exports = routes;
