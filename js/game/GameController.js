/**
 * @file GameController.js
 * The central orchestrator for the ChessTropia game. It manages the game state,
 * turn flow, player input, and interactions between all other game systems.
 * It acts as the "brain" of the game, connecting the UI, game logic, and AI.
 */

// Module Imports
import EventEmitter from '../utils/EventEmitter.js';
import Board from './Board.js';
import Piece from './Piece.js'; // We need this for re-instantiating pieces on load
import EmpathySystem from './EmpathySystem.js';
import StormSystem from './StormSystem.js';
import AIOpponent from '../ai/AIOpponent.js';
import { TEAMS } from '../data/teams/teamList.js';

/**
 * @class GameController
 * Manages the entire lifecycle of a game session.
 */
class GameController {
    /**
     * Initializes the GameController instance.
     * @param {EventEmitter} eventEmitter - The central event bus for communication between modules.
     */
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
        this.gameState = 'pending'; // Game states: pending, active, paused, gameover
        this.board = null;
        this.pieces = new Map(); // Using a Map to store piece instances by their unique ID.
        this.playerTeamId = null;
        this.opponentTeamId = null;
        this.currentPlayer = 'player'; // 'player' or 'opponent'
        this.ai = null;
        this.empathySystem = null;
        this.stormSystem = null;

        this.selectedPiece = null;

