import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect, useRef } from "react";
import alphabetArray from "./data";
import { allPlayersData } from "./data";

function App() {
  const timeRef = useRef(null);
  const [text, setText] = useState("");
  const [timerOn, setTimerOn] = useState(false);
  const [checkUserAnswer, setCheckUserAnswer] = useState("True");
  const [userAlphabet, setUserAlphabet] = useState("");
  const [count, setCount] = useState(0);
  const [winningText, setWinningText] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [countSeconds, setCountSeconds] = useState(0);
  const [bestTime, setBestTime] = useState("");
  const [countingWrong, setCountingWrong] = useState(0);
  let interval;


  function alphabetFinder(array) {
    const max = 26;
    for (let index = 0; index < 1; index++) {
      let random = Math.floor(Math.random() * max);
      const element = array[random];
      return element;
    }
  }

  function storingPlayerData(allPlayersData, totalTimePerPlayer) {
    let flag = false;
    for (let player in allPlayersData) {
      if (totalTimePerPlayer < allPlayersData[player]) {
        flag = true;
      }
    }
    if (flag) {
      allPlayersData[totalTimePerPlayer] = totalTimePerPlayer;
      setWinningText("Success");
    } else {
      allPlayersData[totalTimePerPlayer] = totalTimePerPlayer;
      setWinningText("You didn't beat the high score");
    }
  }

  function handleCheck(e) {
    setUserAlphabet(e.target.value);
    if (e.target.value === text) {
      setCheckUserAnswer("True");
      setTimeout(() => {
        setUserAlphabet("");
      }, 300);
      setCount((count) => count + 1);
    } else {
      setTimeout(() => {
        setUserAlphabet("");
      }, 300);
      setCheckUserAnswer("False");
      setUserAlphabet("");
      setCountingWrong((value) => value + 1);
    }
  }

  function handleReset() {
    const ff = localStorage.getItem("playersData");
    setSeconds(0);
    setCountSeconds(0);
    setCount(0);
    setTimerOn(false);
    setBestTime(ff);
  }

  useEffect(() => {
    if (timerOn) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
        setCountSeconds((value) => value + 1);
      }, 1000);
      timeRef.current = interval;
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerOn]);

  useEffect(() => {
    if (timerOn && checkUserAnswer === "True") {
      setText(alphabetFinder(alphabetArray));
    }
    if (count === 20) {
      clearInterval(timeRef.current);
      setSeconds(countSeconds => countSeconds + (countingWrong/2))
      storingPlayerData(allPlayersData, countSeconds + countingWrong / 2);
    }
  }, [count]);

  useEffect(() => {
    const arrayOfAllPlayersScore = Object.values(allPlayersData);
    const fastestScore = Math.min(...arrayOfAllPlayersScore);
    localStorage.setItem("playersData", fastestScore);
  }, [timerOn]);

  useEffect(() => {
    setBestTime(localStorage.getItem("playersData"));
  }, [timerOn]);

  useEffect(() => {
    if (seconds === 60) {
      setSeconds((sec) => (sec = 0));
      setMinutes((min) => min + 1);
    }
  }, [seconds, minutes]);

  useEffect(() => {
    if (checkUserAnswer === "True") {
      setText(alphabetFinder(alphabetArray));
    }
  }, [checkUserAnswer]);

  return (
    <div className="App">
      <div className="game__heading">Type The Alphabet</div>
      <div className="game__subheading">
        Typing Game to see how fast you can type.  Timer starts as soon as
        you type first letter. 0.5 seconds penalty for every wrong answer
      </div>
      <div className="alphabet__container">
        {count === 20 ? winningText : text}
      </div>

      <span className="timer__container">{`Time : ${
        minutes < 10 ? "0" + minutes : minutes
      }:${seconds < 10 ? "0" + seconds : seconds}`}</span>

      <input
        className="user__input__container"
        placeholder="Type here"
        value={userAlphabet}
        onChange={(e) => {
          setTimerOn(true);
          handleCheck(e);
        }}
      />
      {count === 20 ? (
        <span>
          <button onClick={() => handleReset()}>Reset</button>
        </span>
      ) : null}
      <div className="score__container">{`Current best score is : ${bestTime} seconds`}</div>
    </div>
  );
}

export default App;
