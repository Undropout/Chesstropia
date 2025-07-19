// Manages turn flow and player/AI interactions
import { OpponentAI } from '../ai/OpponentAI.js';
import { audioManager } from '../utils/audioManager.js';

export class TurnManager {
    constructor(gameState, boardRenderer, empathyUI) {
        this.gameState = gameState;
        this.boardRenderer = boardRenderer;
        this.empathyUI = empathyUI;
        this.opponentAI = null;
        
        this.isPlayerTurn = true;
        this.turnInProgress = false;
        this.selectedPosition = null;
        this.currentPhase = 'selection'; // 'selection', 'empathy', 'movement'
        this.empathyTarget = null;
        
        // Tutorial tracking
        this.tutorialActive = false;
        this.tutorialStep = 0;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for game events
        window.addEventListener('chesstropia:event', (e) => {
            this.handleGameEvent(e.detail);
        });
        
        // Listen for empathy UI responses
        window.addEventListener('chesstropia:empathy_response', (e) => {
            this.handleEmpathyResponse(e.detail);
        });
    }

    startPlayerTurn() {
        this.isPlayerTurn = true;
        this.turnInProgress = true;
        this.currentPhase = 'selection';
        this.selectedPosition = null;
        
        // Update UI
        this.boardRenderer.clearHighlights();
        this.updateTurnIndicator();
        
        // Check for forced events
        this.checkTurnStartEvents();
    }

    checkTurnStartEvents() {
        // Check if any pieces need immediate attention
        const criticalPieces = Array.from(this.gameState.pieces.values())
            .filter(p => p.team === 'player' && 
                        p.emotionalState === 'dysregulated' &&
                        p.trust <= -3);
        
        if (criticalPieces.length > 0) {
            this.showCriticalAlert(criticalPieces[0]);
        }
        
        // Check objectives
        this.updateObjectiveDisplay();
    }

    handleSquareClick(position) {
        if (!this.isPlayerTurn || !this.turnInProgress) return;
        
        switch(this.currentPhase) {
            case 'selection':
                this.handleSelectionClick(position);
                break;
            case 'movement':
                this.handleMovementClick(position);
                break;
        }
    }

    handleSelectionClick(position) {
        const piece = this.gameState.board.getPieceAt(position);
        
        if (!piece) {
            // Clicked empty square - deselect
            this.clearSelection();
            return;
        }
        
        if (piece.team !== 'player') {
            // Can't select opponent pieces
            this.showMessage("That's not your piece");
            return;
        }
        
        // Try to select piece
        const selected = this.gameState.selectPiece(position);
        
        if (selected) {
            this.selectedPosition = position;
            
            // Check if piece needs emotional intervention
            if (piece.emotionalState === 'dysregulated') {
                this.startEmpathyPhase(piece);
            } else {
                // Show possible moves
                this.showPossibleMoves(piece);
                this.currentPhase = 'movement';
            }
            
            // Update display
            this.boardRenderer.highlightSquare(position, 'selected');
            this.displayPieceInfo(piece);
        }
    }

    handleMovementClick(targetPosition) {
        if (!this.selectedPosition) return;
        
        // Check if clicking the selected piece (deselect)
        if (targetPosition.row === this.selectedPosition.row && 
            targetPosition.col === this.selectedPosition.col) {
            this.clearSelection();
            return;
        }
        
        // Try to move
        this.attemptMove(targetPosition);
    }

    async attemptMove(targetPosition) {
        const piece = this.gameState.board.getPieceAt(this.selectedPosition);
        if (!piece) return;
        
        // Validate move
        const moveValidation = this.gameState.board.validateMove(piece, targetPosition);
        
        if (!moveValidation.valid) {
            this.showMessage("Invalid move");
            audioManager.play('error');
            return;
        }
        
        // Check for emotional blocks
        if (piece.emotionalState === 'dysregulated') {
            const blocked = await this.gameState.emotionalSystem.checkMoveIntervention(
                piece, 
                targetPosition
            );
            
            if (blocked) {
                this.startEmpathyPhase(piece, targetPosition);
                return;
            }
        }
        
        // Execute move
        const moveResult = await this.gameState.attemptMove(targetPosition);
        
        if (moveResult) {
            // Move successful
            audioManager.play('move');
            this.boardRenderer.animateMove(this.selectedPosition, targetPosition);
            
            // Clear selection
            this.clearSelection();
            
            // Update board
            this.boardRenderer.render(this.gameState.board);
            
            // Check for post-move events
            await this.checkPostMoveEvents();
            
            // End turn
            this.endPlayerTurn();
        }
    }

