/**
 * @file Board.js
 * Represents the 8x8 game board for ChessTropia. It manages the state of the grid,
 * the placement of pieces, and calculates valid moves according to checkers rules.
 */

import Piece from './Piece.js';

/**
 * @class Board
 * Manages the game board, pieces, and move validation.
 */
class Board {
    /**
     * Initializes the Board instance.
     * @param {EventEmitter} eventEmitter - The central event bus.
     */
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
        this.grid = this.createGrid(); // 8x8 grid, where null represents an empty square.
        this.piecePositions = new Map(); // Maps piece ID to its {row, col} for quick lookups.
    }

    /**
     * Creates an 8x8 grid initialized with null values.
     * @returns {Array<Array<Piece|null>>} The 8x8 grid.
     */
    createGrid() {
        return Array(8).fill(null).map(() => Array(8).fill(null));
    }

    /**
     * Adds a piece to a specific square on the board.
     * @param {Piece} piece - The piece instance to add.
     * @param {number} row - The row to place the piece on.
     * @param {number} col - The column to place the piece on.
     */
    addPiece(piece, row, col) {
        if (this.isValidSquare(row, col)) {
            this.grid[row][col] = piece;
            this.piecePositions.set(piece.id, { row, col });
        }
    }

    /**
     * Removes a piece from a specific square on the board.
     * @param {number} row - The row of the piece to remove.
     * @param {number} col - The column of the piece to remove.
     * @returns {Piece|null} The piece that was removed, or null.
     */
    removePiece(row, col) {
        if (this.isValidSquare(row, col) && this.grid[row][col]) {
            const piece = this.grid[row][col];
            this.grid[row][col] = null;
            this.piecePositions.delete(piece.id);
            return piece;
        }
        return null;
    }

    /**
     * Moves a piece from its current position to a new one.
     * @param {Piece} piece - The piece to move.
     * @param {number} toRow - The destination row.
     * @param {number} toCol - The destination column.
     */
    movePiece(piece, toRow, toCol) {
        const from = this.piecePositions.get(piece.id);
        if (from) {
            this.grid[from.row][from.col] = null;
            this.grid[toRow][toCol] = piece;
            this.piecePositions.set(piece.id, { row: toRow, col: toCol });
        }
    }

    /**
     * Gets the piece at a given square.
     * @param {number} row - The row of the square.
     * @param {number} col - The column of the square.
     * @returns {Piece|null} The piece at the location, or null if empty.
     */
    getPieceAt(row, col) {
        if (this.isValidSquare(row, col)) {
            return this.grid[row][col];
        }
        return null;
    }

    /**
     * Gets the position of a piece by its ID.
     * @param {string} pieceId - The unique ID of the piece.
     * @returns {{row: number, col: number}|undefined} The position of the piece.
     */
    getPiecePosition(pieceId) {
        return this.piecePositions.get(pieceId);
    }

    /**
     * Checks if a square's coordinates are within the board's bounds.
     * @param {number} row - The row to check.
     * @param {number} col - The column to check.
     * @returns {boolean} True if the square is on the board.
     */
    isValidSquare(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
    
    /**
     * Gets all pieces on the board belonging to a specific owner.
     * @param {string} owner - 'player' or 'opponent'.
     * @returns {Piece[]} An array of pieces.
     */
    getPlayerPieces(owner) {
        const pieces = [];
        for (const [pieceId, pos] of this.piecePositions.entries()) {
            const piece = this.grid[pos.row][pos.col];
            if (piece && piece.owner === owner) {
                pieces.push(piece);
            }
        }
        return pieces;
    }

    /**
     * NEW HELPER METHOD: Gathers all possible capture moves for a given player.
     * @param {string} owner - 'player' or 'opponent'.
     * @returns {Array<{piece: Piece, move: object}>} An array of all possible captures.
     */
    getAllCaptureMovesForPlayer(owner) {
        const allPieces = this.getPlayerPieces(owner);
        let allCaptureMoves = [];
        for (const piece of allPieces) {
            const captures = this.getCaptureMovesForPiece(piece);
            captures.forEach(move => allCaptureMoves.push({ piece, move }));
        }
        return allCaptureMoves;
    }

    /**
     * Calculates all valid moves for a given piece, considering forced captures.
     * @param {Piece} piece - The piece to calculate moves for.
     * @param {boolean} forceCaptures - If true, enforces the mandatory capture rule.
     * @returns {Array<object>} An array of valid move objects.
     */
    getValidMoves(piece, forceCaptures = true) {
        if (forceCaptures) {
            const allCaptureMoves = this.getAllCaptureMovesForPlayer(piece.owner);
            if (allCaptureMoves.length > 0) {
                return this.getCaptureMovesForPiece(piece);
            }
        }
        // If no captures are forced or available, return simple moves.
        return this.getSimpleMovesForPiece(piece);
    }

    /**
     * Gets only the simple (non-capture) moves for a piece.
     * @param {Piece} piece - The piece to check.
     * @returns {Array<object>} An array of simple move objects.
     */
    getSimpleMovesForPiece(piece) {
        const moves = [];
        const { row, col } = this.getPiecePosition(piece.id);
        const moveDirs = piece.getMoveDirections();

        for (const dir of moveDirs) {
            const newRow = row + dir.row;
            const newCol = col + dir.col;

            if (this.isValidSquare(newRow, newCol) && !this.getPieceAt(newRow, newCol)) {
                moves.push({
                    from: { row, col },
                    to: { row: newRow, col: newCol },
                    isCapture: false,
                });
            }
        }
        return moves;
    }

    /**
     * Gets only the capture moves (jumps) for a piece.
     * @param {Piece} piece - The piece to check.
     * @returns {Array<object>} An array of capture move objects.
     */
    getCaptureMovesForPiece(piece) {
        const moves = [];
        const { row, col } = this.getPiecePosition(piece.id);
        const moveDirs = piece.getMoveDirections();

        for (const dir of moveDirs) {
            const jumpOverRow = row + dir.row;
            const jumpOverCol = col + dir.col;
            const landRow = row + dir.row * 2;
            const landCol = col + dir.col * 2;

            if (this.isValidSquare(landRow, landCol) && !this.getPieceAt(landRow, landCol)) {
                const jumpedPiece = this.getPieceAt(jumpOverRow, jumpOverCol);
                if (jumpedPiece && jumpedPiece.owner !== piece.owner) {
                    moves.push({
                        from: { row, col },
                        to: { row: landRow, col: landCol },
                        isCapture: true,
                        captured: { row: jumpOverRow, col: jumpOverCol }
                    });
                }
            }
        }
        return moves;
    }
}

export default Board;
