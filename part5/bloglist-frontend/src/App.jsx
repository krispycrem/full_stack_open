import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Error from './components/Error'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const removeBlogFromState = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  )

  const logoutForm = () => (
    <form onSubmit={handleLogout}>
      <button type="submit">logout</button>
    </form>
  )

  const addNotification = (message, duration = 5000) => {
    setNotification({ message })
    setTimeout(() => {
      setNotification(null)
    }, duration)
  }

  const addErrorMessage = (message, duration = 5000) => {
    setErrorMessage({ message })
    setTimeout(() => {
      setErrorMessage(null)
    }, duration)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      addErrorMessage('wrong username or password')
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
  }



  const handleLogout = async (event) => {
    window.localStorage.clear()
  }

  const addBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject)
      addNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setBlogs(blogs.concat(blog))
    } catch (error) {
      addErrorMessage('failed to add a new blog')
    }
  }

  return (
    <div>
      {!user &&
        <div>
          <h2>log in to application</h2>
          {errorMessage && <Error message={errorMessage.message} type={errorMessage.type} />}
          {loginForm()}
        </div>
      }
      {user &&
        <div>
          <h2>blogs</h2>
          {notification && <Notification message={notification.message} type={notification.type} />}
          <h6>{user.name} logged in {logoutForm()}</h6>
          <Togglable buttonLabel="new blog">
            <BlogForm
              createBlog={addBlog}
            />
          </Togglable>
          {blogs.map(blog =>
            <Blog 
              key={blog.id} 
              blog={blog} 
              user={user} 
              handleLike={handleLike}
              removeBlogFromState={removeBlogFromState} 
            />
          )}
        </div>
      }
    </div>
  )
}



export default App