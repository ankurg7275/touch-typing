import "./App.css";
import React, { useState, useEffect } from "react";
import { useRef } from 'react';

const getCloud = ()=> `asdfjklaasdfjjjjjjklasdfjkl`.split('')
// .sort(()=> Math.random() > 0.5 ? 1: -1)

function Word(props){

  const { text, active, correct} = props


  if(correct === true){
    return <span className="correct">{text} </span>
  }

  if(correct === false){
    return <span className="incorrect">{text} </span>
  }
   
if(active){
  return <span className="active">{text} </span>
}
return <span>{text} </span>
}

Word = React.memo(Word)

function Timer(props) {

  const {correctWords, startCounting} = props
const [timeElapsed, setTimeElapsed] = useState(0)

useEffect(() => {
  let id
  if (props.startCounting) {
    id = setInterval(() => {
      setTimeElapsed(oldTime => {
        if (oldTime < 300) {
          return oldTime + 1;
        }
        return oldTime;
      });
    }, 1000);
  }

return () => {
  clearInterval(id)
}
},[startCounting])

const minutes = timeElapsed/60 

  return <div>
   <p>Time: {timeElapsed}</p>
   <p>Speed: {((correctWords/minutes) || 0).toFixed(0)} WPM</p>
   </div>
}

function App() {
const [userInput, setUserInput] = useState('');
const cloud = useRef(getCloud())

const [startCounting, setStartCounting] = useState(false)

const [activeWordIndex, setActiveWordIndex] = useState(0);
const [correctWordArray, setCorrectWordArray] = useState([])


function processInput(value) {
 
  if(activeWordIndex === cloud.current.length){
    return
    //stop
  }

  if(!startCounting){
  setStartCounting(true)
  }

  if(value.endsWith(' ')) { 
    // the user has finished this word

    if(activeWordIndex === cloud.current.length - 1){
     //overflow
     setStartCounting(false)
     setUserInput("Done")
    }
    else{
      setUserInput('')
    }

    setActiveWordIndex(index => index + 1)
    setUserInput('')

      // correct word
      setCorrectWordArray(data => {
        const word = value.trim()
        const newResult = [...data]
        newResult[activeWordIndex] = word === cloud.current[activeWordIndex]
      return newResult
      
      })
  }
  else{
    setUserInput(value)
  }
}



  return (
    <div>
      <img 
          src={require('./img.jpg')} 
          alt="logo"/>
      <h1> Start Typing </h1>

      <Timer 
      startCounting={startCounting}
      correctWords={correctWordArray.filter(Boolean).length}

      />

      <p>{cloud.current.map((word,index) =>{

         return <Word
          text={word} 
          active={index === activeWordIndex}
          correct={correctWordArray[index]}
          />

      })}</p>
      <input placeholder="Start typing" type="text" value={userInput} onChange={(e) =>
      processInput(e.target.value)} />


    </div>
  );
}

export default App;
