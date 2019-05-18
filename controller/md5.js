const crypto = require("crypto");

/** 
 * @param {String} MD5
 * @return {String}
 */
module.exports = (pwd) => {
  let md5 = crypto.createHash('md5');
  let password = md5.update(pwd).digest('hex');
  return password;
}