const router = require('express').Router()
const { addBlog, getBlogs, getBlog, updateBlog, deleteBlog } = require('../controllers/blogController')
const protect = require('../middlewares/authMiddleware')
const isAdmin = require('../middlewares/isAdmin')

router.route('/addBlog').post(protect, isAdmin, addBlog)
router.route('/getBlogs').get(getBlogs)
router.route('/getBlog/:id').get(getBlog)
router.route('/updateBlog/:id').put(protect, isAdmin, updateBlog)
router.route('/deleteBlog/:id').delete(protect, isAdmin, deleteBlog)

module.exports = router