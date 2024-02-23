const Error = ({ message }) => {
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: 10,
    marginBottom: 10
  }

  return <div style={errorStyle}>{message}</div>
}

export default Error
