// AI system for individual piece emotional behaviors and autonomous actions
export class EmotionalAI {
    constructor(gameState) {
        this.gameState = gameState;
        this.emotionalMemory = new Map(); // Long-term emotional patterns
        this.activeRelationships = new Map(); // Piece-to-piece dynamics
        this.emotionalContagionQueue = [];
        this.autonomousActions = [];
    }

    // Process autonomous emotional behaviors each turn
    processTurnBehaviors() {
        const allPieces = Array.from(this.gameState.pieces.values())
            .filter(p => !p.captured);

        // Check each piece for autonomous actions
        allPieces.forEach(piece => {
            this.checkAutonomousBehaviors(piece);
            this.updateEmotionalMemory(piece);
            this.processRelationshipDynamics(piece);
        });

        // Process any queued autonomous actions
        this.executeAutonomousActions();
    }

    checkAutonomousBehaviors(piece) {
        // Pieces might act on their own based on emotional state
        if (piece.emotionalState === 'dysregulated') {
            switch(piece.dysregulationType) {
                case 'frozen':
                    this.checkFrozenBehavior(piece);
                    break;
                case 'flight':
                    this.checkFlightBehavior(piece);
                    break;
                case 'fight':
                    this.checkAggressiveBehavior(piece);
                    break;
                case 'fawn':
                    this.checkFawnBehavior(piece);
                    break;
                case 'shutdown':
                    this.checkShutdownBehavior(piece);
                    break;
            }
        }

        // Check for positive autonomous behaviors
        if (piece.trust >= 8) {
            this.checkSupportiveBehavior(piece);
        }

        // Check for defection
        if (piece.trust <= -4 && piece.planningDefection) {
            this.checkDefectionBehavior(piece);
        }
    }

    checkFrozenBehavior(piece) {
        // Frozen pieces might break free with support
        const adjacentAllies = this.gameState.board.getAdjacentPieces(piece.position)
            .filter(p => p.team === piece.team && p.emotionalState === 'regulated');

        if (adjacentAllies.length >= 2) {
            // Surrounded by support
            if (Math.random() < 0.3) {
                this.queueAutonomousAction({
                    type: 'thaw',
                    piece: piece,
                    helpers: adjacentAllies,
                    message: `${adjacentAllies[0].name} and ${adjacentAllies[1].name} help ${piece.name} feel safer`
                });
            }
        }
    }

    checkFlightBehavior(piece) {
        // Flight pieces might move away from threats autonomously
        const threats = this.detectThreats(piece);
        
        if (threats.length > 0 && Math.random() < 0.4) {
            const safeMoves = this.gameState.board.getPossibleMoves(piece)
                .filter(move => this.isSaferPosition(piece, move.position));

            if (safeMoves.length > 0) {
                const selectedMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
                this.queueAutonomousAction({
                    type: 'panic_move',
                    piece: piece,
                    move: selectedMove,
                    message: `${piece.name} flees in panic!`
                });
            }
        }
    }

    checkAggressiveBehavior(piece) {
        // Fight mode pieces might lash out
        if (Math.random() < 0.3) {
            const adjacentPieces = this.gameState.board.getAdjacentPieces(piece.position);
            
            // Might verbally lash out at allies
            const allies = adjacentPieces.filter(p => p.team === piece.team);
            if (allies.length > 0) {
                const target = allies[Math.floor(Math.random() * allies.length)];
                this.queueAutonomousAction({
                    type: 'lash_out',
                    piece: piece,
                    target: target,
                    message: `${piece.name} snaps at ${target.name}!`
                });
            }
        }
    }

    checkFawnBehavior(piece) {
        // Fawn pieces try to please everyone, even enemies
        const nearbyPieces = this.gameState.board.getAdjacentPieces(piece.position);
        const enemies = nearbyPieces.filter(p => p.team !== piece.team);

        if (enemies.length > 0 && Math.random() < 0.3) {
            this.queueAutonomousAction({
                type: 'inappropriate_friendliness',
                piece: piece,
                target: enemies[0],
                message: `${piece.name} tries to befriend enemy ${enemies[0].name}...`
            });
        }
    }

    checkShutdownBehavior(piece) {
        // Shutdown pieces become unresponsive
        if (Math.random() < 0.2) {
            this.queueAutonomousAction({
                type: 'complete_withdrawal',
                piece: piece,
                message: `${piece.name} goes completely silent...`,
                duration: 2 // Turns of being unselectable
            });
        }
    }

