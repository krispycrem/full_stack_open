const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Emma Rintanen',
    url: 'https://www.eee.com',
    likes: 4
  },
  {
    title: 'Browser can execute only JavaScript',
    author: 'Kimmo Rintanen',
    url: 'https://www.eee.com',
    likes: 10
  }
]

const newUser = {
  username: 'newuser',
  name: 'New User',
  password: 'newtuser',
  blogs: []
}

const testUser = {
  username: 'testuser',
  name: 'Test User',
  password: 'testuser',
  blogs: []
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  newUser,
  testUser,
  blogsInDb, 
  usersInDb
}