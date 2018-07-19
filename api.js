const fs = require('fs');
const path = require('path');
const config = require('./config');

const fastify = require('fastify')({
  logger: true
});

fastify.register(require('fastify-mongodb'), {
  url: config.mongodb.path + config.mongodb.db
});

fastify.register(require('fastify-jwt'), {
  secret: config.secret
});

fastify.register(require('./registry/users'));
fastify.register(require('./registry/jwt-token').routes);



/** hooks **/
fastify.addHook('preHandler', require('./registry/jwt-token').hook.bind({"fastify":fastify}));

fastify.listen(config.server.port, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
});