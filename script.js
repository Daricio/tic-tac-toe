// Objects - Gameboard, Player, Game
// as little global code as possible
// factory functions, the module pattern
// put each bit of logic in logical places

// Advices:
// 1. To not think about UI build the game so that it can be played in the console

/* 
Let's pretend the game is only in our imagination, like we are Komugi

  Gameboard - module pattern
  -columns (3)
  -rows (3)
  -board - array of Cells
  -add token to a cell()

  Cell - factory function
  -value: n, x, or o
  -get value()
  -add token()

  Player
  -name
  -token

  GameController
  board
  players
  active player
  game on
  -start the game
    -create empty board
    -create players (set names of x and o players)
    -set active player (x)
    -set game on
  -play round
    -choose a cell
    -add token to that cell
    -switch players
    -check for game over
      -check all rows
      -check all columns
      -check all diagonals
    -if true set game off()
  -refresh when game over
    -start the game

  when game on we can play round
  when game off we can start the game

*/

// factory functions
function Gameboard() {
  const rows = 3;
  const columns = 3;
  
  const board = [];
  for (i = 0; i < rows; i++) {
    board[i] = [];
    for (j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  function placeToken(row, column, player) {
    // check if available
    const selectedCell = board[row][column];
    // return whether a token was placed
    if (selectedCell.getValue() !== 'n') {
      return false;
    }
    else {
      selectedCell.addToken(player.token);
      return true;
    }
    // return (selectedCell.getValue() === 'n') ? false : selectedCell.addToken(player.token) | true;
  }

  function getBoard() {
    return board;
  }

  return { placeToken, getBoard };
}


function Cell() {
  let value = 'n';

  const getValue = () => value;

  const addToken = token => {
    value = token;
  }

  return { getValue, addToken };
}


function Player(name, token) {
  return { name, token };
}


// TODO: - Put start game logic in a module
// - Add styles to everything related to start game action
function GameController() {
  let gameIsOn = false;

  let gameboard;
  let playerX = Player('Player X', 'x');
  let playerO = Player('Player O', 'o');
  let activePlayer;
  let winner;
  let roundsLeft;

  function printBoard(board) {
    for (let i = 0; i < 3; i++) {
      let row = '';
      for (let j = 0; j < 3; j++) {
        row += board[i][j].getValue();
      }
      console.log(row);
    }
  }

  function announceActivePlayer() {
    console.log(`${activePlayer.name}\'s turn.`);
  }

  function startGame(playerXName = 'Player X', playerOName = 'Player O') {
    gameboard = new Gameboard();

    playerX.name = playerXName;
    playerO.name = playerOName;

    activePlayer = playerX;

    winner = null;
    roundsLeft = 9;

    gameIsOn = true;

    // console ui
    console.log('Game starts.');
    console.log(`Player X: ${playerXName}`);
    console.log(`Player O: ${playerOName}`);

    // print the board
    printBoard(gameboard.getBoard());

    // announce active player
    announceActivePlayer();
  }

  function switchActivePlayer() {
    activePlayer = (activePlayer === playerX) ? playerO : playerX;
  }

  function playRound(row, column) {
    if (gameIsOn === false) {
      console.log('Start the game first');
      return;
    }

    if (gameboard.placeToken(row, column, activePlayer)) {
      if (checkGameOver(gameboard.getBoard())) {
        winner = activePlayer;
        finishGame();
        return;
      }
      else {
        roundsLeft--;
        if (roundsLeft === 0) {
          finishGame();
          return;
        }

        switchActivePlayer();

        // print the board
        printBoard(gameboard.getBoard());

        // announce active player
        announceActivePlayer();
      }
    } else {
      console.log('Selected cell is unavailable');
    }
  }

  function checkGameOver(board) {
    let currentToken;

    // check rows
    for (let i = 0; i < 3; i++) {
      const currentRow = board[i];
      currentToken = currentRow[0].getValue();

      if (currentToken !== 'n') {
        const currentTokenRowCount = currentRow.filter(cell => cell.getValue() === currentToken);
        if (currentTokenRowCount.length === 3) {
          return true;
        }
      }
    }

    // check columns
    for (let i = 0; i < 3; i++) {
      currentToken = board[0][i].getValue();

      if (currentToken !== 'n') {
        let currentTokenColumnCount = 1;

        for (let j = 1; j < 3; j++) {
          if (board[j][i].getValue() === currentToken) {
            currentTokenColumnCount++;
          }
        }

        if (currentTokenColumnCount === 3) {
          return true;
        }
      }
    }

    // check diagonals
    // first
    let diagonalCurrentTokenCount;
    currentToken = board[0][0].getValue();
    if (currentToken !== 'n') {
      diagonalCurrentTokenCount = 1;
      for (let i = 1; i < 3; i++) {
        if (board[i][i].getValue() === currentToken) {
          diagonalCurrentTokenCount++;
        }
      }

      if (diagonalCurrentTokenCount === 3) {
        return true;
      }
    }

    // second
    currentToken = board[0][2].getValue();
    if (currentToken !== 'n') {
      diagonalCurrentTokenCount = 1;
      let i = 1;
      let j = 1;
      if (board[i][j].getValue() === currentToken) {
        diagonalCurrentTokenCount++;
      }
      i++;
      j--;
      if (board[i][j].getValue() === currentToken) {
        diagonalCurrentTokenCount++;
      }

      if (diagonalCurrentTokenCount === 3) {
        return true;
      }
    }

    // currentToken = board[2][2].getValue();
    // if (currentToken !== 'n') {
    //   diagonalCurrentTokenCount = 1;
    //   for (let i = 1; i >= 0; i--) {
    //     if (board[i][i].getValue() === currentToken) {
    //       diagonalCurrentTokenCount++;
    //     }
    //   }

    //   if (diagonalCurrentTokenCount === 3) {
    //     return true;
    //   }
    // }

    return false;
  }

  function finishGame() {
    // winner = newWinner;

    // announce the winner
    let winnerAnnouncement;
    if (winner !== null) {
      winnerAnnouncement = `The winner is ${winner.name}.`;
    }
    else {
      winnerAnnouncement = `A tie.`;
    }
    console.log(winnerAnnouncement);

    gameIsOn = false;
  }

  function getGameboard() {
    return gameboard;
  }

  function getPlayerX() {
    return playerX;
  }

  function getPlayerO() {
    return playerO;
  }

  function getActivePlayer() {
    return activePlayer;
  }

  function getWinner() {
    return winner;
  }

  function getGameIsOn() {
    return gameIsOn;
  }

  return { startGame, playRound, getGameboard, getPlayerX, getPlayerO, getActivePlayer, getWinner, getGameIsOn };
}

/*
  GUI
  DisplayController
*/

function DisplayController() {
  const gc = GameController();

  const gameboardDiv = document.getElementById('gameboard');
  const gameInfoDiv = document.querySelector('.announcements .game');
  const roundInfoDiv = document.querySelector('.announcements .round');

  let cellDivs;
  let gameInfoText;
  let roundInfoText;

  function start(playerXName, playerOName) {
    console.log(gc.getGameboard());
    gc.startGame(playerXName, playerOName);
    console.log(gc.getGameboard());
    updateCellDivs(gc.getGameboard().getBoard());
    bindEvents();
    gameInfoText = `${gc.getPlayerX().name}(X) VS ${gc.getPlayerO().name}(O)`;
    roundInfoText = `${gc.getActivePlayer().name}\'s turn.`;
    updateDisplay();
  }

  // create board
  function updateCellDivs(board) {
    cellDivs = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.dataset.row = i;
        cellDiv.dataset.column = j;

        const cellValue = board[i][j].getValue();
        if (cellValue !== 'n') {
          cellDiv.textContent = board[i][j].getValue();
        }
        // cellDiv.textContent = board[i][j].getValue();
        // cellDiv.dataset.value = board[i][j].getValue();

        cellDivs.push(cellDiv);
      }
    }
  }

  // update display
  function updateDisplay() {
    // announcementDiv.textContent = announcementText;
    gameInfoDiv.textContent = gameInfoText;
    roundInfoDiv.textContent = roundInfoText;

    gameboardDiv.textContent = "";

    for (const cellDiv of cellDivs) {
      gameboardDiv.appendChild(cellDiv);
    }
  }

  // bind events
  function bindEvents() {
    for (const cellDiv of cellDivs) {
      cellDiv.addEventListener('click', cellClickEventHandler);
    }
  }

  // cell click event handler
  function cellClickEventHandler(e) {
    const cellDiv = e.target;
    gc.playRound(cellDiv.dataset.row, cellDiv.dataset.column);
    updateCellDivs(gc.getGameboard().getBoard());
    if (!gc.getGameIsOn()) {
      const winner = gc.getWinner();
      if (winner !== null) {
        gameInfoText = `The winner is ${gc.getWinner().name}.`;
      }
      else {
        gameInfoText = "A tie."
      }
      // gameInfoText = `The winner is ${gc.getWinner().name}.`;
      roundInfoText = '';
    }
    else {
      roundInfoText = `${gc.getActivePlayer().name}\'s turn.`;
      bindEvents();
    }
    updateDisplay();
  }

  return { start };
}

const dc = DisplayController();
// dc.start();



const startGameButton = document.getElementById("start-game-btn");
const playerNamesDialog = document.getElementById("player-names-dialog");
const playerXNameInput = document.getElementById("playerX-name");
const playerONameInput = document.getElementById("playerO-name");
const confirmButton = document.getElementById("confirm-btn");
const cancelButton = document.getElementById("cancel-btn");

startGameButton.addEventListener("click", (e) => {
  playerNamesDialog.showModal();
});

confirmButton.addEventListener("click", (e) => {
  // prevent form submit
  e.preventDefault();

  // start game
  const playerXName = playerXNameInput.value;
  const playerOName = playerONameInput.value;

  if (playerXName === "") {
    if (playerOName === "") {
      dc.start();
    }
    else {
      dc.start(undefined, playerOName);
    }
  }
  else if (playerOName === "") {
    dc.start(playerXName, undefined);
  }
  else {
    dc.start(playerXName, playerOName);
  }

  // replace start button text with "restart"
  startGameButton.textContent = "Restart game";

  playerNamesDialog.close();

});