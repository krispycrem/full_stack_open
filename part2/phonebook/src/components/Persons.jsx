const Persons = ({ persons,  handleDeletePerson}) => {
  return (
    <div>
      {persons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDeletePerson(person.id)}>delete</button>
        </div>
      ))}
    </div>
  )
}
export default Persons
