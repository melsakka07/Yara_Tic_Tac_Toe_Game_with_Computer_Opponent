import './style.css';
import { createConfetti } from './confetti.js';

// Game state
let board = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;
let scores = {
  player: 0,
  computer: 0,
  ties: 0
};

// DOM elements
const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset-button');
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const tiesElement = document.getElementById('ties');

// Winning combinations
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize the game
function initGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o', 'winning-cell');
  });
  
  updateStatus('Your turn (X)');
}

// Update the status message
function updateStatus(message) {
  statusElement.textContent = message;
}

// Update the score display
function updateScoreDisplay() {
  playerScoreElement.textContent = scores.player;
  computerScoreElement.textContent = scores.computer;
  tiesElement.textContent = scores.ties;
}

// Check if there's a winner
function checkWinner() {
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      highlightWinningCells(combo);
      return board[a];
    }
  }
  
  if (!board.includes('')) {
    return 'tie';
  }
  
  return null;
}

// Highlight the winning cells
function highlightWinningCells(combo) {
  combo.forEach(index => {
    cells[index].classList.add('winning-cell');
  });
}

// Handle the end of the game
function handleGameEnd(result) {
  gameActive = false;
  
  if (result === 'tie') {
    updateStatus('Game ended in a tie!');
    scores.ties++;
  } else {
    const winner = result === 'X' ? 'You' : 'Computer';
    updateStatus(`${winner} won the game!`);
    
    if (result === 'X') {
      scores.player++;
      createConfetti();
    } else {
      scores.computer++;
    }
  }
  
  updateScoreDisplay();
}

// Make a move
function makeMove(index, player) {
  if (board[index] === '' && gameActive) {
    board[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add(player.toLowerCase());
    
    const winner = checkWinner();
    if (winner) {
      handleGameEnd(winner);
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updateStatus(currentPlayer === 'X' ? 'Your turn (X)' : 'Computer thinking...');
      
      if (currentPlayer === 'O' && gameActive) {
        setTimeout(computerMove, 700);
      }
    }
  }
}

// Computer's move
function computerMove() {
  if (!gameActive) return;
  
  // Try to win
  const winningMove = findBestMove('O');
  if (winningMove !== -1) {
    makeMove(winningMove, 'O');
    return;
  }
  
  // Try to block player
  const blockingMove = findBestMove('X');
  if (blockingMove !== -1) {
    makeMove(blockingMove, 'O');
    return;
  }
  
  // Take center if available
  if (board[4] === '') {
    makeMove(4, 'O');
    return;
  }
  
  // Take a corner
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(index => board[index] === '');
  if (availableCorners.length > 0) {
    const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
    makeMove(randomCorner, 'O');
    return;
  }
  
  // Take any available cell
  const availableCells = board.map((cell, index) => cell === '' ? index : -1).filter(index => index !== -1);
  if (availableCells.length > 0) {
    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    makeMove(randomIndex, 'O');
  }
}

// Find the best move for the given player
function findBestMove(player) {
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    // Check if we can win in one move
    if (board[a] === player && board[b] === player && board[c] === '') {
      return c;
    }
    if (board[a] === player && board[c] === player && board[b] === '') {
      return b;
    }
    if (board[b] === player && board[c] === player && board[a] === '') {
      return a;
    }
  }
  return -1;
}

// Event listeners
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = parseInt(cell.getAttribute('data-index'));
    if (currentPlayer === 'X' && gameActive) {
      makeMove(index, 'X');
    }
  });
});

resetButton.addEventListener('click', initGame);

// Initialize the game
initGame();
