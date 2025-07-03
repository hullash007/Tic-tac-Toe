const cellElements = document.querySelectorAll('[data-cell]');
const statusMessage = document.getElementById('status-message');
const restartButton = document.getElementById('restartButton');
let isCircleTurn = false; // False because player X starts first

// Start the game
startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
  isCircleTurn = false; // Player X always starts
  statusMessage.textContent = "Your turn"; // Display player's turn
  cellElements.forEach(cell => {
    cell.classList.remove('x');
    cell.classList.remove('circle');
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
}

function handleClick(e) {
  const cell = e.target;
  if (!isCircleTurn) {
    // Player X's move
    placeMark(cell, 'x');

    if (checkWin('x')) {
      statusMessage.textContent = "You Win!";
      endGame();
      return;
    } else if (isDraw()) {
      statusMessage.textContent = "It's a Draw!";
      endGame();
      return;
    }

    // Switch to computer's turn after player move
    isCircleTurn = true;
    statusMessage.textContent = "Computer's turn";
    setTimeout(computerMove, 500); // Small delay before computer plays
  }
}

function computerMove() {
  const bestMove = getBestMove();
  if (bestMove !== -1) {
    placeMark(cellElements[bestMove], 'circle');

    if (checkWin('circle')) {
      statusMessage.textContent = "Computer Wins!";
      endGame();
      return;
    } else if (isDraw()) {
      statusMessage.textContent = "It's a Draw!";
      endGame();
      return;
    }

    // After computer's move, switch back to player
    isCircleTurn = false;
    statusMessage.textContent = "Your turn";
  }
}

function getBestMove() {
  let bestScore = -Infinity;
  let bestMove = -1;
  
  for (let i = 0; i < 9; i++) {
    if (!cellElements[i].classList.contains('x') && !cellElements[i].classList.contains('circle')) {
      // Try this move
      cellElements[i].classList.add('circle');
      let score = minimax(false, 0);
      cellElements[i].classList.remove('circle');
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  
  return bestMove;
}

function minimax(isMaximizing, depth) {
  // Check terminal states
  if (checkWin('circle')) {
    return 10 - depth; // AI wins, prefer winning sooner
  }
  if (checkWin('x')) {
    return depth - 10; // Player wins, prefer losing later
  }
  if (isDraw()) {
    return 0; // Draw
  }
  
  if (isMaximizing) {
    // AI's turn (maximizing)
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!cellElements[i].classList.contains('x') && !cellElements[i].classList.contains('circle')) {
        cellElements[i].classList.add('circle');
        let score = minimax(false, depth + 1);
        cellElements[i].classList.remove('circle');
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    // Player's turn (minimizing)
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!cellElements[i].classList.contains('x') && !cellElements[i].classList.contains('circle')) {
        cellElements[i].classList.add('x');
        let score = minimax(true, depth + 1);
        cellElements[i].classList.remove('x');
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function checkWin(currentClass) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winningCombinations.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains('x') || cell.classList.contains('circle');
  });
}

function endGame() {
  cellElements.forEach(cell => {
    cell.removeEventListener('click', handleClick); // Stop further clicks after game ends
  });
}
