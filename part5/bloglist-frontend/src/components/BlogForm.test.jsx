import React from 'react'
import { render, screen} from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('calls the event handler with the right details when a new blog is created', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()
  
    render(<BlogForm createBlog={createBlog} />)
  
    const titleInput = screen.getByPlaceholderText('write title here')
    const authorInput = screen.getByPlaceholderText('write author here')
    const urlInput = screen.getByPlaceholderText('write url here')
    const createButton = screen.getByText('create')
  
    await user.type(titleInput, 'Test Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'https://test.url')
    await userEvent.click(createButton)
  
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Test Title')
    expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
    expect(createBlog.mock.calls[0][0].url).toBe('https://test.url')

  })
  