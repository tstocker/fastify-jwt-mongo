/**
 * hook find if token is set on request
 * @param request
 * @param reply
 * @param next
 * @returns {Promise<void>}
 */
async function hook(request, reply, next) {

  let fastify = this.fastify;
  /**
   * security token test
   * @param token
   * @returns {Promise<any>}
   */
  async function verifyToken(token){
    return new Promise((resolve, reject) => {
      fastify.jwt.verify(token, (err, decoded) => {
        if (err) {
          reject(false);
        }
        resolve(true);
      });
    });
  }

  // catch if token is valide
  if(request.raw.url !== "/api/login") {
    try {
      let asyncVerification = false;
      if(request.headers.authorization) {
        let token = request.headers.authorization.replace('Bearer: ', '');
        asyncVerification = await verifyToken(token);
      }
      if(!asyncVerification){
        reply.code(401).send();
        return;
      }
    } catch(e) {
      console.log(e);
      reply.code(401).send();
      return;
    }
  }
}

const loginOpts = {
  schema: {
    body: {
      title: "user",
      type: 'object',
      properties: {
        email: { type: "string"},
        password: { type: "string" }
      },
      required: ['email', 'password']
    }
  }
};

/**
 * Defines routes for identification
 * @param fastify
 * @param options
 * @returns {Promise<void>}
 */
async function routes (fastify, options) {
  fastify.post('/api/login', loginOpts, async (request, reply) => {
    const {body} = request;
      await fastify.userManager.isValidUser(body.email, body.password).catch((err) => {
        reply.code(401).send({message: "Invalid email or password", error: err});
        return false;
      });

      let payload = {"tokenName": body.email};

      const token = fastify.jwt.sign(payload, {expiresIn: "120s"});
      reply.send({ token: token });
  });

  fastify.post('/api/logout', (request, reply) => {
    reply.send("done");
  });
}

module.exports.routes = routes;
module.exports.hook = hook;