    checkSupportiveBehavior(piece) {
        // High trust pieces help others
        const nearbyDysregulated = this.gameState.board.getAdjacentPieces(piece.position)
            .filter(p => p.team === piece.team && p.emotionalState === 'dysregulated');

        if (nearbyDysregulated.length > 0 && Math.random() < 0.5) {
            const target = nearbyDysregulated[0];
            this.queueAutonomousAction({
                type: 'peer_support',
                piece: piece,
                target: target,
                message: `${piece.name} comforts ${target.name}`,
                effect: () => {
                    target.modifyTrust(0.5);
                    piece.updateRelationship(target.id, 1);
                    target.updateRelationship(piece.id, 1);
                }
            });
        }
    }

    checkDefectionBehavior(piece) {
        // Piece might switch sides
        if (Math.random() < 0.2) {
            // Find a path to the other side
            const possibleMoves = this.gameState.board.getPossibleMoves(piece);
            const defectionMoves = possibleMoves.filter(move => {
                // Moves toward enemy side
                return piece.team === 'player' ? 
                    move.position.row > piece.position.row :
                    move.position.row < piece.position.row;
            });

            if (defectionMoves.length > 0) {
                this.queueAutonomousAction({
                    type: 'defection_attempt',
                    piece: piece,
                    move: defectionMoves[0],
                    message: `${piece.name} is moving toward the enemy!`,
                    requiresIntervention: true
                });
            }
        }
    }

    detectThreats(piece) {
        const threats = [];
        
        // Check all enemy pieces
        const enemies = Array.from(this.gameState.pieces.values())
            .filter(p => p.team !== piece.team && !p.captured);

        enemies.forEach(enemy => {
            const distance = Math.abs(enemy.position.row - piece.position.row) +
                           Math.abs(enemy.position.col - piece.position.col);
            
            if (distance <= 3) {
                threats.push({
                    piece: enemy,
                    distance: distance,
                    threatLevel: enemy.type === 'king' ? 2 : 1
                });
            }
        });

        return threats.sort((a, b) => a.distance - b.distance);
    }

    isSaferPosition(piece, newPosition) {
        const currentThreats = this.detectThreats(piece).length;
        
        // Temporarily move piece to check
        const originalPos = piece.position;
        piece.position = newPosition;
        const newThreats = this.detectThreats(piece).length;
        piece.position = originalPos;

        return newThreats < currentThreats;
    }

    updateEmotionalMemory(piece) {
        const memory = this.emotionalMemory.get(piece.id) || {
            stateHistory: [],
            triggerPatterns: [],
            recoveryMethods: [],
            averageTrust: piece.trust
        };

        // Track emotional state patterns
        memory.stateHistory.push({
            state: piece.emotionalState,
            dysregulationType: piece.dysregulationType,
            trust: piece.trust,
            turn: this.gameState.turn
        });

        // Keep history manageable
        if (memory.stateHistory.length > 20) {
            memory.stateHistory.shift();
        }

        // Update average trust
        memory.averageTrust = memory.stateHistory.reduce((sum, h) => sum + h.trust, 0) / 
                             memory.stateHistory.length;

        // Detect patterns
        this.detectEmotionalPatterns(piece, memory);

        this.emotionalMemory.set(piece.id, memory);
    }

    detectEmotionalPatterns(piece, memory) {
        // Look for recurring triggers
        const recentStates = memory.stateHistory.slice(-5);
        
        if (recentStates.filter(s => s.state === 'dysregulated').length >= 3) {
            // Frequently dysregulated
            if (!memory.triggerPatterns.includes('chronic_dysregulation')) {
                memory.triggerPatterns.push('chronic_dysregulation');
                
                this.gameState.triggerEvent({
                    type: 'pattern_detected',
                    piece: piece,
                    pattern: 'chronic_dysregulation',
                    message: `${piece.name} seems to be struggling frequently`
                });
            }
        }

        // Check for improvement patterns
        const trustTrajectory = this.calculateTrustTrajectory(memory.stateHistory);
        if (trustTrajectory > 0.3) {
            if (!memory.recoveryMethods.includes('steady_improvement')) {
                memory.recoveryMethods.push('steady_improvement');
                
                this.gameState.triggerEvent({
                    type: 'positive_pattern',
                    piece: piece,
                    pattern: 'steady_improvement',
                    message: `${piece.name} is showing consistent growth!`
                });
            }
        }
    }

