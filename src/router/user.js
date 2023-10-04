const router = require('express').Router()
const { userController } = require('../controller/user.js')

const usercontroller = new userController()

router.post('/register', usercontroller.createUser)
router.post('/login', usercontroller.loginUser)
router.delete('/logout', usercontroller.logoutUser)

module.exports = router
