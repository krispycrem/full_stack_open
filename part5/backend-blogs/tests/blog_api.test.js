const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
require('express-async-errors')
const app = require('../app')
const helper = require('./test_helper')
const assert = require('node:assert')
const bcrypt = require('bcrypt')

const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const testUser = helper.testUser

  await api
    .post('/api/users').send(testUser)

  const loginResponse = await api.post('/api/login').send({
    username: testUser.username,
    password: testUser.password
  })

  const token = loginResponse.body.token

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(helper.initialBlogs[0])
    .expect(201)
    .expect('Content-Type', /application\/json/)

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(helper.initialBlogs[1])
    .expect(201)
    .expect('Content-Type', /application\/json/)

})

test('blogs are returned as json', async () => {

  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blogs have id unique identifier property', async() => {
  const blogs = await helper.blogsInDb()
  blogs.forEach(blog => {
    assert.ok(blog.id)
  })
})

test('a blog can be created', async () => {
  const newUser = helper.newUser

  await api
    .post('/api/users').send(newUser)

  const loginResponse = await api.post('/api/login').send({
    username: newUser.username,
    password: newUser.password
  })

  const token = loginResponse.body.token

  const newBlog = {
    title: 'HTML is funny',
    author: 'Emma Rintanen',
    url: 'https://www.eee.com',
    likes: 4
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api
                    .get('/api/blogs')
                    .set('Authorization', `Bearer ${token}`)

  const titles = response.body.map(r => r.title)
  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  assert(titles.includes('HTML is funny'))
})

test('creation of the blog fails with 401 Unathorized error if token is not provided', async () => {

  const newBlog = {
    title: 'HTML is funny',
    author: 'Emma Rintanen',
    url: 'https://www.eee.com',
    likes: 4
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)  
})

test('test like property of the blog', async () => {
  const newUser = helper.newUser

  await api
    .post('/api/users').send(newUser)

  const loginResponse = await api.post('/api/login').send({
    username: newUser.username,
    password: newUser.password
  })

  const token = loginResponse.body.token

  const newBlog = {
    title: 'HTML is funny',
    author: 'Emma Rintanen',
    url: 'https://www.eee.com',
  }
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
})

test('test title or url property is missing in the blog', async () => {

  const newUser = helper.newUser

  await api
    .post('/api/users').send(newUser)

  const loginResponse = await api.post('/api/login').send({
    username: newUser.username,
    password: newUser.password
  })

  const token = loginResponse.body.token

  const BlogMissingTitle = {
    author: 'Emma Rintanen',
    url: 'https://www.eee.com',
  }
  const BlogMissingUrl = {
    title: 'HTML is funny',
    author: 'Emma Rintanen',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(BlogMissingTitle)
    .expect(400)
  
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(BlogMissingUrl)
    .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('test delete blog', async() => {
  
  const newUser = helper.newUser

  await api
    .post('/api/users')
    .send(newUser)

  const loginResponse = await api.post('/api/login').send({
    username: newUser.username,
    password: newUser.password
  })

  const token = loginResponse.body.token

  await Blog.deleteMany({})

  const newBlog = {
    title: 'HTML is strange',
    author: 'Alvari Aalto',
    url: 'https://www.eee.com',
    likes: 4
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtStart = await helper.blogsInDb()

  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map(r => r.title)

  assert(!titles.includes(blogToDelete.title))
})

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

  const usernames = usersAtEnd.map(u => u.username)
  assert(usernames.includes(newUser.username))
})

test('creation fails with proper statuscode and message if username already taken', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert(result.body.error.includes('expected `username` to be unique'))

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('creation fails with proper statuscode and message if username is less that 3 characters', 
async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'ro',
    name: 'Superuser',
    password: 'salainen',
  }

  const result = await api
  .post('/api/users')
  .send(newUser)
  .expect(400)
  .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert(result.body.error.includes("User validation failed: username: Path `username` (`ro`) is shorter than the minimum allowed length (3)"))
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('creation fails with proper statuscode and message if password is less than 3 characters', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'new',
    name: 'Superuser',
    password: 'sa',
  }

  const result = await api
  .post('/api/users')
  .send(newUser)
  .expect(400)
  .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert(result.text.includes("Password length should contain at least 3 characters"))
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('creation fails with proper statuscode and message if username is not provided', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    name: 'Superuser',
    password: 'sunny',
  }

  const result = await api
  .post('/api/users')
  .send(newUser)
  .expect(400)
  .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert(result.body.error.includes("User validation failed: username: Path `username` is required."))
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('creation fails with proper statuscode and message if password is not provided', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'newold',
    name: 'Superuser',
  }

  const response = await api
  .post('/api/users')
  .send(newUser)
  .expect(400)
  .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert(response.text.includes("Password is missing"))
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('test update blog', async() => {

  const newUser = helper.newUser

  await api
    .post('/api/users').send(newUser)

  const loginResponse = await api.post('/api/login').send({
    username: newUser.username,
    password: newUser.password
  })

  const token = loginResponse.body.token

  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0] 

  const UpdatedBlog = {
    likes: 10,
  }

  response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(UpdatedBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  assert.strictEqual(response.body.likes, 10)
})

after(async () => {
  await mongoose.connection.close()
})