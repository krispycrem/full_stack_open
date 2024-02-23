import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
)

const StatisticLine = ({ text, value }) => (
  <table>
      <tbody>
        <tr>
          <td>{text}</td>
          <td>{value}</td>
        </tr>
      </tbody>
  </table>
);

const Statistics = ({ good, neutral, bad }) => {
  const totalFeedback = good + neutral + bad;
  const averageScore = (good - bad) / totalFeedback || 0;
  const positivePercentage = (good / totalFeedback) * 100 || 0;

  return (
    <div>
      <h1>statistics</h1>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={totalFeedback} />
      <StatisticLine text="average" value={averageScore} />
      <StatisticLine text="positive" value={`${positivePercentage} %`} />
    </div>
  );
};

const App = () => {
  
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = (newValue) => {
      setGood(newValue)
  }

  const handleNeutralClick = (newValue) => {
    setNeutral(newValue)
  }

  const handleBadClick = (newValue) => {
    setBad(newValue)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => handleGoodClick(good + 1)} text='good' />
      <Button handleClick={() => handleNeutralClick(neutral + 1)} text='neutral' />
      <Button handleClick={() => handleBadClick(bad + 1)} text='bad' />
      <h1>statistics</h1>
      {good || neutral || bad ? (
        <Statistics good={good} neutral={neutral} bad={bad} />
      ) : (
        <p>No feedback given</p>
      )}
    </div>
    
  )
}

export default App