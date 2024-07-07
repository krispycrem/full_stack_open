import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  title: 'Test Title',
  author: 'Test Author',
  url: 'https://url.com',
  likes: 5,
  user: { id: '1', username: 'testuser' }
}

const user = {
  id: '1',
  username: 'testuser',
  name: 'Test User'
}

test('renders title and author of a blog', () => {
  const mockHandler = vi.fn()

  const {container} = render(<Blog blog={blog} user={user} removeBlogFromState={() => {}} handleLike={mockHandler} />)

  const element1 = screen.getByText('Test Title', {exact: false})
  const element2 = screen.getByText('Test Author', {exact: false})
  expect(element1).toBeDefined()
  expect(element2).toBeDefined()

  const detailsDiv = container.querySelector('.blogDetails')
  expect(detailsDiv).toHaveStyle('display: none')
  
})

test('clicking the view button shows URL and number of likes', () => {
  const mockHandler = vi.fn()
  const { container } = render(<Blog blog={blog} user={user} 
    removeBlogFromState={() => {}} handleLike={mockHandler}/>)

  const button = screen.getByText('view')
  fireEvent.click(button)

  const detailsDiv = container.querySelector('.blogDetails')
  expect(detailsDiv).not.toHaveStyle('display: none')
  expect(detailsDiv).toHaveTextContent('https://url.com')
  expect(detailsDiv).toHaveTextContent('likes 5')
})

test('calls the event handler twice if the like button is clicked twice', async () => {
  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={user} removeBlogFromState={() => {}} handleLike={mockHandler} />)

  const viewButton = screen.getByText('view')
  fireEvent.click(viewButton)

  const likeButton = screen.getByText('like')

  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})
