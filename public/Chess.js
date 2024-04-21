document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("board");
    const spinButton = document.getElementById("spinButton");
    const winnerDisplay = document.getElementById("winnerDisplay");
    let isWhiteTurn = true;
    let gameOver = false;

    // Function to create the chessboard with two rooks
    function createBoard() {
        let html = '';

        for (let row = 8; row >= 1; row--) {
            html += '<div class="divv" id="row' + row + '">';

            for (let col = 1; col <= 8; col++) {
                const pieceClass = (row === 1 && col === 1) ? 'Wrook' : ((row === 8 && col === 8) ? 'Brook' : '');
                html += '<div class="box ' + pieceClass + '" id="b' + row + col + '"></div>';
            }

            html += '</div>';
        }

        board.innerHTML = html;
    }

    createBoard();

    // Function to move the rook automatically
    function moveRookAutomatically() {
        if (gameOver) return;

        const rookClass = isWhiteTurn ? 'Wrook' : 'Brook';
        const rook = document.querySelector('.' + rookClass);
        const currentSquare = rook.parentNode;
        const currentRow = parseInt(currentSquare.id.substring(3, 4));
        const currentCol = parseInt(currentSquare.id.substring(4, 5));

        const newRow = Math.floor(Math.random() * 8) + 1;
        const newCol = Math.floor(Math.random() * 8) + 1;

        const newSquare = document.getElementById('b' + newRow + newCol);
        const newRook = newSquare.querySelector('.box');

        if (!newRook) {
            currentSquare.removeChild(rook);
            newSquare.appendChild(rook);
            isWhiteTurn = !isWhiteTurn;
            document.getElementById('tog').innerText = isWhiteTurn ? "White's Turn" : "Black's Turn";

            if ((isWhiteTurn && newRow === 1 && newCol === 1) || (!isWhiteTurn && newRow === 8 && newCol === 8)) {
                gameOver = true;
                winnerDisplay.innerText = isWhiteTurn ? "White wins!" : "Black wins!";
                animateWin(newSquare);
            }
        }
    }

    // Function to animate winning rook
    function animateWin(square) {
        square.style.backgroundColor = "gold"; // Example animation, change as needed
        // You can add more complex animations here
    }

    // Event listener for spin button click
    spinButton.addEventListener('click', () => {
        moveRookAutomatically();
    });
});
