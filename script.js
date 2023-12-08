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

  return { placeToken, board };
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

function GameController() {
  let gameIsOn = false;

  let gameboard;
  let playerX = Player('Player X', 'x');
  let playerO = Player('Player O', 'o');
  let activePlayer;

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

    gameIsOn = true;

    // console ui
    console.log('Game starts.');
    console.log(`Player X: ${playerXName}`);
    console.log(`Player O: ${playerOName}`);

    // print the board
    printBoard(gameboard.board);

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
      if (checkGameOver(gameboard.board)) {
        finishTheGame(activePlayer);
      }
      else {
        switchActivePlayer();

        // print the board
        printBoard(gameboard.board);

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
    currentToken = board[0][0].getValue();
    if (currentToken !== 'n') {
      let diagonalCurrentTokenCount = 1;
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
    currentToken = board[2][2].getValue();
    if (currentToken !== 'n') {
      diagonalCurrentTokenCount = 1;
      for (let i = 1; i >= 0; i--) {
        if (board[i][i].getValue() === currentToken) {
          diagonalCurrentTokenCount++;
        }
      }

      if (diagonalCurrentTokenCount === 3) {
        return true;
      }
    }

    return false;
  }

  function finishTheGame(winner) {
    // announce the winner
    console.log(`The winner is ${winner.name}.`);

    gameIsOn = false;
  }

  return { startGame, playRound };
}

const gc = GameController();
gc.startGame();