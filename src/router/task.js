const router = require('express').Router()
const { taskController } = require('../controller/task.js')

const taskcontroller = new taskController()

// router.get('/cek', taskcontroller.insertTask)
router.post('/task', taskcontroller.createTask)
router.get('/task', taskcontroller.getAllTask)
router.get('/task/:id', taskcontroller.getDetailTask)
router.put('/task/:id', taskcontroller.updateDetailTask)
router.delete('/task/:id', taskcontroller.deleteTask)

module.exports = router
