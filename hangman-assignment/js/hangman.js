// This branch:
// .: Två spelare option
// .: Reset game option
// .: startGame function
// .: getPlayerInfo function
// .: Uppdaterade wordList function

let approvedWordList = approvedWords(words);
let wordToGuess = '';

let correctGuesses = 0;
let guesses = [];
let pointsPlayerOne = 0;
let pointsPlayerTwo = 0;
let bodyParts = ['scaffold', 'head', 'body', 'arms', 'legs'];
let onePlayer;
let twoPlayers;
let round = 1;
let roundPlayerOne = 1;
let roundPlayerTwo = 1;

let ulEl = document.querySelector('.word');
let restartBtnList = document.querySelectorAll('.restart-btn');
let startBtn = document.getElementById('start-btn');
let resetBtn = document.getElementById('reset-btn');

/* -.-.-.-.- FUNCTIONS -.-.-.-.- */

// Funktion som startar spelet
function startGame() {
    // Tar bort antal-spelare-vyn och lägger till "press key" text
    document.querySelector('form').classList.remove('show');
    document.querySelector('footer p').classList.add('show');
    resetBtn.classList.add('show');

    console.log('Spelet startar');

    wordToGuess = generateWord();

    // Räcker om vi hämtar den ena?
    // const radioInputList = document.querySelectorAll('input');
    // onePlayer = radioInputList[0].checked;
    // twoPlayers = radioInputList[1].checked;

    twoPlayers = document.getElementById('two-players').checked;

    getPlayerInfo(1, pointsPlayerOne, roundPlayerOne)
    // document.getElementById('player-turn').innerHTML = 'Player 1 - your turn!';
    // document.getElementById('total-points').innerHTML = `Points: ${pointsPlayerOne}`;
    // document.getElementById('rounds').innerHTML = `Round: ${roundPlayerOne}`;
    roundPlayerOne++;

    // if (onePlayer) {
    //     console.log('en spelare vald');
    //     return onePlayer;
    // } else {
    //     console.log('två spelare vald');
    //     return twoPlayers;
    // }
    return twoPlayers;
};

// Funktion som skriver ut info för spelare
function getPlayerInfo(player, playerPoints, playerRound) {
    document.getElementById('player-info').innerHTML = `Round ${playerRound} - Player ${player}`;
    document.getElementById('total-points').innerHTML = `Player ${player} has ${playerPoints} points`;
}

// Funktion som genererar nytt ord och nollställer
function generateWord() {
    let index = getRandomIndex();
    let word = approvedWordList[index];
    approvedWordList.splice(index,1);
    correctGuesses = 0;
    guesses = [];
    bodyParts = ['scaffold', 'head', 'body', 'arms', 'legs'];

    // Rensar UI
    document.querySelector('figure').className = '';
    document.querySelector('.nomatch').innerHTML = '';
    ulEl.innerHTML = '';

    // Loopa och rendera ut box för varje bokstav i ordet
    for (let i = 0; i < word.length; i++) {
        let liEl = document.createElement('li');
        ulEl.appendChild(liEl);
    }

    console.log(word);
    return word;
}

// Funktion som tar bort oanvändbara ord ur listan
function approvedWords(wordList) {
    for (let i = 0; i < wordList.length; i++) {
        wordList[i] = wordList[i].toLowerCase();

        if (wordList[i].includes("-") || wordList[i].includes(" ")) {
            wordList.splice(i, 1);
        } 
    }
    return wordList;
}

// Funktion som tar fram ett slumpat index
function getRandomIndex() {
    let randomIndex = Math.floor(Math.random() * approvedWordList.length);
    return randomIndex;
}

// Funktion för att jämföra bokstav och rendera UI 
function rightGuess(letter, placement) {
    let letterList = document.querySelectorAll('li');
    letterList[placement].innerHTML = letter.toUpperCase();
}

// Funktion för att rendera ut UI vid felgissning
function wrongGuess() {
    document.querySelector('figure').classList.add(bodyParts[0]);
    bodyParts.shift();
}

/** -.-.-.-.- EVENT LISTENERS -.-.-.-.- */

startBtn.addEventListener('click', startGame);

document.addEventListener('keypress', function (event) {
    
    let letterExists = false;
    const guessedLetter = event.key;
    const alphabetRegExp = new RegExp('[a-zåäö]');

    // Kolla om event.key är en bokstav
    if (alphabetRegExp.test(guessedLetter)) {
        
        // Om bokstaven inte är gissad på förut
        if (guesses.indexOf(guessedLetter) === -1) {
            for (let i = 0; i < wordToGuess.length; i++) {
                if (guessedLetter === wordToGuess[i]) {
                    correctGuesses++;
                    rightGuess(guessedLetter, i);
                    letterExists = true;
                }
            }
        } else {
            letterExists = true;
        }
    
        // Lägger till bokstaven i gissningar
        guesses.push(guessedLetter);
    
        if (!letterExists) {
            wrongGuess();
            document.querySelector('.nomatch').innerHTML += event.key;
        }
        
        if (correctGuesses === wordToGuess.length) {
            // Om två spelare och jämn runda
            if (twoPlayers && round % 2 === 0) {
                // Ju fler bodyParts kvar i arrayen, ju mer poäng
                pointsPlayerTwo += bodyParts.length;
                console.log('Poäng till spelare två');
            } else {
                pointsPlayerOne += bodyParts.length;
                console.log('Poäng till spelare ett');
            }
            document.querySelector('.winning').classList.add('show');
            document.querySelector('.winning .right-word').innerHTML = wordToGuess.toUpperCase();
            document.querySelector('.points').innerHTML = bodyParts.length;
    
        } else if (bodyParts.length === 0) {
            document.querySelector('.game-over').classList.add('show');
            document.querySelector('.game-over .right-word').innerHTML = wordToGuess.toUpperCase();
        } 
    }
});

restartBtnList.forEach(button => {
    button.addEventListener('click', () => {
        wordToGuess = generateWord();
        document.querySelector('.show').classList.remove('show');

        // Om två spelare och det är har varit spelare två's tur
        if (twoPlayers && round % 2 === 0) {
            // document.getElementById('player-turn').innerHTML = 'Player 1 - your turn!';
            // document.getElementById('total-points').innerHTML = `Points: ${pointsPlayerOne}`;
            // document.getElementById('rounds').innerHTML = `Round: ${roundPlayerOne}`;
            console.log('Poäng för spelare 1 skrivs ut');
            getPlayerInfo(1, pointsPlayerOne, roundPlayerOne)
            roundPlayerOne++;

        // Om en spelare
        } else if (!twoPlayers) {
            console.log('Poäng för spelare 1 skrivs ut');
            getPlayerInfo(1, pointsPlayerOne, roundPlayerOne);
        
        // Om två spelare och det har varit spelare ett's tur
        } else {
            // document.getElementById('player-turn').innerHTML = 'Player 2 - your turn!';
            // document.getElementById('total-points').innerHTML = `Points: ${pointsPlayerTwo}`;
            // document.getElementById('rounds').innerHTML = `Round: ${roundPlayerTwo}`;
            console.log('Poäng för spelare 2 skrivs ut');
            getPlayerInfo(2, pointsPlayerTwo, roundPlayerTwo);
            roundPlayerTwo++;
        }

        round++;
    });
});

resetBtn.addEventListener('dblclick', () => {
    location.reload();
});

