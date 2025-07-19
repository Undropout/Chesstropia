// Core game state management
import { Board } from './Board.js';
import { Piece } from './Piece.js';
import { EmotionalSystem } from './EmotionalSystem.js';
import { teamData } from '../data/teams/teamList.js';

export class GameState {
    constructor() {
        this.board = new Board();
        this.pieces = new Map(); // pieceId -> Piece instance
        this.turn = 1;
        this.currentPlayer = 'player';
        this.selectedPiece = null;
        this.emotionalWeather = 'stable';
        this.teamMorale = 5; // 0-10
        this.stormScheduled = null;
        this.activeEvents = [];
        this.matchObjectives = [];
        this.emotionalSystem = new EmotionalSystem(this);
    }

    async initializeMatch(matchData) {
        // Clear board
        this.board.clear();
        this.pieces.clear();

        // Load team data
        const playerTeamData = await this.loadTeamData(matchData.playerTeam);
        const opponentTeamData = await this.loadTeamData(matchData.opponentTeam);

        // Set up pieces
        this.setupTeam('player', playerTeamData, true);
        this.setupTeam('opponent', opponentTeamData, false);

        // Apply initial dysregulation
        this.emotionalSystem.applyInitialDysregulation(matchData.dysregulatedCount);

        // Schedule storm if specified
        if (matchData.stormTurn) {
            this.stormScheduled = matchData.stormTurn;
        } else {
            // Random storm between turns 4-8
            this.stormScheduled = Math.floor(Math.random() * 5) + 4;
        }

        // Set objectives
        this.matchObjectives = matchData.objectives || [];

        // Set special rules
        if (matchData.specialRules) {
            this.applySpecialRules(matchData.specialRules);
        }
    }

    async loadTeamData(teamId) {
        // Dynamic import of team data
        const module = await import(`../data/teams/${teamId}.js`);
        return module.default;
    }