    calculateTrustTrajectory(history) {
        if (history.length < 3) return 0;
        
        const recent = history.slice(-5);
        let totalChange = 0;
        
        for (let i = 1; i < recent.length; i++) {
            totalChange += recent[i].trust - recent[i-1].trust;
        }
        
        return totalChange / (recent.length - 1);
    }

    processRelationshipDynamics(piece) {
        // Update relationships based on proximity and state
        const nearbyPieces = this.gameState.board.getAdjacentPieces(piece.position);
        
        nearbyPieces.forEach(other => {
            const currentRelationship = piece.getRelationship(other.id);
            
            // Same team dynamics
            if (other.team === piece.team) {
                if (piece.emotionalState === 'regulated' && other.emotionalState === 'regulated') {
                    // Stable pieces bond
                    piece.updateRelationship(other.id, 0.1);
                } else if (piece.emotionalState === 'dysregulated' && other.emotionalState === 'regulated') {
                    // Regulated piece helping dysregulated
                    if (other.trust >= 5) {
                        piece.updateRelationship(other.id, 0.2);
                        other.updateRelationship(piece.id, 0.1);
                    }
                } else if (both dysregulated) {
                    // Misery loves company, but it's not healthy
                    piece.updateRelationship(other.id, -0.1);
                }
            }
            
            // Track enemy relationships too
            if (other.team !== piece.team) {
                // Repeated proximity without capture can build respect
                if (currentRelationship > -2) {
                    piece.updateRelationship(other.id, 0.05);
                }
            }
        });
    }

    queueAutonomousAction(action) {
        this.autonomousActions.push(action);
    }

    async executeAutonomousActions() {
        for (const action of this.autonomousActions) {
            await this.executeAction(action);
        }
        this.autonomousActions = [];
    }

    async executeAction(action) {
        // Show event to player
        this.gameState.triggerEvent({
            type: 'autonomous_action',
            action: action
        });

        switch(action.type) {
            case 'thaw':
                await this.executeThaw(action);
                break;
                
            case 'panic_move':
                await this.executePanicMove(action);
                break;
                
            case 'lash_out':
                await this.executeLashOut(action);
                break;
                
            case 'peer_support':
                await this.executePeerSupport(action);
                break;
                
            case 'defection_attempt':
                await this.executeDefectionAttempt(action);
                break;
                
            case 'inappropriate_friendliness':
                await this.executeInappropriateFriendliness(action);
                break;
                
            case 'complete_withdrawal':
                await this.executeCompleteWithdrawal(action);
                break;
        }
    }

    async executeThaw(action) {
        const { piece, helpers } = action;
        
        // Show support animation
        // In actual implementation, would trigger visual effects
        
        piece.setEmotionalState('regulated');
        piece.addMemory('peer_support', {
            helpers: helpers.map(h => h.name),
            message: 'Friends helped me through the freeze'
        });
        
        // Strengthen bonds
        helpers.forEach(helper => {
            piece.updateRelationship(helper.id, 2);
            helper.updateRelationship(piece.id, 1);
        });
    }

    async executePanicMove(action) {
        const { piece, move } = action;
        
        // Check if player wants to intervene
        if (action.requiresIntervention) {
            const intervention = await this.requestPlayerIntervention(action);
            if (intervention.blocked) return;
        }
        
        // Execute the panic move
        this.gameState.board.movePiece(piece, move.position);
        piece.hasMoved = true;
        
        // Panic moves damage trust
        piece.modifyTrust(-0.5);
        piece.addMemory('panic_flight', {
            from: piece.position,
            to: move.position
        });
    }

    async executeLashOut(action) {
        const { piece, target } = action;
        
        // Verbal aggression damages relationships
        target.modifyTrust(-0.3);
        piece.updateRelationship(target.id, -1);
        target.updateRelationship(piece.id, -0.5);
        
        // Target might become dysregulated too
        if (target.emotionalState === 'regulated' && Math.random() < 0.3) {
            target.setEmotionalState('dysregulated', 'anxious');
            
            this.gameState.triggerEvent({
                type: 'emotional_contagion',
                source: piece,
                target: target,
                message: `${target.name} is hurt by ${piece.name}'s words`
            });
        }
    }

