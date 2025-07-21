/**
 * @file GameController.js
 * The central orchestrator for the ChessTropia game. It manages the game state,
 * turn flow, player input, and interactions between all other game systems.
 * It acts as the "brain" of the game, connecting the UI, game logic, and AI.
 */

// Module Imports
import { EventEmitter } from '../utils/EventEmitter.js';
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
        this.gameState = 'pending';
        this.gameMode = 'checkers';
        this.board = null;
        this.pieces = new Map();
        this.playerTeamId = null;
        this.opponentTeamId = null;
        this.currentPlayer = 'player';
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
    startGame(playerTeamId, opponentTeamId, aiType, gameMode = 'checkers') {
        console.log(`Starting ${gameMode} game with Player: ${playerTeamId}, Opponent: ${opponentTeamId}, AI: ${aiType}`);
        this.gameState = 'active';
        this.gameMode = gameMode;
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
    }

    /**
     * Creates Piece instances for both teams and places them on the board.
     */
    createPieces() {
        this.pieces.clear();
        const playerTeamData = TEAMS[this.playerTeamId];
        const opponentTeamData = TEAMS[this.opponentTeamId];

        if (this.gameMode === 'checkers') {
            const playerPawns = playerTeamData.members.filter(m => m.role === 'Pawn');
            const opponentPawns = opponentTeamData.members.filter(m => m.role === 'Pawn');

            for (let i = 0; i < 12; i++) {
                const pRow = 5 + Math.floor(i / 4);
                const pCol = (i % 4) * 2 + (pRow % 2 === 0 ? 1 : 0);
                const pData = playerPawns[i % playerPawns.length];
                const pPiece = new Piece(`player_${i}`, 'player', playerTeamData, pData, this.eventEmitter);
                this.board.addPiece(pPiece, pRow, pCol);
                this.pieces.set(pPiece.id, pPiece);

                const oRow = 0 + Math.floor(i / 4);
                const oCol = (i % 4) * 2 + (oRow % 2 === 0 ? 1 : 0);
                const oData = opponentPawns[i % opponentPawns.length];
                const oPiece = new Piece(`opponent_${i}`, 'opponent', opponentTeamData, oData, this.eventEmitter);
                this.board.addPiece(oPiece, oRow, oCol);
                this.pieces.set(oPiece.id, oPiece);
            }
        } else { // Chess setup
            const backRank = ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'];
            for (let i = 0; i < 8; i++) {
                const opData = opponentTeamData.members.find(m => m.role === 'Pawn') || opponentTeamData.members[8 + i];
                const oPawn = new Piece(`opponent_pawn_${i}`, 'opponent', opponentTeamData, opData, this.eventEmitter);
                this.board.addPiece(oPawn, 1, i);
                this.pieces.set(oPawn.id, oPawn);

                const omData = opponentTeamData.members.find(m => m.role === backRank[i]) || opponentTeamData.members[i];
                const oMajor = new Piece(`opponent_${backRank[i]}_${i}`, 'opponent', opponentTeamData, omData, this.eventEmitter);
                this.board.addPiece(oMajor, 0, i);
                this.pieces.set(oMajor.id, oMajor);
                
                const ppData = playerTeamData.members.find(m => m.role === 'Pawn') || playerTeamData.members[8 + i];
                const pPawn = new Piece(`player_pawn_${i}`, 'player', playerTeamData, ppData, this.eventEmitter);
                this.board.addPiece(pPawn, 6, i);
                this.pieces.set(pPawn.id, pPawn);

                const pmData = playerTeamData.members.find(m => m.role === backRank[i]) || playerTeamData.members[i];
                const pMajor = new Piece(`player_${backRank[i]}_${i}`, 'player', playerTeamData, pmData, this.eventEmitter);
                this.board.addPiece(pMajor, 7, i);
                this.pieces.set(pMajor.id, pMajor);
            }
        }
    }

    /**
     * Handles the logic when a player clicks on a square on the board.
     */
    onSquareClicked({ row, col }) {
        if (this.gameState !== 'active' || this.currentPlayer !== 'player') return;

        const pieceAtSquare = this.board.getPieceAt(row, col);

        if (this.selectedPiece) {
            this.handleMoveAttempt(this.selectedPiece, row, col);
        } else if (pieceAtSquare && pieceAtSquare.owner === 'player') {
            this.selectPiece(pieceAtSquare);
        }
    }

    /**
     * Selects a piece, considering game rules and emotional state.
     * @param {Piece} piece - The piece the player is trying to select.
     */
    selectPiece(piece) {
        // First, check for forced captures and if the pieces that can make them are regulated.
        const allCaptures = this.board.getAllCaptureMovesForPlayer('player');
        const canRegulatedPieceCapture = allCaptures.some(cap => !cap.piece.isDysregulated());

        // If a regulated piece CAN capture, the player MUST select a piece that has a capture move.
        if (canRegulatedPieceCapture) {
            const pieceHasCapture = allCaptures.some(cap => cap.piece.id === piece.id);
            if (!pieceHasCapture) {
                this.eventEmitter.emit('actionError', { message: "A mandatory capture is available. You must take it." });
                return;
            }
        }
        
        // Now, check the emotional state of the selected piece.
        if (piece.isDysregulated()) {
            this.eventEmitter.emit('empathyRequired', { piece });
            return; // Stop the selection process and wait for an empathy action.
        }

        // If all checks pass, select the piece.
        this.deselectPiece();
        this.selectedPiece = piece;
        
        // The valid moves depend on whether captures are suspended or not.
        const validMoves = this.board.getValidMoves(piece, canRegulatedPieceCapture);
        this.eventEmitter.emit('pieceSelected', { piece, validMoves });
    }
    
    // ... (rest of the file from deselectPiece onwards remains the same)

    deselectPiece() {
        if (this.selectedPiece) {
            this.eventEmitter.emit('pieceDeselected', { piece: this.selectedPiece });
            this.selectedPiece = null;
        }
    }

    handleMoveAttempt(piece, toRow, toCol) {
        const allCaptures = this.board.getAllCaptureMovesForPlayer('player');
        const canRegulatedPieceCapture = allCaptures.some(cap => !cap.piece.isDysregulated());
        const validMoves = this.board.getValidMoves(piece, canRegulatedPieceCapture);

        const targetMove = validMoves.find(move => move.to.row === toRow && move.to.col === toCol);

        if (targetMove) {
            this.performMove(piece, targetMove);
            this.switchTurn();
        } else {
            this.deselectPiece();
        }
    }

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

    switchTurn() {
        if (this.gameState !== 'active') return;

        this.currentPlayer = (this.currentPlayer === 'player') ? 'opponent' : 'player';
        this.eventEmitter.emit('turnChanged', { currentPlayer: this.currentPlayer });

        if (this.currentPlayer === 'opponent') {
            this.triggerAITurn();
        }
    }

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
        const hasMoves = activePieces.some(p => this.board.getValidMoves(p, true).length > 0);
        if (!hasMoves) {
            this.endGame(this.currentPlayer === 'player' ? 'opponent' : 'player');
            return true;
        }
        return false;
    }

    endGame(winner) {
        if (this.gameState === 'gameover') return;
        this.gameState = 'gameover';
        this.eventEmitter.emit('gameOver', { winner });
        console.log(`Game over! Winner: ${winner}`);
    }
    
    // getSaveState and loadFromState are omitted for brevity but would be here
    getSaveState() {
        const serializedPieces = Array.from(this.pieces.values()).map(p => p.serialize());
        const boardState = this.board.grid.map(row => row.map(piece => piece ? piece.id : null));

        return {
            gameState: this.gameState,
            gameMode: this.gameMode,
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

    loadFromState(state) {
        console.log("Loading game from state:", state);
        this.gameState = state.gameState;
        this.gameMode = state.gameMode || 'checkers';
        this.currentPlayer = state.currentPlayer;
        this.playerTeamId = state.playerTeamId;
        this.opponentTeamId = state.opponentTeamId;

        this.board = new Board(this.eventEmitter);
        this.empathySystem = new EmpathySystem(this.eventEmitter);
        this.ai = new AIOpponent(state.aiType, this.eventEmitter);

        this.pieces.clear();
        state.pieces.forEach(pState => {
            const teamData = TEAMS[pState.owner === 'player' ? this.playerTeamId : this.opponentTeamId];
            const memberData = teamData.members.find(m => m.name === pState.name);
            const piece = new Piece(pState.id, pState.owner, teamData, memberData, this.eventEmitter);
            
            piece.trust = pState.trust;
            piece.emotionalState = pState.emotionalState;
            if (pState.isKing) piece.makeKing();
            this.pieces.set(piece.id, piece);
        });

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
        
        this.eventEmitter.emit('gameStarted', {
            board: this.board,
            pieces: allPieces,
            playerTeam: TEAMS[this.playerTeamId],
            opponentTeam: TEAMS[this.opponentTeamId],
        });
        this.eventEmitter.emit('turnChanged', { currentPlayer: this.currentPlayer });

        console.log("Game successfully loaded and reconstructed.");
    }
}

export default GameController;
