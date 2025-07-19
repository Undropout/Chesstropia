// Main game controller orchestrating the emotional journey
import { Board } from './Board.js';
import { Piece } from './Piece.js';
import { EmpathySystem } from './EmpathySystem.js';
import { StormSystem } from './StormSystem.js';
import { AIOpponent } from './AIOpponent.js';
import { EventEmitter } from '../utils/EventEmitter.js';
import { saveManager } from '../utils/saveManager.js';
import { audioManager, sfx } from '../utils/audioManager.js';
import { analytics, track } from '../utils/analytics.js';
import { teamRegistry } from '../data/teams/teamList.js';

export class GameController extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.config = {
            container: config.container || document.getElementById('game-container'),
            team: config.team || 'donuts',
            difficulty: config.difficulty || 'normal',
            mode: config.mode || 'campaign',
            ...config
        };
        
        this.state = {
            phase: 'setup', // setup, playing, paused, victory, defeat
            currentTurn: 'player',
            turnCount: 0,
            pieces: new Map(),
            capturedPieces: [],
            selectedPiece: null,
            matchStartTime: Date.now(),
            stats: this.createEmptyStats()
        };
        
        this.systems = {};
        this.initialize();
    }
    
    async initialize() {
        try {
            // Load team data
            await this.loadTeamData();
            
            // Create game systems
            this.createSystems();
            
            // Setup board
            this.setupBoard();
            
            // Create pieces
            this.createPieces();
            
            // Setup UI
            this.setupUI();
            
            // Start game
            this.startGame();
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.handleInitializationError(error);
        }
    }
    
    async loadTeamData() {
        const teamModule = await import(`../data/teams/${this.config.team}.js`);
        this.teamData = teamModule.default;
        
        // Apply team theme
        window.themeManager?.setTeamTheme(this.teamData.colorAffinity);
    }
    
    createSystems() {
        // Board
        this.board = new Board(this.config.container);
        this.board.on('moveAttempt', this.handleMoveAttempt.bind(this));
        this.board.on('pieceSelected', this.handlePieceSelection.bind(this));
        this.board.on('selectionDenied', this.handleSelectionDenied.bind(this));
        
        // Empathy system
        this.empathySystem = new EmpathySystem();
        this.empathySystem.on('empathySuccess', this.handleEmpathySuccess.bind(this));
        this.empathySystem.on('empathyFailure', this.handleEmpathyFailure.bind(this));
        
        // Storm system
        this.stormSystem = new StormSystem();
        this.stormSystem.on('stormApproaching', this.handleStormApproaching.bind(this));
        this.stormSystem.on('stormActive', this.handleStormActive.bind(this));
        this.stormSystem.on('stormPassing', this.handleStormPassing.bind(this));
        
        // AI opponent
        this.aiOpponent = new AIOpponent(this.config.difficulty);
        
        this.systems = {
            board: this.board,
            empathy: this.empathySystem,
            storm: this.stormSystem,
            ai: this.aiOpponent
        };
    }
    
    setupBoard() {
        // Initialize board with team colors
        this.board.teamColor = this.teamData.colorAffinity;
    }
    
    createPieces() {
        // Create player pieces
        this.teamData.pieces.forEach((pieceData, index) => {
            const row = Math.floor(index / 4) + 5; // Bottom 3 rows
            const col = (index % 4) * 2 + ((row + 1) % 2);
            
            const piece = new Piece({
                ...pieceData,
                team: 'player',
                teamColor: this.teamData.colorAffinity
            });
            
            this.state.pieces.set(piece.id, piece);
            this.board.addPiece(piece, row, col);
        });
        
        // Create opponent pieces
        for (let i = 0; i < 12; i++) {
            const row = Math.floor(i / 4);
            const col = (i % 4) * 2 + (row % 2);
            
            const piece = new Piece({
                id: `opponent_${i}`,
                name: `Opponent ${i + 1}`,
                team: 'opponent',
                personality: { traits: { trustGainRate: 0 } },
                emotionalState: 'regulated'
            });
            
            this.state.pieces.set(piece.id, piece);
            this.board.addPiece(piece, row, col);
        }
        
        // Initialize relationships
        this.initializeRelationships();
    }
    
    initializeRelationships() {
        const playerPieces = Array.from(this.state.pieces.values())
            .filter(p => p.team === 'player');
        
        // Set initial relationships based on team data
        if (this.teamData.groupDynamics?.supportNetwork) {
            Object.entries(this.teamData.groupDynamics.supportNetwork).forEach(([pair, type]) => {
                const [id1, id2] = pair.split('-');
                const piece1 = playerPieces.find(p => p.id === id1);
                const piece2 = playerPieces.find(p => p.id === id2);
                
                if (piece1 && piece2) {
                    piece1.setRelationship(piece2.id, 5); // Positive starting relationship
                    piece2.setRelationship(piece1.id, 5);
                }
            });
        }
    }
    
    setupUI() {
        // Create UI container
        this.uiContainer = document.createElement('div');
        this.uiContainer.className = 'game-ui';
        this.config.container.appendChild(this.uiContainer);
        
        // Turn indicator
        this.createTurnIndicator();
        
        // Empathy interface
        this.createEmpathyInterface();
        
        // Team status
        this.createTeamStatus();
        
        // Game controls
        this.createGameControls();
    }
    
    createTurnIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'turn-indicator';
        indicator.innerHTML = `
            <h2>Turn: <span id="current-turn">Your Turn</span></h2>
            <div class="turn-count">Turn ${this.state.turnCount}</div>
        `;
        this.uiContainer.appendChild(indicator);
    }
    
    createEmpathyInterface() {
        const empathyUI = document.createElement('div');
        empathyUI.className = 'empathy-interface';
        empathyUI.style.display = 'none';
        
        empathyUI.innerHTML = `
            <div class="empathy-header">
                <h3><span id="selected-piece-name"></span> needs support</h3>
                <p class="emotional-state"></p>
            </div>
            <div class="empathy-options" id="empathy-options"></div>
            <div class="empathy-feedback" id="empathy-feedback"></div>
        `;
        
        this.uiContainer.appendChild(empathyUI);
        this.empathyUI = empathyUI;
    }
    
    createTeamStatus() {
        const status = document.createElement('div');
        status.className = 'team-status';
        
        const updateStatus = () => {
            const playerPieces = Array.from(this.state.pieces.values())
                .filter(p => p.team === 'player' && !p.captured);
            
            const avgTrust = playerPieces.reduce((sum, p) => sum + p.trust, 0) / playerPieces.length;
            const dysregulated = playerPieces.filter(p => p.emotionalState !== 'regulated').length;
            
            status.innerHTML = `
                <h3>Team Status</h3>
                <div class="status-grid">
                    <div class="status-item">
                        <span class="label">Pieces:</span>
                        <span class="value">${playerPieces.length}/12</span>
                    </div>
                    <div class="status-item">
                        <span class="label">Avg Trust:</span>
                        <span class="value">${avgTrust.toFixed(1)}</span>
                    </div>
                    <div class="status-item">
                        <span class="label">Dysregulated:</span>
                        <span class="value ${dysregulated > 0 ? 'warning' : ''}">${dysregulated}</span>
                    </div>
                    <div class="status-item">
                        <span class="label">Storm Risk:</span>
                        <span class="value">${Math.round(this.stormSystem.getStormProbability() * 100)}%</span>
                    </div>
                </div>
            `;
        };
        
        updateStatus();
        this.updateTeamStatus = updateStatus;
        
        this.uiContainer.appendChild(status);
    }
    
    createGameControls() {
        const controls = document.createElement('div');
        controls.className = 'game-controls';
        
        controls.innerHTML = `
            <button id="pause-btn">Pause</button>
            <button id="save-btn">Save</button>
            <button id="options-btn">Options</button>
            <button id="help-btn">Help</button>
        `;
        
        controls.querySelector('#pause-btn').addEventListener('click', () => this.togglePause());
        controls.querySelector('#save-btn').addEventListener('click', () => this.saveGame());
        controls.querySelector('#options-btn').addEventListener('click', () => this.showOptions());
        controls.querySelector('#help-btn').addEventListener('click', () => this.showHelp());
        
        this.uiContainer.appendChild(controls);
    }
    
    startGame() {
        this.state.phase = 'playing';
        this.state.matchStartTime = Date.now();
        
        // Initial emotional check
        this.checkEmotionalStates();
        
        // Start turn
        this.startTurn();
        
        // Start auto-save
        this.autoSaveInterval = setInterval(() => {
            if (this.state.phase === 'playing') {
                this.autoSave();
            }
        }, 60000); // Every minute
        
        this.emit('gameStarted');
    }
    
    startTurn() {
        // Update UI
        document.getElementById('current-turn').textContent = 
            this.state.currentTurn === 'player' ? 'Your Turn' : 'Opponent Turn';
        
        // Check for storms
        if (this.stormSystem.checkStormTrigger(this.state)) {
            this.stormSystem.startStorm();
            return; // Storm takes precedence
        }
        
        // Emotional state changes
        this.processEmotionalChanges();
        
        // Update relationships
        this.updateRelationships();
        
        if (this.state.currentTurn === 'player') {
            this.startPlayerTurn();
        } else {
            this.startAITurn();
        }
    }
    
    startPlayerTurn() {
        // Enable piece selection
        this.board.allowSelection = true;
        
        // Check for forced moves (captures)
        const forcedMoves = this.checkForcedMoves('player');
        if (forcedMoves.length > 0) {
            this.highlightForcedMoves(forcedMoves);
        }
        
        // Tutorial hints
        if (this.state.turnCount < 3) {
            this.showTurnHint();
        }
    }
    
    startAITurn() {
        this.board.allowSelection = false;
        
        setTimeout(() => {
            const move = this.aiOpponent.calculateMove(this.state);
            if (move) {
                this.executeMove(move.piece, move.to, move.captured);
            } else {
                // AI has no moves
                this.endGame('victory');
            }
        }, 1000);
    }
    
    handlePieceSelection({ piece }) {
        if (this.state.currentTurn !== 'player') return;
        
        this.state.selectedPiece = piece;
        
        // Check if piece needs empathy
        if (piece.emotionalState !== 'regulated' && !piece.empathyProvided) {
            this.showEmpathyInterface(piece);
        } else {
            // Show possible moves
            const moves = this.board.calculatePossibleMoves(piece);
            if (moves.length === 0) {
                this.showNotification('This piece has no valid moves', 'info');
            }
        }
        
        track('piece_selected', 'game', {
            pieceId: piece.id,
            emotionalState: piece.emotionalState,
            trust: piece.trust
        });
    }
    
    handleSelectionDenied({ piece, reason }) {
        const messages = {
            frozen: `${piece.name} is frozen and cannot move`,
            needs_empathy: `${piece.name} needs emotional support first`,
            opponent_piece: `You cannot control opponent pieces`
        };
        
        this.showNotification(messages[reason] || 'Cannot select this piece', 'warning');
        sfx.empathyFail();
    }
    
    showEmpathyInterface(piece) {
        this.empathyUI.style.display = 'block';
        
        // Update piece info
        document.getElementById('selected-piece-name').textContent = piece.name;
        this.empathyUI.querySelector('.emotional-state').textContent = 
            `Feeling ${piece.emotionalState} - ${this.getEmotionalDescription(piece)}`;
        
        // Get empathy options
        const options = this.empathySystem.getEmpathyOptions(piece);
        const optionsContainer = document.getElementById('empathy-options');
        optionsContainer.innerHTML = '';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'empathy-option';
            button.innerHTML = `
                <span class="option-text">${option.text}</span>
                <span class="option-hint">${option.hint}</span>
            `;
            
            button.addEventListener('click', () => {
                this.processEmpathyChoice(piece, option);
            });
            
            optionsContainer.appendChild(button);
        });
    }
    
    getEmotionalDescription(piece) {
        const descriptions = {
            anxious: "Worried about making the wrong move",
            shutdown: "Overwhelmed and withdrawn",
            fight: "Angry and defensive",
            freeze: "Paralyzed by fear",
            fawn: "Desperately trying to please"
        };
        
        return descriptions[piece.emotionalState] || "Struggling emotionally";
    }
    
    processEmpathyChoice(piece, option) {
        const result = this.empathySystem.processEmpathy(piece, option);
        
        // Show feedback
        const feedback = document.getElementById('empathy-feedback');
        feedback.textContent = result.feedback;
        feedback.className = `empathy-feedback ${result.success ? 'success' : 'failure'}`;
        
        // Update stats
        this.state.stats.empathyAttempts++;
        if (result.success) {
            this.state.stats.successfulEmpathy++;
        }
        
        // Track for analytics
        track('empathy_attempt', 'emotional', {
            pieceId: piece.id,
            emotionalState: piece.emotionalState,
            choice: option.id,
            success: result.success,
            trustChange: result.trustChange
        });
        
        setTimeout(() => {
            this.empathyUI.style.display = 'none';
            
            if (result.success) {
                piece.empathyProvided = true;
                
                // Check if piece can now move
                if (piece.emotionalState === 'regulated' || result.canMoveAnyway) {
                    this.board.selectPiece(piece);
                }
            }
            
            this.updateTeamStatus();
        }, 2000);
    }
    
    handleMoveAttempt({ piece, from, to }) {
        // Validate move
        if (!this.validateMove(piece, to)) {
            this.showNotification('Invalid move', 'error');
            return;
        }
        
        // Check for captures
        const captured = this.checkCaptures(piece, to);
        
        // Execute move
        this.executeMove(piece, to, captured);
    }
    
    validateMove(piece, to) {
        // Basic validation
        if (piece.team !== this.state.currentTurn) return false;
        if (piece.captured) return false;
        
        // Check if move is in possible moves
        const possibleMoves = this.board.calculatePossibleMoves(piece);
        return possibleMoves.some(move => move.row === to.row && move.col === to.col);
    }
    
    checkCaptures(piece, to) {
        const captured = [];
        const moves = this.board.calculateCaptureMoves(piece);
        
        const captureMove = moves.find(m => m.row === to.row && m.col === to.col);
        if (captureMove) {
            if (Array.isArray(captureMove.captured)) {
                captured.push(...captureMove.captured);
            } else {
                captured.push(captureMove.captured);
            }
        }
        
        return captured;
    }
    
    executeMove(piece, to, captured = []) {
        const from = piece.position;
        
        // Move piece
        this.board.movePiece(piece, to.row, to.col, captured[0]);
        
        // Handle captures
        captured.forEach(capturedPiece => {
            this.processCaptureEffects(piece, capturedPiece);
        });
        
        // Play move sound
        sfx.move(piece.emotionalState);
        
        // Update move history
        this.state.lastMove = { piece, from, to, captured };
        
        // Check for additional captures
        if (captured.length > 0) {
            const moreMoves = this.board.calculateCaptureMoves(piece);
            if (moreMoves.length > 0) {
                // Must continue capturing
                this.board.selectPiece(piece);
                return;
            }
        }
        
        // End turn
        this.endTurn();
    }
    
    processCaptureEffects(capturingPiece, capturedPiece) {
        capturedPiece.captured = true;
        this.state.capturedPieces.push(capturedPiece);
        
        // Emotional effects on capturing piece
        if (capturingPiece.team === 'player') {
            const emotionalImpact = this.calculateCaptureEmotionalImpact(capturingPiece);
            
            if (emotionalImpact.guilt) {
                capturingPiece.addMemory({
                    type: 'capture_guilt',
                    description: `Had to capture ${capturedPiece.name}`,
                    impact: -1
                });
                
                this.showNotification(
                    `${capturingPiece.name} feels guilty about the capture`,
                    'warning'
                );
            }
        }
        
        // Effects on witnessing pieces
        this.processWitnessEffects(capturingPiece, capturedPiece);
        
        // Update stats
        if (capturedPiece.team === 'player') {
            this.state.stats.piecesLost++;
        } else {
            this.state.stats.piecesCaptured++;
        }
        
        // Check for game end
        this.checkGameEnd();
    }
    
    calculateCaptureEmotionalImpact(piece) {
        const personality = piece.personality;
        
        return {
            guilt: personality.traits.empathy > 0.7,
            stress: personality.traits.anxietyTendency > 0.5,
            satisfaction: personality.traits.competitiveness > 0.7
        };
    }
    
    processWitnessEffects(capturingPiece, capturedPiece) {
        const witnesses = Array.from(this.state.pieces.values())
            .filter(p => !p.captured && p.id !== capturingPiece.id);
        
        witnesses.forEach(witness => {
            const distance = this.calculateDistance(witness.position, capturedPiece.position);
            
            if (distance <= 2) {
                // Close witnesses are more affected
                if (witness.team === capturedPiece.team) {
                    // Teammate captured
                    witness.processWitnessing('capture_trauma', capturedPiece);
                    
                    if (witness.emotionalState === 'regulated' && Math.random() < 0.3) {
                        witness.dysregulate('anxious');
                        this.showNotification(
                            `${witness.name} became anxious after witnessing the capture`,
                            'warning'
                        );
                    }
                }
            }
        });
    }
    
    calculateDistance(pos1, pos2) {
        return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
    }
    
    endTurn() {
        // Reset piece states
        Array.from(this.state.pieces.values()).forEach(piece => {
            piece.empathyProvided = false;
        });
        
        // Switch turns
        this.state.currentTurn = this.state.currentTurn === 'player' ? 'opponent' : 'player';
        this.state.turnCount++;
        
        // Update UI
        this.updateTeamStatus();
        
        // Save game state
        this.autoSave();
        
        // Check for special events
        this.checkSpecialEvents();
        
        // Start next turn
        setTimeout(() => this.startTurn(), 500);
    }
    
    checkEmotionalStates() {
        const playerPieces = Array.from(this.state.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        // Random emotional events
        playerPieces.forEach(piece => {
            if (piece.emotionalState === 'regulated' && Math.random() < 0.1) {
                // Small chance of dysregulation
                const triggers = ['anxious', 'shutdown', 'fight', 'freeze', 'fawn'];
                const trigger = triggers[Math.floor(Math.random() * triggers.length)];
                
                piece.dysregulate(trigger);
                this.showNotification(
                    `${piece.name} is struggling with ${trigger} feelings`,
                    'warning'
                );
            }
        });
    }
    
    processEmotionalChanges() {
        const playerPieces = Array.from(this.state.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        playerPieces.forEach(piece => {
            // Process ongoing dysregulation
            if (piece.emotionalState !== 'regulated') {
                piece.dysregulationTurns++;
                
                // Check for natural regulation
                if (piece.dysregulationTurns > 5 && Math.random() < 0.2) {
                    piece.regulate();
                    this.showNotification(
                        `${piece.name} managed to self-regulate!`,
                        'success'
                    );
                }
            }
            
            // Emotional contagion
            this.processEmotionalContagion(piece);
        });
    }
    
    processEmotionalContagion(piece) {
        if (piece.emotionalState === 'regulated') return;
        
        const adjacentPieces = this.getAdjacentPieces(piece);
        
        adjacentPieces.forEach(adjacent => {
            if (adjacent.emotionalState === 'regulated' && Math.random() < 0.15) {
                adjacent.dysregulate(piece.emotionalState);
                this.showNotification(
                    `${adjacent.name} caught ${piece.emotionalState} feelings from ${piece.name}`,
                    'warning'
                );
                
                this.board.showEmotionalWave(piece.position, piece.emotionalState);
            }
        });
    }
    
    getAdjacentPieces(piece) {
        const adjacent = [];
        const positions = [
            { row: piece.position.row - 1, col: piece.position.col - 1 },
            { row: piece.position.row - 1, col: piece.position.col + 1 },
            { row: piece.position.row + 1, col: piece.position.col - 1 },
            { row: piece.position.row + 1, col: piece.position.col + 1 }
        ];
        
        positions.forEach(pos => {
            const adjacentPiece = this.board.getPieceAt(pos.row, pos.col);
            if (adjacentPiece && adjacentPiece.team === piece.team) {
                adjacent.push(adjacentPiece);
            }
        });
        
        return adjacent;
    }
    
    updateRelationships() {
        const playerPieces = Array.from(this.state.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        // Update based on proximity and shared experiences
        playerPieces.forEach(piece1 => {
            playerPieces.forEach(piece2 => {
                if (piece1.id === piece2.id) return;
                
                const distance = this.calculateDistance(piece1.position, piece2.position);
                
                if (distance <= 2) {
                    // Close pieces bond slowly
                    piece1.updateRelationship(piece2.id, 0.1);
                    
                    // Shared emotional states bond faster
                    if (piece1.emotionalState === piece2.emotionalState && 
                        piece1.emotionalState !== 'regulated') {
                        piece1.updateRelationship(piece2.id, 0.3);
                    }
                }
            });
        });
        
        // Visualize strong relationships
        this.board.drawRelationships(playerPieces);
    }
    
    checkForcedMoves(team) {
        const pieces = Array.from(this.state.pieces.values())
            .filter(p => p.team === team && !p.captured);
        
        const forcedMoves = [];
        
        pieces.forEach(piece => {
            const captures = this.board.calculateCaptureMoves(piece);
            if (captures.length > 0) {
                forcedMoves.push({ piece, moves: captures });
            }
        });
        
        return forcedMoves;
    }
    
    highlightForcedMoves(forcedMoves) {
        forcedMoves.forEach(({ piece }) => {
            const square = this.board.squares[piece.position.row][piece.position.col];
            square.classList.add('forced-move');
        });
    }
    
    checkSpecialEvents() {
        // Check for breakthroughs
        this.checkBreakthroughs();
        
        // Check for defections
        this.checkDefections();
        
        // Check for team morale
        this.checkTeamMorale();
    }
    
    checkBreakthroughs() {
        const playerPieces = Array.from(this.state.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        playerPieces.forEach(piece => {
            if (piece.trust >= 8 && !piece.hasBreakthrough && piece.emotionalState === 'regulated') {
                if (Math.random() < 0.3) {
                    this.triggerBreakthrough(piece);
                }
            }
        });
    }
    
    triggerBreakthrough(piece) {
        piece.hasBreakthrough = true;
        piece.trust = 10;
        piece.resilience += 2;
        
        this.showNotification(
            `${piece.name} had a breakthrough! Trust maximized!`,
            'breakthrough'
        );
        
        sfx.breakthrough();
        
        // Inspire nearby pieces
        const adjacent = this.getAdjacentPieces(piece);
        adjacent.forEach(adj => {
            adj.trust = Math.min(10, adj.trust + 2);
            if (adj.emotionalState !== 'regulated') {
                adj.regulate();
            }
        });
        
        this.state.stats.breakthroughs++;
        
        track('breakthrough', 'emotional', {
            pieceId: piece.id,
            triggerType: 'trust_threshold',
            trust: piece.trust
        });
    }
    
    checkDefections() {
        const playerPieces = Array.from(this.state.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        playerPieces.forEach(piece => {
            if (piece.trust <= -3) {
                piece.defectionRisk = true;
                
                if (piece.trust <= -5) {
                    this.processDefection(piece);
                }
            }
        });
    }
    
    processDefection(piece) {
        piece.team = 'opponent';
        piece.defected = true;
        
        this.showNotification(
            `${piece.name} has defected to the opponent! Trust broken...`,
            'error'
        );
        
        // Emotional impact on other pieces
        const witnesses = Array.from(this.state.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        witnesses.forEach(witness => {
            witness.trust = Math.max(-5, witness.trust - 1);
            witness.addMemory({
                type: 'witnessed_defection',
                description: `Saw ${piece.name} leave us`,
                impact: -2
            });
        });
        
        this.state.stats.defections++;
    }
    
    checkTeamMorale() {
        const playerPieces = Array.from(this.state.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        if (playerPieces.length === 0) return;
        
        const avgTrust = playerPieces.reduce((sum, p) => sum + p.trust, 0) / playerPieces.length;
        const regulated = playerPieces.filter(p => p.emotionalState === 'regulated').length;
        
        // High morale effects
        if (avgTrust > 7 && regulated === playerPieces.length) {
            this.state.teamMorale = 'high';
            
            // Morale boost
            playerPieces.forEach(piece => {
                piece.resilience = Math.min(10, piece.resilience + 0.1);
            });
        }
        
        // Low morale effects
        if (avgTrust < 0) {
            this.state.teamMorale = 'low';
            
            // Morale penalty
            playerPieces.forEach(piece => {
                if (Math.random() < 0.2) {
                    piece.dysregulate('shutdown');
                }
            });
        }
    }
    
    // Storm handling
    handleStormApproaching() {
        this.showNotification(
            'Emotional storm approaching! Prepare your pieces!',
            'warning'
        );
        
        audioManager.playStormSequence('approaching');
        this.board.applyStormEffect(0.3);
    }
    
    handleStormActive({ intensity }) {
        const playerPieces = Array.from(this.state.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        playerPieces.forEach(piece => {
            const stormImpact = this.stormSystem.calculateStormImpact(piece, intensity);
            
            if (stormImpact.dysregulate && piece.emotionalState === 'regulated') {
                piece.dysregulate(stormImpact.type);
                this.showNotification(
                    `${piece.name} is overwhelmed by the storm!`,
                    'warning'
                );
            }
            
            if (stormImpact.trustLoss > 0) {
                piece.trust -= stormImpact.trustLoss;
            }
        });
        
        audioManager.playStormSequence('active');
        this.board.applyStormEffect(intensity);
        
        this.state.stats.stormsWeathered++;
    }
    
    handleStormPassing() {
        this.showNotification(
            'The storm is passing... Check on your pieces.',
            'info'
        );
        
        audioManager.playStormSequence('passing');
        this.board.removeStormEffect();
        
        // Post-storm support phase
        this.startSupportPhase();
    }
    
    startSupportPhase() {
        // Allow multiple empathy actions
        this.supportPhaseActive = true;
        
        const dysregulated = Array.from(this.state.pieces.values())
            .filter(p => p.team === 'player' && !p.captured && p.emotionalState !== 'regulated');
        
        if (dysregulated.length > 0) {
            this.showNotification(
                `Support phase: Help ${dysregulated.length} struggling pieces`,
                'info'
            );
        }
    }
    
    // Game ending
    checkGameEnd() {
        const playerPieces = Array.from(this.state.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        const opponentPieces = Array.from(this.state.pieces.values())
            .filter(p => p.team === 'opponent' && !p.captured);
        
        if (playerPieces.length === 0) {
            this.endGame('defeat');
        } else if (opponentPieces.length === 0) {
            this.endGame('victory');
        } else {
            // Check for no valid moves
            const playerHasMoves = playerPieces.some(piece => 
                this.board.calculatePossibleMoves(piece).length > 0
            );
            
            if (!playerHasMoves) {
                this.endGame('defeat');
            }
        }
    }
    
    endGame(result) {
        this.state.phase = result;
        clearInterval(this.autoSaveInterval);
        
        // Calculate final stats
        const matchDuration = Date.now() - this.state.matchStartTime;
        const playerPieces = Array.from(this.state.pieces.values())
            .filter(p => p.team === 'player');
        
        const finalStats = {
            ...this.state.stats,
            result: result,
            duration: matchDuration,
            finalTrust: new Map(playerPieces.map(p => [p.id, p.trust])),
            avgFinalTrust: playerPieces.reduce((sum, p) => sum + p.trust, 0) / playerPieces.length,
            team: this.config.team,
            difficulty: this.config.difficulty
        };
        
        // Update global statistics
        saveManager.updateStatistics(finalStats);
        
        // Generate debrief
        const debrief = window.debriefGenerator?.generateDebrief(finalStats, this.state);
        
        // Show results
        this.showGameResults(result, debrief);
        
        this.emit('gameEnded', { result, stats: finalStats, debrief });
    }
    
    showGameResults(result, debrief) {
        const modal = document.createElement('div');
        modal.className = 'game-results-modal';
        
        modal.innerHTML = `
            <div class="results-content">
                <h2>${result === 'victory' ? 'Victory!' : 'Defeat'}</h2>
                <div class="results-summary">${debrief.summary}</div>
                
                <div class="results-stats">
                    <h3>Your Journey</h3>
                    <ul>
                        <li>Trust Built: ${debrief.stats.trustGained}</li>
                        <li>Breakthroughs: ${debrief.stats.breakthroughCount}</li>
                        <li>Empathy Success: ${debrief.stats.empathySuccessRate}%</li>
                        <li>Emotional Intelligence: ${debrief.eqScore.overall}/100</li>
                    </ul>
                </div>
                
                <div class="results-reflections">
                    <h3>Piece Reflections</h3>
                    ${debrief.pieceReflections.map(r => `
                        <p><strong>${r.piece}:</strong> "${r.text}"</p>
                    `).join('')}
                </div>
                
                <div class="results-actions">
                    <button onclick="window.location.reload()">Play Again</button>
                    <button onclick="window.location.href='#menu'">Main Menu</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Utility methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    showTurnHint() {
        const hints = [
            "Select a piece that needs emotional support first",
            "Building trust is as important as winning",
            "Watch for emotional contagion between pieces",
            "Some pieces need empathy before they can move"
        ];
        
        const hint = hints[Math.min(this.state.turnCount, hints.length - 1)];
        this.showNotification(hint, 'hint');
    }
    
    togglePause() {
        if (this.state.phase === 'playing') {
            this.state.phase = 'paused';
            this.showPauseMenu();
        } else if (this.state.phase === 'paused') {
            this.state.phase = 'playing';
            this.hidePauseMenu();
        }
    }
    
    saveGame() {
        const result = saveManager.save(this.state, 'manual', {
            name: `Turn ${this.state.turnCount}`,
            team: this.config.team
        });
        
        if (result.success) {
            this.showNotification('Game saved!', 'success');
        } else {
            this.showNotification('Save failed: ' + result.error, 'error');
        }
    }
    
    autoSave() {
        saveManager.save(this.state, 'auto', {
            name: 'Autosave',
            team: this.config.team
        });
    }
    
    createEmptyStats() {
        return {
            trustGained: 0,
            trustLost: 0,
            empathyAttempts: 0,
            successfulEmpathy: 0,
            piecesLost: 0,
            piecesCaptured: 0,
            breakthroughs: 0,
            defections: 0,
            stormsWeathered: 0,
            dysregulationEvents: 0,
            regulationSuccesses: 0
        };
    }
    
    // Error handling
    handleInitializationError(error) {
        const modal = document.createElement('div');
        modal.className = 'error-modal';
        modal.innerHTML = `
            <div class="error-content">
                <h2>Unable to Start Game</h2>
                <p>Something went wrong: ${error.message}</p>
                <button onclick="window.location.reload()">Try Again</button>
                <button onclick="window.location.href='#menu'">Return to Menu</button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
}

// Export for global access
window.GameController = GameController;