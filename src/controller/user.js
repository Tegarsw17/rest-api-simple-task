const bcrypt = require('bcrypt')
const { v4: uuid } = require('uuid')
const pool = require('../db')
const message = require('../../response-helper/message.js').MESSAGE
const responseHandler = require('../../response-helper/res-helper.js')

class userController {
  async createUser(req, res) {
    try {
      const payload = req.body
      if (!payload.username) {
        return responseHandler.badRequest(
          res,
          message('user').incompleteKeyOrValue
        )
      }
      if (!payload.password) {
        return responseHandler.badRequest(
          res,
          message('password').incompleteKeyOrValue
        )
      }
      const getQuery = await pool.query(
        `SELECT username,password FROM users WHERE username=$1`,
        [payload.username]
      )
      const isUserExist = getQuery.rows
      if (Object.keys(isUserExist).length === 0) {
        payload.password = bcrypt.hashSync(payload.password, 12)
        payload.id_user = uuid()
        const task = await pool.query(
          'INSERT INTO users (id_user,username, password) VALUES ($1,$2,$3) RETURNING id_user, username',
          [payload.id_user, payload.username, payload.password]
        )
        return responseHandler.created(
          res,
          message('user').created,
          task.rows[0]
        )
      }
      return responseHandler.badRequest(res, message('user').duplicateData)
    } catch (e) {
      console.error(e.message)
      return responseHandler.internalError(res, message(e.message).errorMessage)
    }
  }

  async loginUser(req, res) {
    try {
      const payload = req.body
      const task = await pool.query(
        `SELECT username,password,token FROM users WHERE username=$1`,
        [payload.username]
      )
      const isPasswordTrue = bcrypt.compareSync(
        payload.password,
        task.rows[0].password
      )
      const alreadyLogin = task.rows[0].token
      if (alreadyLogin) {
        return responseHandler.badRequest(
          res,
          message('you are already login').errorMessage
        )
      }
      if (isPasswordTrue) {
        const update = await pool.query(
          `UPDATE users SET token=$1 WHERE username=$2 RETURNING token`,
          [uuid(), payload.username]
        )
        return responseHandler.ok(res, message('login').success, update.rows[0])
      } else {
        return responseHandler.badRequest(
          res,
          message('username or password is wrong').errorMessage
        )
      }
    } catch (e) {
      console.error(e.message)
      return responseHandler.internalError(res, message().serverError)
    }
  }

  async logoutUser(req, res) {
    try {
      const token = req.headers.authorization
      if (token) {
        const update = await pool.query(
          `UPDATE users SET token=NULL WHERE token=$1`,
          [token]
        )
        return responseHandler.ok(res, message('logout').success)
      }
      return responseHandler.authenticationFailed(
        res,
        message('Unauthorized').errorMessage
      )
    } catch (e) {
      console.error(e.message)
      return responseHandler.internalError(res, message(e.message).errorMessage)
    }
  }
}

module.exports = { userController }
