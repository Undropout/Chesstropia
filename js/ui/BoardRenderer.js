/**
 * @file BoardRenderer.js
 * Responsible for rendering the game board, pieces, and their states visually in the DOM.
 * It listens to events from the GameController to update the UI.
 */
class BoardRenderer {
    /**
     * Initializes the BoardRenderer.
     * @param {HTMLElement} container - The DOM element to render the board into.
     * @param {EventEmitter} eventEmitter - The central event bus for the application.
     */
    constructor(container, eventEmitter) {
        this.container = container;
        this.eventEmitter = eventEmitter;
        this.boardElement = null;
        this.pieceElements = new Map(); // Maps piece ID to its DOM element.

        this.bindEvents();
    }

    /**
     * Binds to events from the EventEmitter to know when to update the view.
     */
    bindEvents() {
        this.eventEmitter.on('gameStarted', this.handleGameStarted.bind(this));
        this.eventEmitter.on('pieceMoved', this.handlePieceMoved.bind(this));
        this.eventEmitter.on('pieceCaptured', this.handlePieceCaptured.bind(this));
        this.eventEmitter.on('pieceSelected', this.handlePieceSelected.bind(this));
        this.eventEmitter.on('pieceDeselected', this.handlePieceDeselected.bind(this));
        this.eventEmitter.on('pieceKinged', this.handlePieceKinged.bind(this));
        this.eventEmitter.on('emotionalStateChanged', this.handleEmotionalStateChanged.bind(this));
    }

    /**
     * Handles the initial setup of the board when a game starts.
     * @param {object} gameData - Data from the 'gameStarted' event.
     */
    handleGameStarted(gameData) {
        this.renderBoard();
        this.renderPieces(gameData.pieces, gameData.board);
    }

    /**
     * Creates the 8x8 grid of squares.
     */
    renderBoard() {
        this.container.innerHTML = '';
        this.boardElement = document.createElement('div');
        this.boardElement.className = 'board';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = 'square';
                square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
                square.dataset.row = row;
                square.dataset.col = col;
                this.boardElement.appendChild(square);
            }
        }

        // Add a single event listener to the board for handling clicks on squares.
        this.boardElement.addEventListener('click', (e) => {
            const square = e.target.closest('.square');
            if (square) {
                const { row, col } = square.dataset;
                this.eventEmitter.emit('squareClicked', { row: parseInt(row), col: parseInt(col) });
            }
        });

        this.container.appendChild(this.boardElement);
    }

    /**
     * Creates and places the initial piece elements on the board.
     * @param {Piece[]} pieces - An array of all piece instances.
     * @param {Board} board - The game board instance to get piece positions.
     */
    renderPieces(pieces, board) {
        this.pieceElements.clear();
        pieces.forEach(piece => {
            const pos = board.getPiecePosition(piece.id);
            if (pos) {
                const pieceElement = this.createPieceElement(piece);
                this.pieceElements.set(piece.id, pieceElement);
                this.getSquareElement(pos.row, pos.col).appendChild(pieceElement);
            }
        });
    }

    /**
     * Creates the DOM element for a single piece.
     * @param {Piece} piece - The piece data.
     * @returns {HTMLElement} The created piece element.
     */
    createPieceElement(piece) {
        const pieceElement = document.createElement('div');
        pieceElement.id = `piece-${piece.id}`;
        pieceElement.className = 'piece';
        pieceElement.classList.add(piece.owner === 'player' ? 'player-piece' : 'opponent-piece');
        pieceElement.textContent = piece.icon; // Use the emoji icon
        return pieceElement;
    }

    /**
     * Updates a piece's position in the DOM.
     * @param {object} data - Event data: { piece, from, to }.
     */
    handlePieceMoved({ piece, to }) {
        const pieceElement = this.pieceElements.get(piece.id);
        const targetSquare = this.getSquareElement(to.row, to.col);
        if (pieceElement && targetSquare) {
            targetSquare.appendChild(pieceElement);
        }
    }

    /**
     * Removes a captured piece's element from the DOM.
     * @param {object} data - Event data: { capturedPiece }.
     */
    handlePieceCaptured({ capturedPiece }) {
        const pieceElement = this.pieceElements.get(capturedPiece.id);
        if (pieceElement) {
            pieceElement.remove();
            this.pieceElements.delete(capturedPiece.id);
        }
    }

    /**
     * Highlights the selected piece and its valid moves.
     * @param {object} data - Event data: { piece, validMoves }.
     */
    handlePieceSelected({ piece, validMoves }) {
        this.clearHighlights();
        const pieceElement = this.pieceElements.get(piece.id);
        if (pieceElement) {
            pieceElement.classList.add('selected');
        }
        validMoves.forEach(move => {
            const square = this.getSquareElement(move.to.row, move.to.col);
            if (square) {
                square.classList.add('valid-move');
            }
        });
    }

    /**
     * Clears all selection and move highlights from the board.
     */
    handlePieceDeselected() {
        this.clearHighlights();
    }

    /**
     * Updates a piece's appearance when it becomes a king.
     * @param {object} data - Event data: { piece }.
     */
    handlePieceKinged({ piece }) {
        const pieceElement = this.pieceElements.get(piece.id);
        if (pieceElement) {
            pieceElement.classList.add('king');
        }
    }
    
    /**
     * Updates a piece's appearance based on its emotional state.
     * @param {object} data - Event data: { piece, newState }.
     */
    handleEmotionalStateChanged({ piece, newState }) {
        const pieceElement = this.pieceElements.get(piece.id);
        if (pieceElement) {
            // Remove any existing emotional state classes
            pieceElement.classList.remove('anxious', 'shutdown', 'fight', 'freeze', 'fawn');
            // Add the new state class, if it's not regulated
            if (newState !== 'regulated') {
                pieceElement.classList.add(newState);
            }
        }
    }

    /**
     * Helper function to clear all visual highlights.
     */
    clearHighlights() {
        document.querySelectorAll('.piece.selected').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('.square.valid-move').forEach(el => el.classList.remove('valid-move'));
    }

    /**
     * Helper function to get a square's DOM element by its coordinates.
     * @param {number} row 
     * @param {number} col 
     * @returns {HTMLElement|null}
     */
    getSquareElement(row, col) {
        return this.boardElement.querySelector(`.square[data-row='${row}'][data-col='${col}']`);
    }
}

export default BoardRenderer;
