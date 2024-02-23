import { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/Persons'
import Filter from './components/Filter'
import Notification from './components/Notification'
import Error from './components/Error'
import PersonForm from './components/PersonForm'
import personService from './services/persons'



const App = () => {
  const [persons, setPersons] = useState([])
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [searchPerson, setSearchPerson] = useState('')
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addNotification = (message, duration = 5000) => {
    setNotification({message})
    setTimeout(() => {
      setNotification(null)
    }, duration)
  }

  const addErrorMessage = (message, duration = 5000) => {
    setErrorMessage({ message})
    setTimeout(() => {
      setErrorMessage(null)
    }, duration)
  }


  const addPerson = (event) => {
    event.preventDefault()
    const personExists = persons.find(p => p.name === name)
    if (personExists) {
      const confirmUpdate = window.confirm(`${personExists.name} is already added to phonebook, replace the old number with a new one?`)
        if (confirmUpdate)
        {
          const updatedPerson = { ...personExists, number: number }
          personService
            .update(personExists.id, updatedPerson)
            .then(returnedPerson => {
              setPersons(persons.map(p => (p.id === returnedPerson.id ? returnedPerson : p)))
              addNotification(`Number for ${updatedPerson.name} updated successfully`)
              setName('')
              setNumber('')
            })
            .catch(error => {
              addErrorMessage(`Information of ${personExists.name} has already been removed from server`)
            })
        }
      } else {
        const personObject = { name, number }
        personService
          .create(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setName('')
            setNumber('')
            addNotification(`Added ${returnedPerson.name}`)
        })
    }
  }

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchPerson(event.target.value)
  }

  const handleDeletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    const confirmDelete = window.confirm(`Delete ${person.name} ?`)

    if (confirmDelete) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
    setPersons(persons.filter(person => person.id !== id))
  }

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchPerson.toLowerCase())
  )

  return (
    <div>
      <h1>Phonebook</h1>
      {notification && <Notification message={notification.message} type={notification.type} />}
      {errorMessage && <Error message={errorMessage.message} type={errorMessage.type} />}
      <Filter
        searchTerm={searchPerson}
        handleSearchChange={handleSearchChange}
      />
      <h1>add a new</h1>
      <PersonForm
        name={name}
        number={number}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h1>Numbers</h1>
      <Persons
        persons={filteredPersons}
        handleDeletePerson = {handleDeletePerson}
      />
    </div>
  )
}

export default App
