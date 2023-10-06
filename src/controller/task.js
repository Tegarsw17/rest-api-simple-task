const { v4: uuid } = require('uuid')
const pool = require('../db')
const allData = 'id_task, title, description, status, due_date, user_id'
const noId = 'title, description, status, due_date'
const message = require('../../response-helper/message.js').MESSAGE
const responseHandler = require('../../response-helper/res-helper.js')

class taskController {
  async createTask(req, res) {
    try {
      const payload = req.body
      // check user
      const id_task = uuid()
      const token = req.headers.authorization

      const user = await pool.query(
        `SELECT id_user,username,token FROM users WHERE token=$1`,
        [token]
      )
      // create task
      const data = user.rows[0]
      const id_user = data.id_user
      const task = await pool.query(
        `INSERT INTO tasks (${allData}) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ${allData}`,
        [
          id_task,
          payload.title,
          payload.description,
          payload.status,
          payload.due_date,
          id_user,
        ]
      )
      return responseHandler.created(res, message('task').created, task.rows[0])
    } catch (e) {
      console.error(e.message)
      return responseHandler.internalError(res, message(e.message).errorMessage)
    }
  }

  async getAllTask(req, res) {
    try {
      const token = req.headers.authorization
      const user = await pool.query(
        `SELECT id_user,username,token FROM users WHERE token=$1`,
        [token]
      )
      const tasks = await pool.query(
        `SELECT id_task,title,description,status,due_date FROM tasks WHERE user_id=$1`,
        [user.rows[0].id_user]
      )
      return responseHandler.ok(res, message('get data').success, tasks.rows)
    } catch (e) {
      console.error(e.message)
      return responseHandler.internalError(res, message(e.message).errorMessage)
    }
  }

  async getDetailTask(req, res) {
    try {
      const token = req.headers.authorization
      const payloadParams = req.params

      const user = await pool.query(
        `SELECT id_user,username,token FROM users WHERE token=$1`,
        [token]
      )
      const tasks = await pool.query(
        `SELECT id_task,title,description,status,due_date FROM tasks WHERE id_task=$1 AND user_id=$2`,
        [payloadParams.id, user.rows[0].id_user]
      )
      // return res.status(200).json({ data: tasks.rows })
      return responseHandler.ok(res, message('get data').success, tasks.rows)
    } catch (e) {
      console.error(e.message)
      return responseHandler.internalError(res, message(e.message).errorMessage)
    }
  }

  async updateDetailTask(req, res) {
    try {
      const token = req.headers.authorization
      const payload = req.body
      const payloadParams = req.params
      const user = await pool.query(
        `SELECT id_user,username,token FROM users WHERE token=$1`,
        [token]
      )
      const tasks = await pool.query(
        `SELECT id_task,title,description,status,due_date FROM tasks WHERE id_task=$1 AND user_id=$2`,
        [payloadParams.id, user.rows[0].id_user]
      )
      const isDataNull = Object.keys(tasks.rows).length === 0
      if (!isDataNull) {
        const update = await pool.query(
          `UPDATE tasks SET title=$1, description=$2, status=$3, due_date=$4 WHERE id_task=$5 AND user_id=$6 RETURNING ${noId}`,
          [
            payload.title,
            payload.description,
            payload.status,
            payload.due_date,
            payloadParams.id,
            user.rows[0].id_user,
          ]
        )
        return responseHandler.ok(
          res,
          message('update').success,
          update.rows[0]
        )
      }
      return responseHandler.notFound(res, message('task').notFoundResource)
    } catch (e) {
      console.error(e.message)
      return responseHandler.internalError(res, message(e.message).errorMessage)
    }
  }
  async deleteTask(req, res) {
    try {
      const token = req.headers.authorization
      const payloadParams = req.params
      const user = await pool.query(
        `SELECT id_user,username,token FROM users WHERE token=$1`,
        [token]
      )
      const deleteTask = await pool.query(
        `DELETE FROM tasks WHERE id_task=$1 AND user_id=$2`,
        [payloadParams.id, user.rows[0].id_user]
      )
      if (deleteTask.rowCount) {
        // return res.status(200).json({ message: 'Task already delete' })
        return responseHandler.ok(res, message('delete task').success)
      }
      // return res.status(400).json({ message: 'There is no task' })
      return responseHandler.notFound(res, message('task').notFoundResource)
    } catch (e) {
      console.error(e.message)
      return responseHandler.internalError(res, message(e.message).errorMessage)
    }
  }
}

module.exports = {
  taskController,
}
