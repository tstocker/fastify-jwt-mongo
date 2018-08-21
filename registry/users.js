/** user creation **/
  // TODO report schema into a repository for schema
const userCreationOpts = {
  schema: {
    body: {
      title: "user",
      type: 'object',
      properties: {
        username: { type: "string"},
        firstName: { type: "string" },
        lastName: { type: "string" },
        email: { type: 'string' },
        birthdate: { type: 'string' },
        password: {type: 'string'}
      },
      required: ['username', 'email', 'password']
    }
  }
};

async function routes (fastify, options) {

  fastify.get('/api/users/:id', async (request, reply) => {
    return fastify.userManager.getById(request.params.id);
  });

  fastify.get('/api/users', async (request, reply) => {
    return  fastify.userManager.getAllUsers();
  });

  fastify.delete('/api/users/:id', async (request, reply) => {
    return fastify.userManager.deleteById(request.params.id);
  });

  fastify.post('/api/users', userCreationOpts, async (request, reply) => {
    // TODO email verification
    // if (result === null || result.value === null) {
    //   throw new Error('Invalid value')
    // }
    return fastify.userManager.addUser(request.body);
  })
}

module.exports = routes;