    async executePeerSupport(action) {
        const { piece, target, effect } = action;
        
        // Execute the support effect
        if (effect) {
            effect();
        }
        
        // Visual/dialogue feedback would go here
        piece.addMemory('helped_friend', {
            friend: target.name,
            state: target.dysregulationType
        });
    }

    async executeDefectionAttempt(action) {
        const { piece, move } = action;
        
        // This always requires intervention
        const intervention = await this.requestPlayerIntervention(action);
        
        if (!intervention.blocked) {
            // Piece defects!
            piece.team = piece.team === 'player' ? 'opponent' : 'player';
            piece.addMemory('defection', {
                reason: 'lost_trust',
                finalTrust: piece.trust
            });
            
            // Move to new position
            this.gameState.board.movePiece(piece, move.position);
            
            // Reset trust with new team
            piece.trust = 0;
            
            this.gameState.triggerEvent({
                type: 'defection_complete',
                piece: piece,
                message: `${piece.name} has joined the opposing team!`
            });
        }
    }

    async requestPlayerIntervention(action) {
        return new Promise((resolve) => {
            this.gameState.triggerEvent({
                type: 'intervention_required',
                action: action,
                callback: resolve
            });
        });
    }

    // Emotional weather predictions
    predictEmotionalWeather() {
        const allPieces = Array.from(this.gameState.pieces.values())
            .filter(p => !p.captured);
        
        const dysregulatedCount = allPieces.filter(p => 
            p.emotionalState === 'dysregulated'
        ).length;
        
        const avgTrust = allPieces.reduce((sum, p) => sum + p.trust, 0) / allPieces.length;
        
        // Calculate storm probability
        let stormChance = 0;
        
        if (dysregulatedCount > allPieces.length * 0.5) {
            stormChance += 0.3;
        }
        
        if (avgTrust < 3) {
            stormChance += 0.2;
        }
        
        if (this.gameState.turn > 10 && !this.gameState.emotionalSystem.activeStorm) {
            stormChance += 0.1; // Increasing tension
        }
        
        return {
            stormChance: stormChance,
            predictedWeather: this.getWeatherFromChance(stormChance),
            factors: {
                dysregulation: dysregulatedCount,
                averageTrust: avgTrust.toFixed(1),
                turnCount: this.gameState.turn
            }
        };
    }

    getWeatherFromChance(chance) {
        if (chance > 0.6) return 'storm_imminent';
        if (chance > 0.3) return 'building_tension';
        if (chance > 0.1) return 'uneasy_calm';
        return 'clear_skies';
    }

    // Generate contextual dialogue
    generatePieceDialogue(piece, context) {
        const templates = {
            anxious: {
                selected: [
                    "Oh no, everyone's looking at me...",
                    "What if I make the wrong move?",
                    "I... I don't know if I can do this..."
                ],
                moved: [
                    "Did I do that right?",
                    "I hope that was okay...",
                    "Please don't be mad if I messed up..."
                ],
                captured: [
                    "I knew this would happen!",
                    "I'm sorry, I tried...",
                    "Everything I was afraid of..."
                ]
            },
            
            shutdown: {
                selected: [
                    "...",
                    "Does it matter?",
                    "Whatever you want."
                ],
                moved: [
                    "...",
                    "There. Happy?",
                    "..."
                ],
                captured: [
                    "Finally.",
                    "...",
                    "At least it's over."
                ]
            },
            
            fight: {
                selected: [
                    "What?! What do you want?!",
                    "Fine! Let's do this!",
                    "Stop telling me what to do!"
                ],
                moved: [
                    "There! Satisfied?!",
                    "I did it, okay?!",
                    "Stop pushing me!"
                ],
                captured: [
                    "This is YOUR fault!",
                    "I HATE this game!",
                    "Are you HAPPY now?!"
                ]
            },
            
            regulated: {
                selected: [
                    "Ready when you are.",
                    "What's the plan?",
                    "I trust you."
                ],
                moved: [
                    "Good move?",
                    "I hope that helps.",
                    "We're doing this together."
                ],
                captured: [
                    "It's okay, you tried.",
                    "I'm not giving up.",
                    "Keep going, I believe in you."
                ]
            }
        };
        
        const state = piece.dysregulationType || piece.emotionalState;
        const dialogueSet = templates[state] || templates.regulated;
        const options = dialogueSet[context] || ["..."];
        
        return options[Math.floor(Math.random() * options.length)];
    }
}