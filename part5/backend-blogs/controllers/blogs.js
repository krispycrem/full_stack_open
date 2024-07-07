const blogsRouter = require('express').Router()
const { response } = require('../app')
const Blog = require('../models/blog')
const Like = require('../models/like')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id).
  then(blog => {
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
    })
    .catch(error => next(error))
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  else {
    return response.status(401).json({ error: 'only author of the blog can delete it' })
  }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (body.title === undefined) {
    return response.status(400).json({ error: 'title missing' })
  }

  if (body.author === undefined) {
    return response.status(400).json({ error: 'author missing' })
  }

  if (body.url === undefined) {
    return response.status(400).json({ error: 'url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  
  response.status(201).json(savedBlog)

})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {

    const body = request.body
    const user = request.user
  
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog,
    { new: true })
    response.json(updatedBlog.toJSON())
  })

blogsRouter.get('/:id/like-status', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blogId = request.params.id

  const existingLike = await Like.findOne({ user: user.id, blog: blogId })
  if (existingLike) {
    return response.json({ liked: true })
  } else {
    return response.json({ liked: false })
  }
})

blogsRouter.post('/:id/like', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blogId = request.params.id

  const existingLike = await Like.findOne({ user: user.id, blog: blogId })
  if (existingLike) {
    return response.status(400).json({ error: 'You have already liked this post' })
  }

  const like = new Like({ user: user.id, blog: blogId })
  await like.save()

  const blog = await Blog.findById(blogId)
  blog.likes += 1
  await blog.save()

  response.status(200).json(blog)
})

module.exports = blogsRouter


