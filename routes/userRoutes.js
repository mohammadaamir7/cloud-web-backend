const router = require('express').Router()
const { register, sendEmail, login, update, getUserById, getUserProfile } = require('../controllers/userController')
const protect = require('../middlewares/authMiddleware')

router.route('/register').post(register)
router.route('/sendEmail').post(sendEmail)
router.route('/login').post(login)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, update)

module.exports = router