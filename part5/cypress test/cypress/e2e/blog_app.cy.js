
describe('Login', function() {
  beforeEach(function() {
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.createUser(user)
  })

  it('Login form is shown', function() {
    cy.get('#username')
    cy.get('#password')
    cy.get('#login-button').contains('login')
  })

  it('a user can login via frontend', function() {
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.contains('Matti Luukkainen logged in')

  })

  it('fails with wrong credentials via frontend', function() {
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('#error')
    .should('contain', 'wrong username or password')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
  })
})

describe('Blog app', function() {

  describe('When logged in via backend and created a blog via frontend', function() {

    beforeEach(function() {
      const user = {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }

    cy.createUser(user)
    cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created via frontend', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Test Blog')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('http://url.com')
      cy.contains('create').click()
      cy.contains('Test Blog Test Author')
    })
  })

  describe('When logged in via backend and created a blog via backend', function() {

    beforeEach(function() {
      const user = {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }

    cy.createUser(user)
    cy.login({ username: 'mluukkai', password: 'salainen' })
    const blog = { title: 'Test Blog', author: 'Test Author', url: 'http://url.com'}
    cy.createBlog(blog)
    })

    it('A user can like a blog', function() {
      cy.contains('Test Blog Test Author')
      cy.contains('view').click()
      cy.contains('likes 0')
      cy.contains('like').click()
      cy.contains('likes 1')
  
    })
  })

  describe('When logged in via backend and created a blog via frontend', function() {

    beforeEach(function() {
      const user = {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }

    cy.createUser(user)
    cy.login({ username: 'mluukkai', password: 'salainen' })
    })

  
    it('A user can delete their own blog', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Test Blog 3')
      cy.get('#author').type('Test Author 3')
      cy.get('#url').type('http://url.com')
      cy.contains('create').click()
      cy.contains('Test Blog 3 Test Author 3').contains('view').click()
      cy.contains('remove').click()
      cy.get('html').should('not.contain', 'Test Blog 3 Test Author 3')
    })

    it('Only a creator can delete a blog', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Test Blog 4')
      cy.get('#author').type('Test Author 4')
      cy.get('#url').type('http://url.com')
      cy.contains('create').click()
      cy.contains('Test Blog 4 Test Author 4').contains('view').click()
      cy.contains('remove')

      cy.contains('logout').click()

      const user2 = {
        name: 'Jussi Luukkainen',
        username: 'jussi',
        password: 'salainen'
      }

      // //create another user
      cy.request('POST', 'http://127.0.0.1:3003/api/users/', user2) 
      // //login via frontend

      cy.get('#username').type('jussi')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      // cy.contains('view').click()
      cy.contains('Test Blog 4 Test Author 4')
      // another user tries to delete a blog which they don't own (unsuccessful operation)
      cy.contains('remove').should('not.exist')

    })
  
    it('Blogs are ordered by likes', function() {
      // Create blogs with different number of likes directly via backend
      const blogs = [
        { title: 'First Blog', author: 'First Author', url: 'http://url.com', likes: 2 },
        { title: 'Second Blog', author: 'Second Author', url: 'http://url.com', likes: 1 },
        { title: 'Third Blog', author: 'Third Author', url: 'http://url.com', likes: 3 }
      ]
      // post blogs directly via backend 
      blogs.forEach(blog => {
        cy.createBlog(blog)
      })

      // check the blogs are in descending order according to number of like
      cy.get('.blog').eq(0).should('contain', 'Third Blog')
      cy.get('.blog').eq(1).should('contain', 'First Blog')
      cy.get('.blog').eq(2).should('contain', 'Second Blog')
      })
    })
  })