        this.bindEvents();
    }

    /**
     * Binds methods to events from the event emitter.
     */
    bindEvents() {
        this.eventEmitter.on('squareClicked', this.onSquareClicked.bind(this));
        this.eventEmitter.on('empathyResponseChosen', this.onEmpathyResponse.bind(this));
    }

    /**
     * Starts a new game with the given configuration.
     */
    startGame(playerTeamId, opponentTeamId, aiType) {
        console.log(`Starting game with Player: ${playerTeamId}, Opponent: ${opponentTeamId}, AI: ${aiType}`);
        this.gameState = 'active';

        this.playerTeamId = playerTeamId;
        this.opponentTeamId = opponentTeamId;
        
        this.board = new Board(this.eventEmitter);
        this.empathySystem = new EmpathySystem(this.eventEmitter);
        this.ai = new AIOpponent(aiType, this.eventEmitter);

        this.createPieces();
        
        const allPieces = Array.from(this.pieces.values());
        this.stormSystem = new StormSystem(this.eventEmitter, allPieces);

        this.eventEmitter.emit('gameStarted', {
            board: this.board,
            pieces: allPieces,
            playerTeam: TEAMS[this.playerTeamId],
            opponentTeam: TEAMS[this.opponentTeamId],
        });
        this.eventEmitter.emit('turnChanged', { currentPlayer: this.currentPlayer });

        console.log("Game Controller initialized and game started.", this);
    }

    /**
     * Creates Piece instances for both teams and places them on the board.
     */
    createPieces() {
        this.pieces.clear();
        const playerTeamData = TEAMS[this.playerTeamId];
        const opponentTeamData = TEAMS[this.opponentTeamId];

        // Create and place player pieces
        for (let i = 0; i < 12; i++) {
            const row = 5 + Math.floor(i / 4);
            const col = (i % 4) * 2 + ((row % 2 === 0) ? 1 : 0);
            const pieceData = playerTeamData.members[i % playerTeamData.members.length];
            const piece = new Piece(`player_${i}`, 'player', playerTeamData, pieceData, this.eventEmitter);
            this.board.addPiece(piece, row, col);
            this.pieces.set(piece.id, piece);
        }

        // Create and place opponent pieces
        for (let i = 0; i < 12; i++) {
            const row = 0 + Math.floor(i / 4);
            const col = (i % 4) * 2 + ((row % 2 !== 0) ? 1 : 0);
            const pieceData = opponentTeamData.members[i % opponentTeamData.members.length];
            const piece = new Piece(`opponent_${i}`, 'opponent', opponentTeamData, pieceData, this.eventEmitter);
            this.board.addPiece(piece, row, col);
            this.pieces.set(piece.id, piece);
        }
    }
    
    /**
     * Gathers the entire current game state into a serializable object for saving.
     * @returns {object} A snapshot of the game state.
     */
    getSaveState() {
        // Serialize all pieces into plain objects
        const serializedPieces = Array.from(this.pieces.values()).map(p => p.serialize());
        
        // Serialize the board grid using piece IDs instead of full objects
        const boardState = this.board.grid.map(row => 
            row.map(piece => piece ? piece.id : null)
        );

        return {
            gameState: this.gameState,
            currentPlayer: this.currentPlayer,
            playerTeamId: this.playerTeamId,
            opponentTeamId: this.opponentTeamId,
            aiType: this.ai.aiType,
            pieces: serializedPieces,
            board: boardState,
            stormSystem: {
                isActive: this.stormSystem.stormIsActive,
                type: this.stormSystem.stormType,
                turnsUntil: this.stormSystem.turnsUntilStorm,
            }
        };
    }

    /**
     * Loads a game from a state object, reconstructing the entire game.
     * @param {object} state - The game state object from the save file.
     */
    loadFromState(state) {
        console.log("Loading game from state:", state);
        this.gameState = state.gameState;
        this.currentPlayer = state.currentPlayer;
        this.playerTeamId = state.playerTeamId;
        this.opponentTeamId = state.opponentTeamId;

        // Re-initialize systems
        this.board = new Board(this.eventEmitter);
        this.empathySystem = new EmpathySystem(this.eventEmitter);
        this.ai = new AIOpponent(state.aiType, this.eventEmitter);

        // Re-create all piece instances from the serialized data
        this.pieces.clear();
        state.pieces.forEach(pState => {
            const teamData = TEAMS[pState.owner === 'player' ? this.playerTeamId : this.opponentTeamId];
            const memberData = teamData.members.find(m => m.name === pState.name);
            const piece = new Piece(pState.id, pState.owner, teamData, memberData, this.eventEmitter);
            
            // Restore the dynamic state of the piece
            piece.trust = pState.trust;
            piece.emotionalState = pState.emotionalState;
            if (pState.isKing) {
                piece.makeKing();
            }
            this.pieces.set(piece.id, piece);
        });

        // Re-populate the board grid using the newly created piece instances
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const pieceId = state.board[r][c];
                if (pieceId) {
                    const piece = this.pieces.get(pieceId);
                    this.board.addPiece(piece, r, c);
                }
            }
        }
        
        const allPieces = Array.from(this.pieces.values());
        this.stormSystem = new StormSystem(this.eventEmitter, allPieces);
        this.stormSystem.stormIsActive = state.stormSystem.isActive;
        this.stormSystem.stormType = state.stormSystem.type;
        this.stormSystem.turnsUntilStorm = state.stormSystem.turnsUntil;
        
        // Announce that the game is ready to be rendered by the UI
        this.eventEmitter.emit('gameStarted', {
            board: this.board,
            pieces: allPieces,
            playerTeam: TEAMS[this.playerTeamId],
            opponentTeam: TEAMS[this.opponentTeamId],
        });
        this.eventEmitter.emit('turnChanged', { currentPlayer: this.currentPlayer });

        console.log("Game successfully loaded and reconstructed.");
    }


    /**
     * Handles the logic when a player clicks on a square on the board.
     * @param {object} data - The event data, containing { row, col }.
     */
    onSquareClicked({ row, col }) {
        if (this.gameState !== 'active' || this.currentPlayer !== 'player') {
            return;
        }

        const pieceAtSquare = this.board.getPieceAt(row, col);

        if (this.selectedPiece) {
            this.handleMoveAttempt(this.selectedPiece, row, col);
        } else if (pieceAtSquare && pieceAtSquare.owner === 'player') {
            this.selectPiece(pieceAtSquare);
        }
    }

    /**
     * Selects a piece, checking its emotional state first.
     * @param {Piece} piece - The piece to be selected.
     */
    selectPiece(piece) {
        if (piece.isDysregulated()) {
            this.eventEmitter.emit('empathyRequired', { piece });
            return;
        }

        this.deselectPiece();
        this.selectedPiece = piece;
        const validMoves = this.board.getValidMoves(piece);
        this.eventEmitter.emit('pieceSelected', { piece, validMoves });
    }

    /**
     * Deselects the currently selected piece.
     */
    deselectPiece() {
        if (this.selectedPiece) {
            this.eventEmitter.emit('pieceDeselected', { piece: this.selectedPiece });
            this.selectedPiece = null;
        }
    }

    /**
     * Handles an attempt to move a piece to a new square.
     */
    handleMoveAttempt(piece, toRow, toCol) {
        const validMoves = this.board.getValidMoves(piece);
        const targetMove = validMoves.find(move => move.to.row === toRow && move.to.col === toCol);

        if (targetMove) {
            this.performMove(piece, targetMove);
            this.switchTurn();
        } else {
            this.deselectPiece();
        }
    }

    /**
     * Executes a validated move.
     */
    performMove(piece, move) {
        const fromPos = this.board.getPiecePosition(piece.id);
        this.board.movePiece(piece, move.to.row, move.to.col);
        this.eventEmitter.emit('pieceMoved', { piece, from: fromPos, to: move.to });

        if (move.isCapture) {
            const capturedPiece = this.board.getPieceAt(move.captured.row, move.captured.col);
            if(capturedPiece) {
                this.board.removePiece(move.captured.row, move.captured.col);
                this.pieces.delete(capturedPiece.id);
                this.eventEmitter.emit('pieceCaptured', { capturedPiece, byPiece: piece });
            }
        }

        if ((piece.owner === 'player' && move.to.row === 0) || (piece.owner === 'opponent' && move.to.row === 7)) {
            if (!piece.isKing) {
                piece.makeKing();
            }
        }
        
        this.deselectPiece();
        this.checkGameOver();
    }

    /**
     * Handles the result of an empathy interaction.
     */
    onEmpathyResponse({ pieceId, choice }) {
        const piece = this.pieces.get(pieceId);
        if (!piece) return;

        const result = this.empathySystem.handleInteraction(piece, choice);

        piece.updateTrust(result.trustChange);
        piece.updateEmotionalState(result.newState);

        this.eventEmitter.emit('empathyResult', { piece, result });

        if (!piece.isDysregulated()) {
            this.selectPiece(piece);
        } else {
            this.eventEmitter.emit('turnEnded', { reason: 'Failed Empathy Check' });
            this.switchTurn();
        }
    }

    /**
     * Switches the turn to the next player.
     */
    switchTurn() {
        if (this.gameState !== 'active') return;

        this.currentPlayer = (this.currentPlayer === 'player') ? 'opponent' : 'player';
        this.eventEmitter.emit('turnChanged', { currentPlayer: this.currentPlayer });

        if (this.currentPlayer === 'opponent') {
            this.triggerAITurn();
        }
    }

    /**
     * Triggers the AI's turn to make a move.
     */
    triggerAITurn() {
        setTimeout(() => {
            if (this.gameState !== 'active') return;
            
            const aiMove = this.ai.chooseMove(this.board, TEAMS[this.opponentTeamId]);

            if (aiMove && aiMove.piece) {
                this.performMove(aiMove.piece, aiMove.move);
            } else {
                console.log("AI has no valid moves or failed to choose one.");
                this.endGame('player');
                return;
            }
            this.switchTurn();
        }, 1200);
    }

    /**
     * Checks if the game has reached a win/loss condition.
     */
    checkGameOver() {
        const playerPieces = this.board.getPlayerPieces('player');
        const opponentPieces = this.board.getPlayerPieces('opponent');

        if (opponentPieces.length === 0) {
            this.endGame('player');
            return true;
        }
        if (playerPieces.length === 0) {
            this.endGame('opponent');
            return true;
        }

        const activePieces = this.currentPlayer === 'player' ? playerPieces : opponentPieces;
        const hasMoves = activePieces.some(p => this.board.getValidMoves(p).length > 0);
        if (!hasMoves) {
            this.endGame(this.currentPlayer === 'player' ? 'opponent' : 'player');
            return true;
        }
        return false;
    }

    /**
     * Ends the game and announces the winner.
     */
    endGame(winner) {
        if (this.gameState === 'gameover') return;
        this.gameState = 'gameover';
        this.eventEmitter.emit('gameOver', { winner });
        console.log(`Game over! Winner: ${winner}`);
    }
}

export default GameController;