    startEmpathyPhase(piece, pendingMove = null) {
        this.currentPhase = 'empathy';
        this.empathyTarget = piece;
        
        // Get appropriate empathy options based on state
        const options = this.getEmpathyOptions(piece);
        
        // Show empathy interface
        this.empathyUI.show({
            piece: piece,
            state: piece.emotionalState,
            dysregulationType: piece.dysregulationType,
            options: options,
            context: pendingMove ? 'movement' : 'selection'
        });
        
        // Store pending move if any
        if (pendingMove) {
            this.pendingMove = pendingMove;
        }
    }

    getEmpathyOptions(piece) {
        const baseOptions = [
            { id: 'validate', text: "I understand", icon: '🤝' },
            { id: 'soothe', text: "You're safe", icon: '🛡️' },
            { id: 'reframe', text: "Let's think differently", icon: '🔍' },
            { id: 'pause', text: "Take your time", icon: '⏸️' }
        ];
        
        // Add state-specific options
        switch(piece.dysregulationType) {
            case 'anxiety':
                baseOptions.push(
                    { id: 'breathe', text: "Just breathe", icon: '💨' },
                    { id: 'here', text: "I'm here", icon: '🫂' }
                );
                break;
            case 'shutdown':
                baseOptions.push(
                    { id: 'space', text: "I'll give you space", icon: '🌌' },
                    { id: 'ready', text: "When you're ready", icon: '⏰' }
                );
                break;
            case 'fight':
                baseOptions.push(
                    { id: 'anger', text: "Your anger is valid", icon: '🔥' },
                    { id: 'channel', text: "Let's use this energy", icon: '⚡' }
                );
                break;
        }
        
        // Add harmful options (for learning)
        baseOptions.push(
            { id: 'dismiss', text: "Calm down", icon: '😤', harmful: true },
            { id: 'rush', text: "We don't have time", icon: '⏱️', harmful: true }
        );
        
        return baseOptions;
    }

    async handleEmpathyResponse(response) {
        const piece = this.empathyTarget;
        if (!piece) return;
        
        // Process the response
        const result = piece.respondToCommand(response.command, response.modifiers);
        
        // Show immediate feedback
        this.showEmpathyFeedback(piece, result);
        
        // Update UI
        this.displayPieceInfo(piece);
        this.boardRenderer.updatePieceDisplay(piece);
        
        // Handle state changes
        if (result.newState) {
            await this.handleStateChange(piece, result.newState);
        }
        
        // Check if we can proceed with movement
        if (piece.emotionalState === 'regulated' || 
            (piece.trust > 0 && piece.dysregulationType !== 'frozen')) {
            
            if (this.pendingMove) {
                // Continue with the move
                await this.attemptMove(this.pendingMove);
                this.pendingMove = null;
            } else {
                // Show moves now
                this.showPossibleMoves(piece);
                this.currentPhase = 'movement';
            }
        } else {
            // Piece still too dysregulated
            this.showMessage(`${piece.name} is still struggling`);
            this.clearSelection();
            
            // May need to select different piece
            if (piece.emotionalState === 'frozen' || piece.trust <= -4) {
                this.currentPhase = 'selection';
            }
        }
        
        // Clear empathy UI
        this.empathyUI.hide();
        this.empathyTarget = null;
    }

