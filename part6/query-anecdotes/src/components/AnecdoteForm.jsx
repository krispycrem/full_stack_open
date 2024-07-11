import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {

  const queryClient = useQueryClient()

  const dispatch = useNotificationDispatch()

  const createAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
        queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
        dispatch({ type: 'SET_NOTIFICATION', payload: `you created'${newAnecdote.content}'` })
        setTimeout(() => {
            dispatch({ type: 'CLEAR_NOTIFICATION' })
        }, 5000)
    },
    onError: (error) => {
      dispatch({ type: 'SET_NOTIFICATION', payload: error.response.data.error })
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
    }
})

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    createAnecdoteMutation.mutate({ content, votes: 0 })
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
