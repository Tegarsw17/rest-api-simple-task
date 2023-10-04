const bcrypt = require('bcrypt')
const { v4: uuid } = require('uuid')
const pool = require('../db')

class userController {
  async createUser(req, res) {
    try {
      const payload = req.body
      if (!payload.username || !payload.password) {
        return res
          .status(400)
          .json({ message: 'Data yang dimasukan tidak lengkap' })
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
        return res.status(201).json(task.rows)
      }
      return res.status(400).json({ message: 'username already exist' })
    } catch (e) {
      console.error(e.message)
      return res.status(500).json({ error: 'Server error' })
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
        return res.status(400).json({ message: 'you are already login' })
      }
      if (isPasswordTrue) {
        const update = await pool.query(
          `UPDATE users SET token=$1 WHERE username=$2 RETURNING token`,
          [uuid(), payload.username]
        )
        return res
          .status(200)
          .json({ message: 'Login Sukses', data: update.rows[0] })
      } else {
        return res.status(400).json({ message: 'username atau password salah' })
      }
      //   return res.status(201).json({ message: 'username atau password salah' })
    } catch (e) {
      console.error(e.message)
      return res.status(500).json({ error: 'Server error' })
    }
  }

  async logoutUser(req, res) {
    try {
      const token = req.headers.token
      if (token) {
        const update = await pool.query(
          `UPDATE users SET token=NULL WHERE token=$1`,
          [token]
        )
        return res.status(200).json({ message: 'OK' })
      }
      return res.status(401).json({ message: 'Unauthorized' })
    } catch (e) {
      console.error(e.message)
      return res.status(500).json({ error: 'Server error' })
    }
  }
}

module.exports = { userController }