    showEmpathyFeedback(piece, result) {
        const modal = document.getElementById('event-modal');
        const text = document.getElementById('event-text');
        const options = document.getElementById('event-options');
        
        let feedbackClass = 'neutral';
        if (result.trustChange > 0) feedbackClass = 'positive';
        if (result.trustChange < 0) feedbackClass = 'negative';
        
        text.className = `event-text ${feedbackClass}`;
        text.textContent = result.message;
        
        options.innerHTML = `
            <div class="trust-change">
                Trust: ${result.trustChange > 0 ? '+' : ''}${result.trustChange}
            </div>
            <button class="empathy-button" onclick="closeFeedback()">Continue</button>
        `;
        
        modal.classList.remove('hidden');
        
        // Auto-hide after delay
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 3000);
    }

    async handleStateChange(piece, newState) {
        // Animate state change
        this.boardRenderer.animateStateChange(piece, newState);
        
        // Check for contagion
        if (newState === 'dysregulated') {
            await this.delay(500);
            this.gameState.emotionalSystem.checkEmotionalContagion();
        }
        
        // Update displays
        this.updateEmotionalHUD();
    }

    showPossibleMoves(piece) {
        const moves = this.gameState.board.getPossibleMoves(piece);
        
        moves.forEach(move => {
            const highlightType = move.type === 'capture' ? 'attack' : 'move';
            this.boardRenderer.highlightSquare(move.position, highlightType);
        });
        
        if (moves.length === 0) {
            this.showMessage(`${piece.name} can't move right now`);
        }
    }

    async checkPostMoveEvents() {
        // Check for captures trauma
        const events = this.gameState.activeEvents.filter(e => 
            e.type === 'capture_trauma' || 
            e.type === 'witness_trauma'
        );
        
        for (const event of events) {
            await this.showEventModal(event);
        }
        
        // Check objectives
        this.checkObjectiveCompletion();
    }

    async showEventModal(event) {
        return new Promise((resolve) => {
            const modal = document.getElementById('event-modal');
            const text = document.getElementById('event-text');
            const options = document.getElementById('event-options');
            
            text.textContent = event.message;
            
            if (event.requiresResponse) {
                options.innerHTML = event.options.map(opt => `
                    <button class="empathy-button" onclick="handleEventResponse('${opt.effect}')">
                        ${opt.text}
                    </button>
                `).join('');
            } else {
                options.innerHTML = `
                    <button class="empathy-button" onclick="closeEvent()">
                        Continue
                    </button>
                `;
            }
            
            modal.classList.remove('hidden');
            
            // Set up handlers
            window.handleEventResponse = (effect) => {
                // Process response
                this.processEventResponse(event, effect);
                modal.classList.add('hidden');
                resolve();
            };
            
            window.closeEvent = () => {
                modal.classList.add('hidden');
                resolve();
            };
        });
    }

    endPlayerTurn() {
        this.isPlayerTurn = false;
        this.turnInProgress = false;
        
        // Clear any highlights
        this.boardRenderer.clearHighlights();
        
        // Start opponent turn after delay
        setTimeout(() => {
            this.startOpponentTurn();
        }, 1000);
    }

    async startOpponentTurn() {
        // Initialize AI if needed
        if (!this.opponentAI) {
            const campaign = window.chesstropia.campaignManager;
            const aiStyle = campaign.getOpponentStyle();
            this.opponentAI = new OpponentAI(this.gameState, aiStyle);
        }
        
        // Show opponent thinking
        this.showMessage("Opponent is thinking...");
        
        // Get AI move
        await this.delay(1500); // Thinking delay
        const aiMove = this.opponentAI.selectMove();
        
        if (aiMove) {
            // Execute AI move
            await this.executeAIMove(aiMove);
        } else {
            // AI has no valid moves
            this.showMessage("Opponent cannot move");
        }
        
        // Switch back to player
        setTimeout(() => {
            this.startPlayerTurn();
        }, 1000);
    }

    async executeAIMove(move) {
        const { piece, target, empathyUsed } = move;
        
        // Show AI empathy if used
        if (empathyUsed && piece.emotionalState === 'dysregulated') {
            await this.showAIEmpathy(piece, empathyUsed);
        }
        
        // Animate move
        this.boardRenderer.animateMove(piece.position, target);
        
        // Execute move
        this.gameState.board.movePiece(piece, target);
        
        // Update display
        await this.delay(500);
        this.boardRenderer.render(this.gameState.board);
        
        // Process turn effects
        this.gameState.nextTurn();
    }

    // UI Helper methods
    clearSelection() {
        this.selectedPosition = null;
        this.currentPhase = 'selection';
        this.boardRenderer.clearHighlights();
        this.boardRenderer.render(this.gameState.board);
    }

    displayPieceInfo(piece) {
        const infoPanel = document.getElementById('piece-details');
        
        infoPanel.innerHTML = `
            <h4>${piece.name}</h4>
            <p class="piece-type">${piece.team} ${piece.type}</p>
            <div class="emotional-state ${piece.emotionalState}">
                <span class="state-label">Emotional State:</span>
                <span class="state-value">${piece.emotionalState}</span>
            </div>
            <div class="trust-meter">
                <span class="trust-label">Trust:</span>
                <div class="trust-bar">
                    <div class="trust-fill" style="width: ${(piece.trust + 5) * 10}%"></div>
                </div>
                <span class="trust-value">${piece.trust}/10</span>
            </div>
            ${piece.dysregulationType ? `
                <div class="dysregulation-info">
                    <span class="icon">⚠️</span>
                    <span>${piece.dysregulationType}</span>
                </div>
            ` : ''}
        `;
    }

    showMessage(message, duration = 3000) {
        const messageEl = document.createElement('div');
        messageEl.className = 'game-message';
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.classList.add('fade-out');
            setTimeout(() => messageEl.remove(), 500);
        }, duration);
    }

    updateTurnIndicator() {
        const turnCount = document.getElementById('turn-count');
        if (turnCount) {
            turnCount.textContent = this.gameState.turn;
        }
        
        const weather = document.getElementById('weather');
        if (weather) {
            weather.textContent = this.gameState.emotionalWeather.toUpperCase();
            weather.className = `weather-${this.gameState.emotionalWeather}`;
        }
    }

    updateEmotionalHUD() {
        const moraleHearts = document.querySelector('.morale-hearts');
        if (moraleHearts) {
            const hearts = '♥'.repeat(Math.floor(this.gameState.teamMorale / 2)) + 
                          '♡'.repeat(5 - Math.floor(this.gameState.teamMorale / 2));
            moraleHearts.textContent = hearts;
        }
    }

    updateObjectiveDisplay() {
        // Update objectives UI based on current match objectives
        const objectives = this.gameState.matchObjectives;
        // Implementation depends on UI structure
    }

    checkObjectiveCompletion() {
        const completed = this.gameState.matchObjectives.filter(obj => 
            obj.completed && !obj.acknowledged
        );
        
        completed.forEach(obj => {
            this.showMessage(`Objective Complete: ${obj.description}`);
            obj.acknowledged = true;
        });
    }

    // Utility methods
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    handleGameEvent(event) {
        // Process game events that require UI updates
        switch(event.type) {
            case 'selection_blocked':
                this.showMessage(event.message);
                break;
            case 'storm_warning':
                this.showStormWarning(event.storm);
                break;
            case 'emotional_contagion':
                this.showContagionEffect(event);
                break;
            // Add more event handlers as needed
        }
    }

    showStormWarning(storm) {
        const modal = document.getElementById('event-modal');
        const text = document.getElementById('event-text');
        const options = document.getElementById('event-options');
        
        text.innerHTML = `
            <div class="storm-warning">
                <h3>⛈️ EMOTIONAL STORM INCOMING ⛈️</h3>
                <p class="storm-name">${storm.name}</p>
                <p class="storm-trigger">"${storm.trigger}"</p>
                <p class="storm-intensity">Intensity: ${'⚡'.repeat(storm.intensity)}</p>
                <p>All pieces must make emotional saving throws!</p>
            </div>
        `;
        
        options.innerHTML = `
            <button class="empathy-button" onclick="acknowledgeStorm()">
                Brace for Impact
            </button>
        `;
        
        modal.classList.remove('hidden');
        
        window.acknowledgeStorm = () => {
            modal.classList.add('hidden');
            this.boardRenderer.showStormEffect();
        };
    }

    showContagionEffect(event) {
        // Visual effect showing emotional spread
        this.boardRenderer.animateContagion(
            event.source.position, 
            event.target.position
        );
        
        this.showMessage(event.message, 2000);
    }

    showCriticalAlert(piece) {
        this.showMessage(
            `⚠️ ${piece.name} is in crisis! Trust: ${piece.trust}`,
            5000
        );
        
        // Highlight piece
        this.boardRenderer.highlightSquare(piece.position, 'critical');
    }

    showAIEmpathy(piece, empathyType) {
        return new Promise((resolve) => {
            const messages = {
                'harsh': `Opponent to ${piece.name}: "Stop wasting time!"`,
                'confused': `Opponent to ${piece.name}: "I... don't know what to say."`,
                'learning': `Opponent to ${piece.name}: "Take your time. We'll figure this out."`
            };
            
            this.showMessage(messages[empathyType] || "Opponent attempts empathy...");
            
            setTimeout(resolve, 2000);
        });
    }
}

// Global functions for onclick handlers
window.closeFeedback = function() {
    document.getElementById('event-modal').classList.add('hidden');
};