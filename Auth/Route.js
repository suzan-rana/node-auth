const express = require('express')
const router = express.Router()
const { adminAuth } = require('../middleware/Auth')

const { register, login, updateRole, deleteUser  } = require('./Auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/updaterole').put(adminAuth, updateRole)
router.route('/deleteuser').delete(adminAuth, deleteUser)

module.exports = router;