/**
 * User manager.
 * define and centralize methods relatives to user
 */
const fp = require('fastify-plugin');

/**
 * Fastify-plugin userManager
 *    define global methods for user management
 * @param fastify
 * @param options
 * @param next
 */
function userManager (fastify, options, next) {
  // const used for mongodb
  const db = fastify.mongo.db;
  const collection = db.collection('users');
  const ObjectId = fastify.mongo.ObjectId;

  /**
   * getById
   *    Get user by id
   * @param userId
   * @returns {Promise<void>}
   */
  async function getById(userId)
  {
    return await collection.findOne({_id: new ObjectId(userId)});
  }

  /**
   * getAllUsers
   * @returns {Promise<*>}
   */
  async function getAllUsers()
  {
    return await collection.find({}).toArray();
  }

  /**
   * deleteById
   * @param userId
   * @returns {Promise<*>}
   */
  async function deleteById(userId)
  {
    return await collection.update({_id: new ObjectId(userId)}, {$set: {"deletedAt": new Date()}});
  }

  /**
   * addUser
   * @param user
   * @returns {Promise<*>}
   */
  async function addUser(user)
  {
    // TODO email verification
    // if (result === null || result.value === null) {
    //   throw new Error('Invalid value')
    // }
    await this.collection.insert(user);
    return user;
  }

  // decorate fastify with manager public functions
  fastify.decorate('userManager', {
    addUser: addUser,
    deleteById: deleteById,
    getAllUsers: getAllUsers,
    getById: getById
  });

  next();
}

// exports
module.exports = fp(userManager);


