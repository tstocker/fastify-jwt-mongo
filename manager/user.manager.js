
/**
 * User manager.
 * define and centralize methods relatives to user
 */
const fp = require('fastify-plugin');
const crypto = require('crypto');
/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
let genRandomString = function(length){
  return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
let sha512 = function(password, salt){
  let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  let value = hash.digest('hex');
  return {
    salt:salt,
    passwordHash:value
  };
};

function saltHashPassword(userpassword) {
  let salt = genRandomString(16); /** Gives us salt of length 16 */
  return sha512(userpassword, salt);
}


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
   * getById
   *    Get user by id
   * @param userId
   * @returns {Promise<void>}
   */
  async function getBy(userProperty, value)
  {
    let result = {};

    try {
      let needed = {};
      if (userProperty === "_id") {
        needed[userProperty] = new ObjectId(value);
      } else {
        needed[userProperty] = value;
      }
      result = collection.findOne(needed);
    } catch(e) {
      console.error('error', e);
    }

    return result;
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

    user.password = saltHashPassword(user.password);

    await collection.insert(user);
    return user;
  }

  async function isValidUser(email, password) {

    return new Promise(async (resolve, reject) => {
      let user = await getBy('email', email);
      if (!user || !user._id) {
        reject(false);
        return;
      }

      let passwordSalt = sha512(password, user.password.salt);
      if (passwordSalt.passwordHash === user.password.passwordHash) {
        delete(user.password);
        resolve(user);
        return;
      }

      reject(false);
    })
  }

  // decorate fastify with manager public functions
  fastify.decorate('userManager', {
    addUser: addUser,
    deleteById: deleteById,
    getAllUsers: getAllUsers,
    getById: getById,
    isValidUser: isValidUser
  });

  next();
}

// exports
module.exports = fp(userManager);


