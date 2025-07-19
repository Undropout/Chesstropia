// Manages emotional mechanics, storms, and contagion
export class EmotionalSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.activeStorm = null;
        this.contagionThreshold = 0.5; // Probability of emotional spread
        this.trustDecayRate = 1; // How fast trust decreases without attention
        this.lastEmotionalCheck = Date.now();
        this.dysregulationQueue = [];
        this.emotionalEvents = [];
    }

    // Initial dysregulation assignment
    applyInitialDysregulation(count) {
        const playerPieces = Array.from(this.gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        // Shuffle and select pieces
        const shuffled = this.shuffleArray([...playerPieces]);
        const targetPieces = shuffled.slice(0, Math.min(count, shuffled.length));

        targetPieces.forEach(piece => {
            const dysregulationType = this.selectDysregulationType(piece);
            piece.setEmotionalState('dysregulated', dysregulationType);
            
            // Add to UI notification queue
            this.dysregulationQueue.push({
                piece: piece,
                type: dysregulationType,
                message: this.getDysregulationMessage(piece, dysregulationType)
            });
        });

        // Also apply some to opponent for balance
        const opponentCount = Math.floor(count * 0.7); // Opponent gets fewer
        const opponentPieces = Array.from(this.gameState.pieces.values())
            .filter(p => p.team === 'opponent' && !p.captured);
        
        const shuffledOpponent = this.shuffleArray([...opponentPieces]);
        shuffledOpponent.slice(0, opponentCount).forEach(piece => {
            const dysregulationType = this.selectDysregulationType(piece);
            piece.setEmotionalState('dysregulated', dysregulationType);
        });
    }

    selectDysregulationType(piece) {
        // Based on personality, select appropriate dysregulation
        const weights = piece.personality.dysregulationTendencies || {
            'anxiety': 0.3,
            'shutdown': 0.2,
            'freeze': 0.2,
            'fight': 0.15,
            'fawn': 0.15
        };

        return this.weightedRandom(weights);
    }

    getDysregulationMessage(piece, type) {
        const messages = {
            'anxiety': `${piece.name} is trembling with anxiety`,
            'shutdown': `${piece.name} has gone quiet and distant`,
            'freeze': `${piece.name} is completely frozen`,
            'fight': `${piece.name} is bristling with anger`,
            'fawn': `${piece.name} is desperately trying to please`
        };
        return messages[type] || `${piece.name} is struggling emotionally`;
    }

    // Availability checks
    checkPieceAvailability(piece) {
        if (piece.emotionalState === 'frozen') {
            return {
                available: false,
                reason: 'frozen',
                message: `${piece.name} is completely frozen and cannot respond.`
            };
        }

        if (piece.emotionalState === 'shutdown') {
            // Shutdown pieces need gentle coaxing
            return {
                available: true,
                warning: 'needs_gentle_approach',
                message: `${piece.name} is shut down. Approach gently.`
            };
        }

        if (piece.trust <= -4 && piece.planningDefection) {
            return {
                available: false,
                reason: 'defection_imminent',
                message: `${piece.name} is looking at the other team...`
            };
        }

        return { available: true };
    }

    // Move intervention for dysregulated pieces
    async checkMoveIntervention(piece, targetPosition) {
        if (piece.emotionalState === 'regulated') {
            return false; // No intervention needed
        }

        // Different states require different interventions
        switch(piece.dysregulationType) {
            case 'anxiety':
                return this.handleAnxiousIntervention(piece, targetPosition);
            case 'freeze':
                return true; // Always needs intervention
            case 'fight':
                return this.handleAggressiveIntervention(piece, targetPosition);
            case 'fawn':
                return this.handleFawnIntervention(piece, targetPosition);
            case 'shutdown':
                return this.handleShutdownIntervention(piece, targetPosition);
            default:
                return false;
        }
    }

    async handleAnxiousIntervention(piece, targetPosition) {
        // Anxious pieces might need encouragement for big moves
        const moveDistance = Math.abs(targetPosition.row - piece.position.row) + 
                           Math.abs(targetPosition.col - piece.position.col);
        
        if (moveDistance > 2) {
            this.gameState.triggerEvent({
                type: 'anxiety_intervention',
                piece: piece,
                message: `${piece.name} is too anxious for such a big move`,
                requiresResponse: true
            });
            return true;
        }
        return false;
    }

    // Emotional storms
    triggerEmotionalStorm() {
        const stormTypes = [
            {
                name: 'Abandonment Echo',
                trigger: 'A memory of being left behind',
                intensity: 3,
                primaryEffect: 'anxiety',
                secondaryEffect: 'flight'
            },
            {
                name: 'Performance Pressure',
                trigger: 'Everyone is watching',
                intensity: 4,
                primaryEffect: 'freeze',
                secondaryEffect: 'fawn'
            },
            {
                name: 'Criticism Cascade',
                trigger: 'Harsh words echo in memory',
                intensity: 5,
                primaryEffect: 'shutdown',
                secondaryEffect: 'fight'
            }
        ];

        const storm = stormTypes[Math.floor(Math.random() * stormTypes.length)];
        this.activeStorm = {
            ...storm,
            turnsRemaining: storm.intensity,
            affectedPieces: new Set()
        };

        this.gameState.emotionalWeather = 'storm';
        this.gameState.triggerEvent({
            type: 'storm_warning',
            storm: storm,
            message: `Emotional Storm: ${storm.name}\nTrigger: ${storm.trigger}`
        });

        // Initial storm impact
        this.processStormEffects();
    }

    processStormEffects() {
        if (!this.activeStorm) return;

        const allPieces = Array.from(this.gameState.pieces.values())
            .filter(p => !p.captured);

        allPieces.forEach(piece => {
            if (this.activeStorm.affectedPieces.has(piece.id)) {
                // Already affected pieces might worsen
                if (Math.random() < 0.3) {
                    this.worsenEmotionalState(piece);
                }
            } else {
                // Check resistance
                const resistanceRoll = Math.random() * 10;
                const resistance = piece.stormResistance + (piece.trust * 0.5);
                
                if (resistanceRoll > resistance) {
                    // Piece affected by storm
                    const effect = Math.random() < 0.6 ? 
                        this.activeStorm.primaryEffect : 
                        this.activeStorm.secondaryEffect;
                    
                    piece.setEmotionalState('dysregulated', effect);
                    this.activeStorm.affectedPieces.add(piece.id);
                    
                    this.gameState.triggerEvent({
                        type: 'storm_affect',
                        piece: piece,
                        effect: effect,
                        message: `${piece.name} is overwhelmed by ${this.activeStorm.name}`
                    });
                }
            }
        });

        this.activeStorm.turnsRemaining--;
        if (this.activeStorm.turnsRemaining <= 0) {
            this.endStorm();
        }
    }

    endStorm() {
        this.gameState.emotionalWeather = 'clearing';
        this.gameState.triggerEvent({
            type: 'storm_end',
            message: 'The emotional storm is passing...',
            affectedCount: this.activeStorm.affectedPieces.size
        });
        
        // Some pieces might have breakthrough moments
        this.activeStorm.affectedPieces.forEach(pieceId => {
            const piece = this.gameState.pieces.get(pieceId);
            if (piece && piece.trust >= 6 && Math.random() < 0.3) {
                piece.addMemory('storm_survivor', {
                    storm: this.activeStorm.name,
                    message: 'We weathered it together'
                });
                piece.modifyTrust(1);
            }
        });
        
        this.activeStorm = null;
        
        // Weather clears next turn
        setTimeout(() => {
            this.gameState.emotionalWeather = 'stable';
        }, 1000);
    }

    // Emotional contagion
    checkEmotionalContagion() {
        const allPieces = Array.from(this.gameState.pieces.values())
            .filter(p => !p.captured);

        allPieces.forEach(piece => {
            if (piece.emotionalState === 'dysregulated') {
                // Check adjacent pieces
                const adjacent = this.gameState.board.getAdjacentPieces(piece.position);
                
                adjacent.forEach(adjPiece => {
                    if (adjPiece.emotionalState === 'regulated' && 
                        adjPiece.team === piece.team) {
                        
                        // Calculate contagion chance
                        const contagionChance = this.calculateContagionChance(piece, adjPiece);
                        
                        if (Math.random() < contagionChance) {
                            // Emotional contagion occurs
                            const contagionType = this.selectContagionType(piece.dysregulationType);
                            adjPiece.setEmotionalState('dysregulated', contagionType);
                            
                            this.gameState.triggerEvent({
                                type: 'emotional_contagion',
                                source: piece,
                                target: adjPiece,
                                message: `${adjPiece.name} is affected by ${piece.name}'s distress`
                            });
                        }
                    }
                });
            }
        });
    }

    calculateContagionChance(source, target) {
        let baseChance = this.contagionThreshold;
        
        // Relationship affects contagion
        const relationship = target.getRelationship(source.id);
        if (relationship > 5) {
            baseChance += 0.2; // Close friends feel each other's pain
        } else if (relationship < -3) {
            baseChance -= 0.1; // Dislike provides some emotional distance
        }
        
        // Trust in coach affects resistance
        if (target.trust > 7) {
            baseChance -= 0.3; // High trust provides emotional stability
        } else if (target.trust < 3) {
            baseChance += 0.2; // Low trust makes them vulnerable
        }
        
        // Personality resilience
        baseChance -= (target.stormResistance * 0.05);
        
        return Math.max(0, Math.min(0.8, baseChance));
    }

    selectContagionType(sourceType) {
        // Some emotions spread as themselves, others transform
        const contagionMap = {
            'anxiety': Math.random() < 0.7 ? 'anxiety' : 'freeze',
            'fight': Math.random() < 0.6 ? 'anxiety' : 'fight',
            'shutdown': Math.random() < 0.5 ? 'shutdown' : 'freeze',
            'freeze': 'anxiety',
            'fawn': Math.random() < 0.5 ? 'fawn' : 'anxiety'
        };
        
        return contagionMap[sourceType] || 'anxiety';
    }

    // Trauma processing
    checkCaptureTrauma(capturingPiece, capturedPiece) {
        // Some pieces have trauma around violence
        if (capturingPiece.personality.pacifist) {
            return {
                type: 'capture_trauma',
                piece: capturingPiece,
                message: `${capturingPiece.name}: "I didn't want to hurt anyone..."`,
                emotionalImpact: 'guilt'
            };
        }
        
        // Check if pieces had a relationship
        const relationship = capturingPiece.getRelationship(capturedPiece.id);
        if (relationship > 3) {
            return {
                type: 'friendly_fire_trauma',
                piece: capturingPiece,
                message: `${capturingPiece.name} captured a friend and feels terrible`,
                emotionalImpact: 'severe_guilt'
            };
        }
        
        return null;
    }

    processWitnessTrauma(capturedPiece) {
        // Nearby pieces witness the capture
        const witnesses = this.gameState.board.getAdjacentPieces(capturedPiece.position)
            .filter(p => p.team === capturedPiece.team);
        
        witnesses.forEach(witness => {
            const relationship = witness.getRelationship(capturedPiece.id);
            
            if (relationship > 5) {
                // Close friend captured
                witness.modifyTrust(-1);
                if (Math.random() < 0.5) {
                    witness.setEmotionalState('dysregulated', 'anxiety');
                    this.gameState.triggerEvent({
                        type: 'witness_trauma',
                        witness: witness,
                        captured: capturedPiece,
                        message: `${witness.name} saw their friend taken`
                    });
                }
            }
            
            // Update relationships with capturing team
            witness.updateRelationship('opponent_team', -0.5);
        });
    }

    checkMultiCaptureStress(capturingPiece) {
        // Multiple captures in one turn can cause distress
        capturingPiece.modifyTrust(-0.5);
        
        if (capturingPiece.personality.gentleSoul) {
            capturingPiece.setEmotionalState('dysregulated', 'guilt');
            this.gameState.triggerEvent({
                type: 'multi_capture_trauma',
                piece: capturingPiece,
                message: `${capturingPiece.name}: "So much violence... I can't..."`
            });
        }
    }

    // Promotion anxiety
    checkPromotionAnxiety(piece) {
        if (piece.personality.humbleOrigins || piece.personality.fearOfResponsibility) {
            return {
                triggered: true,
                message: `${piece.name}: "I'm not ready for this responsibility..."`
            };
        }
        
        if (piece.emotionalState === 'anxious') {
            return {
                triggered: true,
                message: `${piece.name} is too anxious about promotion`
            };
        }
        
        return { triggered: false };
    }

    // Turn-based processing
    processTurnEffects() {
        // Process active storm
        if (this.activeStorm) {
            this.processStormEffects();
        }
        
        // Check for natural recovery
        this.checkNaturalRecovery();
        
        // Process trust decay for ignored pieces
        this.processTrustDecay();
        
        // Check for special events
        this.checkSpecialEvents();
    }

    checkNaturalRecovery() {
        const dysregulatedPieces = Array.from(this.gameState.pieces.values())
            .filter(p => p.team === 'player' && 
                        p.emotionalState === 'dysregulated' && 
                        !p.captured);
        
        dysregulatedPieces.forEach(piece => {
            // High trust aids natural recovery
            if (piece.trust >= 7 && Math.random() < 0.3) {
                piece.setEmotionalState('regulated');
                piece.addMemory('self_regulation', {
                    message: 'Found my center again'
                });
                
                this.gameState.triggerEvent({
                    type: 'natural_recovery',
                    piece: piece,
                    message: `${piece.name} has self-regulated!`
                });
            }
        });
    }

    processTrustDecay() {
        // Pieces that haven't moved in a while may lose trust
        const unmoved = Array.from(this.gameState.pieces.values())
            .filter(p => p.team === 'player' && 
                        !p.captured && 
                        !p.hasMoved);
        
        unmoved.forEach(piece => {
            if (Math.random() < 0.2) {
                piece.modifyTrust(-0.1);
                if (piece.trust < 3) {
                    piece.currentMood = 'neglected';
                }
            }
        });
    }

    checkSpecialEvents() {
        // Random emotional events
        if (Math.random() < 0.1) {
            const eventTypes = [
                {
                    type: 'emotional_breakthrough',
                    condition: (p) => p.trust >= 8 && p.emotionalState === 'regulated',
                    effect: (p) => {
                        p.emotionalArmor = 2; // Temporary protection
                        p.addMemory('breakthrough', { message: 'I feel stronger' });
                    }
                },
                {
                    type: 'compassion_chain',
                    condition: (p) => p.emotionalState === 'regulated' && p.trust >= 5,
                    effect: (p) => {
                        // Helps nearby dysregulated pieces
                        const adjacent = this.gameState.board.getAdjacentPieces(p.position);
                        adjacent.forEach(adj => {
                            if (adj.team === p.team && adj.emotionalState === 'dysregulated') {
                                adj.modifyTrust(0.5);
                            }
                        });
                    }
                }
            ];
            
            // Try to trigger an event
            const pieces = Array.from(this.gameState.pieces.values())
                .filter(p => !p.captured);
            
            for (const event of eventTypes) {
                const eligible = pieces.filter(event.condition);
                if (eligible.length > 0) {
                    const chosen = eligible[Math.floor(Math.random() * eligible.length)];
                    event.effect(chosen);
                    this.gameState.triggerEvent({
                        type: event.type,
                        piece: chosen
                    });
                    break;
                }
            }
        }
    }

    // Utility methods
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    weightedRandom(weights) {
        const entries = Object.entries(weights);
        const totalWeight = entries.reduce((sum, [_, weight]) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const [value, weight] of entries) {
            random -= weight;
            if (random <= 0) {
                return value;
            }
        }
        
        return entries[0][0]; // Fallback
    }

    // State management
    serialize() {
        return {
            activeStorm: this.activeStorm,
            contagionThreshold: this.contagionThreshold,
            trustDecayRate: this.trustDecayRate,
            dysregulationQueue: this.dysregulationQueue
        };
    }

    deserialize(data) {
        Object.assign(this, data);
    }
}