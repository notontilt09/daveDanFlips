import React, { useState, useEffect } from 'react';
import './App.css';

import images from './assets/images.js';

let unshuffledDeck = [];
const suits = ['s', 'd', 'h', 'c'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const initBoard = ['back', 'back', 'back', 'back', 'back'];

for (let i = 0; i < ranks.length; i++) {
  for (let j = 0; j < suits.length; j++) {
    unshuffledDeck.push(`${ranks[i]}${suits[j]}`)
  }
}

// helper function to create an array of all permutations of a flop.  ex:  345 return 333, 334, 335, 343, 344, 345...
const createCombos = arr => {
  // arr parameter should be an array with length 3 and we'll create the 27 (3*3*3) permutations of that array
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      for (let k = 0; k < arr.length; k++) {
        result.push([arr[i], arr[j], arr[k]])
      }
    }
  }
  return result;
}

// helper function to check if flop matches
const arraysEqual = (arr1, arr2) => {
  if(arr1.length !== arr2.length)
      return false;
  for(var i = arr1.length; i--;) {
      if(arr1[i] !== arr2[i])
          return false;
  }

  return true;
}

const danFlops = createCombos(['A', '6', '2']).concat(createCombos(['Q', 'J', '4'])).concat(createCombos(['K', '8', '7']));
const daveFlops = createCombos(['9', '8', '3']).concat(createCombos(['A', 'K', 'Q'])).concat(createCombos(['Q', '9', '2']));
const danBigBoy = createCombos(['3', '4', '5']);
const daveBigBoy = createCombos(['J', '10', '9']);

const App = () => {
  const [deck, setDeck] = useState(unshuffledDeck);
  const [board, setBoard] = useState([]);
  const [dan, setDan] = useState(0);
  const [dave, setDave] = useState(0);
  const [danMessage, setDanMessage] = useState([]);
  const [daveMessage, setDaveMessage] = useState([]);
  const [handNumber, setHandNumber] = useState(0);
  const [danMultiplier, setDanMultiplier] = useState(1);
  const [daveMultiplier, setDaveMultiplier] = useState(1);
  
  useEffect(() => {
    setBoard(initBoard);
  }, [])
  // on mount, and every new hand, get a new full shuffled deck
  useEffect(() => {
    setDeck(shuffle(unshuffledDeck))
  }, [handNumber])

  // when the board changes score the hand
  useEffect(() => {
    // scoreHand function called every time board updates
    const scoreHand = raw => {
      // counting number of red/black cards on board for all red/black
      if (raw.includes('back')) {
        return
      }
      let redCount = 0;
      let blackCount = 0;
      // variables to test for monotone flop
      let flopS = 0;
      let flopD = 0;
      let flopH = 0;
      let flopC = 0;

      // flop ranks for checking 3 card combinations on the board
      let flopRanks = raw.slice(0,3).map(card => {
        // if index 1 of the card is a suit, it's 2-9,JQKA.  If it's not, it's a 10
        if (['s', 'd', 'h', 'c'].includes(card[1])) {
          return card[0]
          // special case for 10
        } else {
          return card.slice(0, 2)
        }
      });

      let daveFlopMatches = 0;
      let danFlopMatches = 0;
      // loop through flop combos to see how many matches
      for (let i = 0; i < daveFlops.length; i++) {
        if (arraysEqual(daveFlops[i], flopRanks)) {
          daveFlopMatches++;
        }
        if (arraysEqual(danFlops[i], flopRanks)) {
          danFlopMatches++;
        }
      }

      let daveBigBoyMatches = 0;
      let danBigBoyMatches = 0;

      // loop through bigboy combos to see if matches
      for (let i = 0; i < daveBigBoy.length; i++) {
        if (arraysEqual(daveBigBoy[i], flopRanks)) {
          daveBigBoyMatches++;
        }
        if (arraysEqual(danBigBoy[i], flopRanks)) {
          danBigBoyMatches++;
        }
      }

      
      
      // count red/black cards on board
      for (let i = 0; i < raw.length; i++) {
        if (raw[i][1] === 'h' || raw[i][1] === 'd') {
          redCount++;
        } else if (raw[i][1] === 's' || raw[i][1] === 'c') {
          blackCount++;
        }
      }
      
      // count number of each suit on flop
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
          default:
            break;
          
        }
      }
      
      // message of all props hit
      let danText = [];
      let daveText = [];
      // final dan score for the hand
      let danHand = 0;
      // final dave score for the hand
      let daveHand = 0;
  
      if (raw.includes('3d')) {
        danHand++;
        danText.push('Dan 3d')
      }
      
      if (redCount === 5) {
        danHand++;
        danText.push('Dan all red')
      }
      
      if (flopD === 3 || flopH === 3) {
        danHand++;
        danText.push('Dan flop monotone red')
      }

      if (danFlopMatches) {
        danHand += danFlopMatches;
        // add multiple message for multiple flop combos
        for (let i = 0; i < danFlopMatches; i++) {
          danText.push('Dan flop combo');
        }
      }

      if (danBigBoyMatches) {
        danHand += 2;
        danText.push('Dan big boy flop');
      }
      
      if (raw.includes('Js')) {
        daveHand++;
        daveText.push('Dave Js');
      }
      
      if (blackCount === 5) {
        daveHand++;
        daveText.push('Dave all Black');
      }
      
      if (flopS === 3 || flopC === 3) {
        daveHand++;
        daveText.push('Dave flop monotone black');
      }

      if (daveFlopMatches) {
        daveHand += daveFlopMatches;
        // multiple message for multiple flop combos
        for (let i = 0; i < daveFlopMatches; i++) {
          daveText.push('Dave flop combo');
        }
      }

      if (daveBigBoyMatches) {
        daveHand += 2;
        daveText.push('Dave big boy flop');
      }
  
      setDanMessage(danText);
      setDaveMessage(daveText);
      setDan(dan => dan + danHand * danMultiplier);
      setDave(dave => dave + daveHand * daveMultiplier);
      setHandNumber(handNumber => handNumber + 1);

      if (danHand > daveHand) {
        setDaveMultiplier(1);
        if (danMultiplier < 3) {
          setDanMultiplier(danMultiplier + 1);
        }
      } else if (daveHand > danHand) {
        setDanMultiplier(1);
        if (daveMultiplier < 3) {
          setDaveMultiplier(daveMultiplier + 1);
        }
      }
    }

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

  

  return (
    <div className="App">
        <div className="container">
          <section className="scoreboard">
            <div className="counter">{`Hand ${handNumber}`}</div>
            <div className="topRow">
              <div className="home">
                <h2 className="home__name">Dan<span className="multiplier">{` ${danMultiplier}x`}</span></h2>

                {/* TODO STEP 3 - We need to change the hardcoded values in these divs to accept dynamic values from our state. */}

                <div className="home__score">{dan}</div>
                <div className="messages">
                  {danMessage &&
                    danMessage.map(message => <p key={Math.random()} className="message">{message}</p>)
                  }
                </div>
              </div>
              <div className="away">
                <h2 className="away__name">Dave<span className="multiplier">{` ${daveMultiplier}x`}</span></h2>
                <div className="away__score">{dave}</div>
                <div className="messages">
                  {daveMessage &&
                    daveMessage.map(message => <p key={Math.random()} className="message">{message}</p>)
                  }
                </div>
              </div>
            </div>
              <button className="deal" onClick={dealBoard}>Deal</button>
          </section>
        </div>
      <div className="board">
        {board.map(card => <img key={Math.random()} className="card" src={images.find(image => image.title === card).src} alt={card} />
        )}
      </div>
    </div>
  );
}

export default App;
