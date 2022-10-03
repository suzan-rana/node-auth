const express = require('express')
const router = express.Router()

const { register, login, updateRole, deleteUser  } = require('./Auth')
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/updaterole').post(updateRole)
router.route('/deleteuser').delete(deleteUser)

module.exports = router;