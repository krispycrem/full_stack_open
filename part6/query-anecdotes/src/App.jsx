import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {

  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
        queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
        console.log('votedispatch')
        dispatch({ type: 'SET_NOTIFICATION', payload: `anecdote '${updatedAnecdote.content}' voted` })
        setTimeout(() => {
            dispatch({ type: 'CLEAR_NOTIFICATION' })
        }, 5000)
    },
})

const handleVote = (anecdote) => {
  updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
}


  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
