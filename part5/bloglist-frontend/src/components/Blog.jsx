import { useState, useEffect } from 'react'
import blogService from '../services/blogs'


const Blog = ({ blog, user, removeBlogFromState, handleLike }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visibleWhole, setVisibleWhole] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const fetchLikedStatus = async () => {
      const likedStatus = await blogService.hasUserLiked(blog.id)
      setLiked(likedStatus)
    }
    fetchLikedStatus()
  }, [blog.id])


  const buttonLabelVisibleWhole = visibleWhole ? 'hide' : 'view'
  const showWhole = { display: visibleWhole ? '' : 'none' }

  const likeBlog = async (event) => {
    event.preventDefault()
    if (liked) return
    await handleLike(blog)
    setLikes(likes + 1)
    setLiked(true)
  }

  const removeBlog = async (event) => {
    event.preventDefault()
    const confirmDelete = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (confirmDelete) {
      await blogService.remove(blog.id)
      removeBlogFromState(blog.id)
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <div className='blogTitleAuthor'>
        {blog.title}  {blog.author} <button onClick={() => setVisibleWhole(!visibleWhole)}>{buttonLabelVisibleWhole}</button>
      </div>
      <div className="blogDetails" style={showWhole}>
        <div>
          {blog.url}
        </div>
        <div>
          likes {likes}
          <button className="likeButton" onClick={likeBlog} disabled={liked} id='like-button'>like</button>
        </div>
        <div>
          {user.username}
        </div>
        {user.id === blog.user.id && (
          <div>
            <button onClick={removeBlog} id='remove-button'>remove</button>
          </div>
        )}
      </div>
    </div>
  )}

export default Blog
