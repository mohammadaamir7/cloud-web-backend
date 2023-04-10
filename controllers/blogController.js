const expressAsyncHandler = require("express-async-handler");
const Blog = require("../models/blogModel");

// @desc    Add a new blog
// @route   POST /api/blog/
// @access  Private
const addBlog = expressAsyncHandler(async (req, res) => {
  try {
    await Blog.create({ ...req.body });
    res.status(200).send("Blog added successfully");
  } catch (err) {
    res.status(401);
    throw new Error("Invalid blog data");
  }
});

// @desc    Get blogs
// @route   POST /api/blog/
// @access  Public
const getBlogs = expressAsyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.status(200).send(blogs);
  } catch (err) {
    res.status(401);
    throw new Error("Error fetching blogs");
  }
});

// @desc    get blog
// @route   GET /api/blog/
// @access  Public
const getBlog = expressAsyncHandler(async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.status(200).send(blog);
  } catch (err) {
    res.status(401);
    throw new Error("Error fetching blog");
  }
});

// @desc    Add a new blog
// @route   POST /api/blog/
// @access  Private
const updateBlog = expressAsyncHandler(async (req, res) => {
  try {
    const { title, intro, description } = req.body;
    const blog = await Blog.findById(req.params.id);

    blog.title = title;
    blog.intro = intro;
    blog.description = description;
    await blog.save()

    res.status(200).send(blog);
  } catch (err) {
    res.status(401);
    throw new Error("Error fetching blog");
  }
});

// @desc    Add a new blog
// @route   POST /api/blog/
// @access  Private
const deleteBlog = expressAsyncHandler(async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).send("Blog deleted successfully");
  } catch (err) {
    res.status(401);
    throw new Error("Error fetching blog");
  }
});

module.exports = { addBlog, getBlogs, getBlog, updateBlog, deleteBlog };