    setupTeam(side, teamData, isPlayerBottom) {
        // Checkers setup: 3 rows of pieces
        const startRow = isPlayerBottom ? 0 : 5;
        const direction = isPlayerBottom ? 1 : -1;

        let pieceIndex = 0;

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
                // Checkers pattern: pieces on dark squares
                if ((row + col) % 2 === 1) {
                    const position = {
                        row: startRow + (row * direction),
                        col: col
                    };

                    // Get piece personality from team data
                    const personality = teamData.pieces[pieceIndex % teamData.pieces.length];
                    
                    // Create piece
                    const piece = new Piece(
                        `${side}_${pieceIndex}`,
                        side,
                        'regular', // All start as regular pieces in checkers
                        position,
                        personality
                    );

                    // Place on board
                    this.board.placePiece(piece, position);
                    this.pieces.set(piece.id, piece);

                    pieceIndex++;
                }
            }
        }
    }

    applySpecialRules(rules) {
        rules.forEach(rule => {
            switch(rule.type) {
                case 'fragile_trust':
                    // Trust decreases faster
                    this.emotionalSystem.trustDecayRate = 2;
                    break;
                case 'emotional_contagion':
                    // Dysregulation spreads easier
                    this.emotionalSystem.contagionThreshold = 0.3;
                    break;
                case 'sanctuary_squares':
                    // Certain squares provide emotional safety
                    this.board.setSanctuarySquares(rule.squares);
                    break;
            }
        });
    }

    selectPiece(position) {
        const piece = this.board.getPieceAt(position);
        if (!piece || piece.team !== this.currentPlayer) {
            return false;
        }

        // Check if piece can be selected
        const availability = this.emotionalSystem.checkPieceAvailability(piece);
        if (!availability.available) {
            this.triggerEvent({
                type: 'selection_blocked',
                piece: piece,
                reason: availability.reason,
                message: availability.message
            });
            return false;
        }

        this.selectedPiece = piece;
        return true;
    }

    async attemptMove(targetPosition) {
        if (!this.selectedPiece) return false;

        const piece = this.selectedPiece;
        const moveResult = this.board.validateMove(piece, targetPosition);

        if (!moveResult.valid) {
            return false;
        }

        // Check for emotional intervention
        if (piece.emotionalState !== 'regulated') {
            const interventionNeeded = await this.emotionalSystem.checkMoveIntervention(
                piece, 
                targetPosition
            );
            
            if (interventionNeeded) {
                return false; // Move blocked until emotional state addressed
            }
        }

        // Execute move
        return this.executeMove(piece, targetPosition, moveResult);
    }

    executeMove(piece, targetPosition, moveData) {
        // Handle captures
        if (moveData.captures.length > 0) {
            this.handleCaptures(piece, moveData.captures);
        }

        // Move piece
        this.board.movePiece(piece, targetPosition);
        piece.position = targetPosition;
        piece.hasMoved = true;

        // Check for king promotion
        if (this.shouldPromote(piece, targetPosition)) {
            this.promotePiece(piece);
        }

        // Update emotional states
        this.emotionalSystem.processMoveEmotions(piece, moveData);

        // Clear selection
        this.selectedPiece = null;

        // Check for emotional events
        this.checkEmotionalTriggers();

        // Advance turn
        this.nextTurn();

        return true;
    }

    handleCaptures(capturingPiece, capturedPieces) {
        capturedPieces.forEach(capturedPiece => {
            // Check for trauma responses
            const traumaResponse = this.emotionalSystem.checkCaptureTrauma(
                capturingPiece,
                capturedPiece
            );

            if (traumaResponse) {
                this.triggerEvent(traumaResponse);
            }

            // Move to sideline
            this.board.removePiece(capturedPiece.position);
            capturedPiece.captured = true;
            capturedPiece.position = null;

            // Emotional impact on nearby pieces
            this.emotionalSystem.processWitnessTrauma(capturedPiece);
        });

        // Check if capturing piece is affected
        if (capturedPieces.length > 1) {
            // Multiple captures can cause distress
            this.emotionalSystem.checkMultiCaptureStress(capturingPiece);
        }
    }

    shouldPromote(piece, position) {
        // Checkers promotion: reach opposite end
        const targetRow = piece.team === 'player' ? 7 : 0;
        return position.row === targetRow && piece.type === 'regular';
    }

    async promotePiece(piece) {
        // Check for promotion anxiety
        const anxietyCheck = this.emotionalSystem.checkPromotionAnxiety(piece);
        
        if (anxietyCheck.triggered) {
            await this.triggerEvent({
                type: 'promotion_crisis',
                piece: piece,
                message: anxietyCheck.message,
                options: [
                    { text: "You're ready for this", effect: 'encourage' },
                    { text: "We can wait if you need", effect: 'patient' },
                    { text: "You don't have to if you don't want", effect: 'release' }
                ]
            });
        }

        piece.type = 'king';
        piece.addMemory('promotion', {
            turn: this.turn,
            emotional_state: piece.emotionalState
        });
    }

    checkEmotionalTriggers() {
        // Check for storm
        if (this.turn === this.stormScheduled) {
            this.emotionalSystem.triggerEmotionalStorm();
        }

        // Check team morale
        const moraleCheck = this.calculateTeamMorale();
        if (moraleCheck < 3 && this.teamMorale >= 3) {
            this.triggerEvent({
                type: 'morale_crisis',
                message: 'Team morale is critically low'
            });
        }
        this.teamMorale = moraleCheck;

        // Check for chain reactions
        this.emotionalSystem.checkEmotionalContagion();

        // Check objective progress
        this.checkObjectives();
    }

    calculateTeamMorale() {
        let totalTrust = 0;
        let pieceCount = 0;

        this.pieces.forEach(piece => {
            if (piece.team === 'player' && !piece.captured) {
                totalTrust += Math.max(0, piece.trust + 5); // Normalize to 0-10
                pieceCount++;
            }
        });

        return pieceCount > 0 ? Math.round(totalTrust / pieceCount) : 0;
    }

    triggerEvent(event) {
        this.activeEvents.push(event);
        
        // Emit event for UI handling
        window.dispatchEvent(new CustomEvent('chesstropia:event', {
            detail: event
        }));
    }

    nextTurn() {
        this.turn++;
        this.currentPlayer = this.currentPlayer === 'player' ? 'opponent' : 'player';
        
        // Process turn-based effects
        this.emotionalSystem.processTurnEffects();
        
        // Clear expired events
        this.activeEvents = this.activeEvents.filter(e => !e.expired);
    }

    checkObjectives() {
        this.matchObjectives.forEach(objective => {
            if (objective.completed) return;

            switch(objective.type) {
                case 'piece_trust':
                    const piece = this.pieces.get(objective.pieceId);
                    if (piece && piece.trust >= objective.target) {
                        objective.completed = true;
                        this.triggerEvent({
                            type: 'objective_complete',
                            objective: objective
                        });
                    }
                    break;
                    
                case 'no_abandonment':
                    // Check in emotional system
                    break;
                    
                case 'help_enemy':
                    // Track cross-team support
                    break;
            }
        });
    }

    serialize() {
        return {
            turn: this.turn,
            currentPlayer: this.currentPlayer,
            emotionalWeather: this.emotionalWeather,
            teamMorale: this.teamMorale,
            pieces: Array.from(this.pieces.values()).map(p => p.serialize()),
            boardState: this.board.serialize(),
            activeEvents: this.activeEvents
        };
    }

    async deserialize(data) {
        this.turn = data.turn;
        this.currentPlayer = data.currentPlayer;
        this.emotionalWeather = data.emotionalWeather;
        this.teamMorale = data.teamMorale;
        
        // Reconstruct pieces
        this.pieces.clear();
        for (const pieceData of data.pieces) {
            const piece = new Piece();
            piece.deserialize(pieceData);
            this.pieces.set(piece.id, piece);
        }
        
        // Reconstruct board
        this.board.deserialize(data.boardState);
        
        this.activeEvents = data.activeEvents || [];
    }
}