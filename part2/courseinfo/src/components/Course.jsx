const Part = ({ part }) => {
    return (
      <p> {part.name} {part.exercises} </p>
    )
  }
  
const Content = ({ parts }) => {
    const partsList = [];
  
    for (let i = 0; i < parts.length; i++) {
      partsList.push(<Part key={parts[i].id} part={parts[i]} />)
    }
  
    return <div>{partsList}</div>
}
  
const Header = ({ courseName }) => {
    return <h2> {courseName} </h2>
}
  
const Course = ({ course }) => {
    const IntitialTotalSum = 0
  
    const NumberOfHours = []
  
    for (let i = 0; i < course.parts.length; i++) {
      NumberOfHours.push(course.parts[i].exercises);
    }
  
    const totalSum = NumberOfHours.reduce(
      (accumulatorValue, currentValue) => accumulatorValue + currentValue,
      IntitialTotalSum,
    );
  
    return (
      <div>
        <Header courseName={course.name} />
        <Content parts={course.parts} />
        <h3>total of {totalSum} exercises</h3>
      </div>
    )
}


export default Course