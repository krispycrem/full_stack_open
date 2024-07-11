import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {

  const filter = useSelector(state => state.filter)
  const anecdotes = useSelector(state => state.anecdotes)
  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(voteAnecdote(id))
    const anecdote = anecdotes.find(a => a.id === id)
    dispatch(showNotification(`you voted '${anecdote.content}'`, 5))
  }

  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )
  
  return (
    <div>
      {[...filteredAnecdotes]
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        )}
    </div>
  )
}

export default AnecdoteList