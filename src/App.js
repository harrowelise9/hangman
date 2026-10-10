import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [hint, setHint] = useState('');
  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState([]);

  useEffect(() => {
    fetch('/words.json')
      .then((response) => response.json())
      .then((json) => {
        setData(json);

        if (json.length > 0) {
          const random = Math.floor(Math.random() * json.length);
          setHint(json[random].hint);
          setWord(json[random].word);
          setGuessed([]);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  function randomGenerator() {
    if (!data || data.length === 0) return;

    const random = Math.floor(Math.random() * data.length);
    setHint(data[random].hint);
    setWord(data[random].word);
    setGuessed([]);
  }

  function handleGuess(letter) {
    if (!word || guessed.includes(letter) || wrongCount >= 10) return;

    setGuessed((prev) => [...prev, letter]);
  }

  const normalizedWord = word.toLowerCase();
  const wrongCount = guessed.filter((letter) => !normalizedWord.includes(letter)).length;
  const guessedSet = new Set(guessed);
  const isGameOver = wrongCount >= 10;

  const visibleWord = word
    ? word
        .split('')
        .map((char) => {
          if (char === ' ') return '   ';
          const lower = char.toLowerCase();
          return guessedSet.has(lower) || /[a-z]/i.test(char) === false ? char : '_';
        })
        .join(' ')
    : '';

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const fallingOffset = Math.min(wrongCount * 22, 210);
  const finalImpactOffset = 210;
  const fallingTranslate = isGameOver ? finalImpactOffset : Math.min(wrongCount * 22, finalImpactOffset - 10);

  return (
    <div className="game">
      <div className="scene" aria-label="Hangman scene">
        <img
          className="falling-image"
          src="/falling.png"
          alt="Falling character"
          style={{ transform: `translateY(${fallingTranslate}px)` }}
        />

        <img className="fire-image" src="/fire.png" alt="Fire" />
      </div>

      <div className="status">
        <h1>{hint}</h1>
        <h2 style={{ whiteSpace: 'pre' }}>{visibleWord}</h2>
        <p>Wrong guesses: {wrongCount}/10</p>
        {isGameOver && <p className="game-over">You lost! The word was: {word}</p>}
      </div>

      <button className="new-word" onClick={randomGenerator}>New word</button>

      <div className="letters">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={guessed.includes(letter) || isGameOver}
            className={guessed.includes(letter) ? 'used' : ''}
          >
            {letter.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
