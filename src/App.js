import React, { useState, useEffect } from 'react';
import './App.css';

import images from './assets/images.js';

let unshuffledDeck = [];
const suits = ['s', 'd', 'h', 'c'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

for (let i = 0; i < ranks.length; i++) {
  for (let j = 0; j < suits.length; j++) {
    unshuffledDeck.push(`${ranks[i]}${suits[j]}`)
  }
}


const App = () => {
  const [deck, setDeck] = useState(unshuffledDeck);
  const [board, setBoard] = useState([]);
  const [dan, setDan] = useState(0);
  const [dave, setDave] = useState(0);
  const [message, setMessage] = useState([]);
  const [handNumber, setHandNumber] = useState(0);

  // on mount, and every new hand, get a new full shuffled deck
  useEffect(() => {
    setDeck(shuffle(unshuffledDeck))
  }, [handNumber])

  // when the board changes score the hand
  useEffect(() => {
    if (board.length) {
      scoreHand(board);
    }
  }, [board])

  const shuffle = originalArray => {
    const array = originalArray.slice(0);
  
    for (let i = (array.length - 1); i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
  
    return array;
  }

  const dealBoard = async () => {
    const cards = deck.slice(0, 5);
    setBoard(cards);
  }

  const scoreHand = raw => {
    console.log(raw);
    let redCount = 0;
    let flopS = 0;
    let flopD = 0;
    let flopH = 0;
    let flopC = 0;

    for (let i = 0; i < raw.length; i++) {
      if (raw[i][1] === 'h' || raw[i][1] === 'd') {
        redCount++
      }
    }

    for (let i = 0; i < 3; i++) {
      switch(raw[i][1]) {
        case 's':
          flopS++
          break;
        case 'd':
          flopD++
          break;
        case 'h':
          flopH++
          break;
        case 'c':
          flopC++
          break;
        
      }
    }

    let message = [];
    let danHand = 0;
    let daveHand = 0;

    if (raw.includes('3d')) {
      danHand++;
      message.push('Dan 3d')
    }
    
    if (redCount === 5) {
      danHand++;
      message.push('Dan all red')
    }
    
    if (flopD === 3 || flopH === 3) {
      danHand++;
      message.push('Dan flop monotone red')
    }
    
    if (raw.includes('Js')) {
      daveHand++
      message.push('Dave Js')
    }
    
    if (redCount === 0) {
      daveHand++
      message.push('Dave all Black')
    }
    
    if (flopS === 3 || flopC === 3) {
      daveHand++
      message.push('Dave flop monotone black')
    }

    setMessage(message);
    setDan(dan + danHand);
    setDave(dave + daveHand);
    setHandNumber(handNumber + 1);
  }

  return (
    <div className="App">
      <div>Hand Number: {handNumber}</div>
      <button onClick={dealBoard}>Deal</button>
      <div className="board">{board.map(card => <img key={card} className="card" src={images.find(image => image.title === card).src} />)}</div>
      <div className="score">
        <div>Dan: {dan}</div>
        <div>Dave: {dave}</div>
        <div className="messages">
          {message.map(message => <p key={Math.random()}>{message}</p>)}
        </div>
      </div>
      
    </div>
  );
}

export default App;
