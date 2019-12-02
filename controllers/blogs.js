const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id
    })
  
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
  } catch(exception) {
    next(exception)
  }
})

// blogsRouter.get('/:id', async (request, response, next) => {
//   const blog = await Blog.findById(request.params.id).populate('user', { username: 1, _id: 1 })
//   const blogUser = await User.findById(blog.user.id)
//   response.json(blogUser.toJSON())
// })

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(request.params.id).populate('user', { username: 1, _id: 1 })
    
    if (!blog) {
      return response.status(400).json( { error: 'cannot find blog' })
    }
    
    const blogUser = await User.findById(blog.user.id)


    if (decodedToken.id.toString() === blogUser.id.toString()) {
      try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
      } catch (exception) {
        next(exception) 
      }
    } else {
      response.status(400).json({ error: 'user token doesn\'t match' })
    }
  } catch (exception) { next(exception) }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(updatedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter