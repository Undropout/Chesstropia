// Manages emotional storms and environmental emotional events
export class StormSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.currentStorm = null;
        this.stormHistory = [];
        this.environmentalEffects = new Map();
        this.emotionalFieldStrength = 0;
        this.resonancePoints = [];
    }

    // Storm catalog with different types and effects
    getStormCatalog() {
        return {
            abandonment_echo: {
                name: "Abandonment Echo",
                description: "Memories of being left behind flood the board",
                trigger: "Low average trust",
                intensity: 3,
                duration: 3,
                primaryEffect: 'anxiety',
                secondaryEffect: 'flight',
                visualEffect: 'purple_waves',
                environmentalChanges: {
                    sanctuaryDisruption: true,
                    trustDecayRate: 1.5,
                    contagionBoost: 0.3
                },
                dialogue: {
                    warning: "The air feels heavy with old goodbyes...",
                    peak: "Everyone you trusted left you behind!",
                    passing: "The echoes fade, but the scars remain..."
                }
            },
            
            performance_pressure: {
                name: "Performance Pressure",
                description: "The weight of expectations crushes down",
                trigger: "Multiple failed moves",
                intensity: 4,
                duration: 4,
                primaryEffect: 'freeze',
                secondaryEffect: 'fawn',
                visualEffect: 'crushing_weight',
                environmentalChanges: {
                    movementRestriction: 0.5,
                    anxietySpread: true,
                    criticalEyes: true
                },
                dialogue: {
                    warning: "You can feel everyone watching, judging...",
                    peak: "You're not good enough! You'll never be good enough!",
                    passing: "The pressure lifts, but doubt lingers..."
                }
            },
            
            inner_critic_avalanche: {
                name: "Inner Critic Avalanche",
                description: "Every mistake ever made comes rushing back",
                trigger: "Piece at critical trust",
                intensity: 5,
                duration: 2,
                primaryEffect: 'shutdown',
                secondaryEffect: 'freeze',
                visualEffect: 'static_cascade',
                environmentalChanges: {
                    communicationBlock: true,
                    isolationFields: true,
                    hopeSupression: 0.7
                },
                dialogue: {
                    warning: "Whispers of self-doubt begin to grow louder...",
                    peak: "You're worthless! Pathetic! A disappointment!",
                    passing: "The cruel voice quiets, but doesn't disappear..."
                }
            },
            
            rage_wildfire: {
                name: "Rage Wildfire",
                description: "Suppressed anger explodes across the board",
                trigger: "Multiple dysregulated pieces",
                intensity: 4,
                duration: 3,
                primaryEffect: 'fight',
                secondaryEffect: 'flight',
                visualEffect: 'flame_spread',
                environmentalChanges: {
                    aggressionAmplification: 2.0,
                    relationshipDamage: true,
                    chaosField: true
                },
                dialogue: {
                    warning: "Temperature rising... tempers flaring...",
                    peak: "ENOUGH! I'VE HAD ENOUGH OF THIS!",
                    passing: "The fires die down, leaving ash and regret..."
                }
            },
            
            dissociation_fog: {
                name: "Dissociation Fog",
                description: "Reality becomes distant and unreal",
                trigger: "Extended emotional stress",
                intensity: 3,
                duration: 5,
                primaryEffect: 'shutdown',
                secondaryEffect: 'freeze',
                visualEffect: 'reality_blur',
                environmentalChanges: {
                    connectionSevering: true,
                    timeDistortion: true,
                    numbnessField: 0.8
                },
                dialogue: {
                    warning: "Everything starts to feel... unreal...",
                    peak: "Nothing matters. Nothing is real. Float away...",
                    passing: "Slowly, sensation returns to the world..."
                }
            }
        };
    }

    // Check if storm conditions are met
    checkStormTriggers() {
        const triggers = [];
        const pieces = Array.from(this.gameState.pieces.values()).filter(p => !p.captured);
        
        // Calculate various metrics
        const avgTrust = pieces.reduce((sum, p) => sum + p.trust, 0) / pieces.length;
        const dysregulatedCount = pieces.filter(p => p.emotionalState === 'dysregulated').length;
        const criticalPieces = pieces.filter(p => p.trust <= -3);
        
        // Check each storm's trigger conditions
        if (avgTrust < 3) {
            triggers.push('abandonment_echo');
        }
        
        if (this.gameState.recentFailures > 3) {
            triggers.push('performance_pressure');
        }
        
        if (criticalPieces.length > 0) {
            triggers.push('inner_critic_avalanche');
        }
        
        if (dysregulatedCount > pieces.length * 0.6) {
            triggers.push('rage_wildfire');
        }
        
        if (this.gameState.turn > 15 && avgTrust < 5) {
            triggers.push('dissociation_fog');
        }
        
        return triggers;
    }

    // Initialize a storm
    async triggerStorm(stormType = null) {
        // Select storm type if not specified
        if (!stormType) {
            const availableStorms = this.checkStormTriggers();
            if (availableStorms.length === 0) return;
            
            stormType = availableStorms[Math.floor(Math.random() * availableStorms.length)];
        }
        
        const stormData = this.getStormCatalog()[stormType];
        if (!stormData) return;
        
        this.currentStorm = {
            type: stormType,
            ...stormData,
            turnsRemaining: stormData.duration,
            affectedPieces: new Set(),
            epicenter: this.selectEpicenter(),
            phase: 'building'
        };
        
        // Show warning
        await this.showStormWarning();
        
        // Begin environmental changes
        this.applyEnvironmentalEffects();
        
        // Schedule storm phases
        this.currentStorm.phase = 'active';
        
        return this.currentStorm;
    }

    selectEpicenter() {
        // Storm originates from most troubled piece
        const pieces = Array.from(this.gameState.pieces.values())
            .filter(p => !p.captured);
        
        const troubled = pieces.sort((a, b) => {
            const aScore = (a.emotionalState === 'dysregulated' ? 10 : 0) - a.trust;
            const bScore = (b.emotionalState === 'dysregulated' ? 10 : 0) - b.trust;
            return bScore - aScore;
        });
        
        return troubled[0]?.position || { row: 4, col: 4 };
    }

    async showStormWarning() {
        this.gameState.triggerEvent({
            type: 'storm_warning',
            storm: this.currentStorm,
            message: this.currentStorm.dialogue.warning
        });
        
        // Create visual warning effects
        this.createStormVisuals('warning');
    }

    applyEnvironmentalEffects() {
        const effects = this.currentStorm.environmentalChanges;
        
        if (effects.sanctuaryDisruption) {
            // Sanctuary squares temporarily lose power
            this.disruptSanctuaries();
        }
        
        if (effects.trustDecayRate) {
            // Accelerate trust decay
            this.gameState.emotionalSystem.trustDecayRate *= effects.trustDecayRate;
        }
        
        if (effects.contagionBoost) {
            // Increase emotional contagion
            this.gameState.emotionalSystem.contagionThreshold += effects.contagionBoost;
        }
        
        if (effects.movementRestriction) {
            // Reduce movement range
            this.applyMovementRestriction(effects.movementRestriction);
        }
        
        if (effects.communicationBlock) {
            // Limit empathy command effectiveness
            this.applyCommunicationBlock();
        }
        
        if (effects.aggressionAmplification) {
            // Increase capture urges
            this.amplifyAggression(effects.aggressionAmplification);
        }
    }

    // Process storm effects each turn
    processStormTurn() {
        if (!this.currentStorm) return;
        
        // Spread storm effects
        this.spreadStormEffects();
        
        // Apply ongoing damage
        this.applyStormDamage();
        
        // Check for breakthrough moments
        this.checkStormBreakthroughs();
        
        // Update storm phase
        this.currentStorm.turnsRemaining--;
        
        if (this.currentStorm.turnsRemaining <= 0) {
            this.endStorm();
        } else if (this.currentStorm.turnsRemaining === 1) {
            this.currentStorm.phase = 'dissipating';
        }
    }

    spreadStormEffects() {
        const allPieces = Array.from(this.gameState.pieces.values())
            .filter(p => !p.captured);
        
        // Calculate distance from epicenter
        allPieces.forEach(piece => {
            const distance = this.calculateStormDistance(piece.position);
            const intensity = this.currentStorm.intensity - distance;
            
            if (intensity > 0 && !this.currentStorm.affectedPieces.has(piece.id)) {
                // Roll for storm effect
                const resistanceRoll = Math.random() * 10;
                const resistance = this.calculateStormResistance(piece);
                
                if (resistanceRoll > resistance) {
                    this.applyStormEffect(piece, intensity);
                }
            }
        });
        
        // Storm can move
        if (Math.random() < 0.3) {
            this.moveStormEpicenter();
        }
    }

    calculateStormDistance(position) {
        const epicenter = this.currentStorm.epicenter;
        return Math.abs(position.row - epicenter.row) + 
               Math.abs(position.col - epicenter.col);
    }

    calculateStormResistance(piece) {
        let resistance = piece.stormResistance || 3;
        
        // Trust provides resistance
        resistance += Math.max(0, piece.trust * 0.5);
        
        // Regulated pieces resist better
        if (piece.emotionalState === 'regulated') {
            resistance += 2;
        }
        
        // Sanctuary squares help (if not disrupted)
        if (this.gameState.board.isSquareSanctuary(piece.position) && 
            !this.currentStorm.environmentalChanges.sanctuaryDisruption) {
            resistance += 3;
        }
        
        // Supportive relationships help
        const supportNetwork = this.calculateSupportNetwork(piece);
        resistance += supportNetwork * 0.5;
        
        return resistance;
    }

    calculateSupportNetwork(piece) {
        const adjacent = this.gameState.board.getAdjacentPieces(piece.position);
        let support = 0;
        
        adjacent.forEach(other => {
            if (other.team === piece.team) {
                const relationship = piece.getRelationship(other.id);
                if (relationship > 3) support++;
                if (other.emotionalState === 'regulated' && other.trust > 6) support++;
            }
        });
        
        return support;
    }

    applyStormEffect(piece, intensity) {
        // Determine effect based on storm type
        const effectType = Math.random() < 0.7 ? 
            this.currentStorm.primaryEffect : 
            this.currentStorm.secondaryEffect;
        
        // Apply dysregulation
        piece.setEmotionalState('dysregulated', effectType);
        this.currentStorm.affectedPieces.add(piece.id);
        
        // Storm-specific effects
        this.applySpecificStormEffect(piece, effectType, intensity);
        
        // Trust damage
        const trustDamage = -0.5 * (intensity / this.currentStorm.intensity);
        piece.modifyTrust(trustDamage);
        
        // Add storm memory
        piece.addMemory('storm_hit', {
            storm: this.currentStorm.name,
            effect: effectType,
            intensity: intensity
        });
        
        // Visual effect
        this.createPieceStormVisual(piece, effectType);
    }

    applySpecificStormEffect(piece, effectType, intensity) {
        switch(this.currentStorm.type) {
            case 'abandonment_echo':
                // Pieces might flee or seek desperate connection
                if (effectType === 'flight') {
                    piece.planningDefection = Math.random() < 0.3;
                }
                break;
                
            case 'performance_pressure':
                // Pieces become paralyzed by perfectionism
                if (effectType === 'freeze') {
                    piece.temporaryBuffs.push({
                        type: 'perfectionism_paralysis',
                        duration: 2,
                        effect: 'cannot_move_unless_perfect'
                    });
                }
                break;
                
            case 'inner_critic_avalanche':
                // Severe self-worth damage
                piece.modifyTrust(-1);
                if (Math.random() < 0.2) {
                    piece.addMemory('worthlessness', {
                        message: "Maybe I really am worthless..."
                    });
                }
                break;
                
            case 'rage_wildfire':
                // Damages relationships
                const nearby = this.gameState.board.getAdjacentPieces(piece.position);
                nearby.forEach(other => {
                    piece.updateRelationship(other.id, -0.5);
                });
                break;
                
            case 'dissociation_fog':
                // Severe disconnection
                piece.temporaryBuffs.push({
                    type: 'dissociated',
                    duration: 3,
                    effect: 'cannot_form_connections'
                });
                break;
        }
    }

    applyStormDamage() {
        // Ongoing effects for affected pieces
        this.currentStorm.affectedPieces.forEach(pieceId => {
            const piece = this.gameState.pieces.get(pieceId);
            if (!piece || piece.captured) return;
            
            // Continued trust erosion
            if (this.currentStorm.phase === 'active') {
                piece.modifyTrust(-0.1);
            }
            
            // Phase-specific dialogue
            if (Math.random() < 0.2) {
                const dialogue = this.generateStormDialogue(piece);
                this.gameState.triggerEvent({
                    type: 'storm_dialogue',
                    piece: piece,
                    message: dialogue
                });
            }
        });
    }

    generateStormDialogue(piece) {
        const stormDialogue = {
            abandonment_echo: {
                anxiety: "They'll leave me too... they always do...",
                flight: "I have to go before they abandon me!",
                default: "Everyone leaves in the end..."
            },
            performance_pressure: {
                freeze: "I can't... what if I fail?",
                fawn: "Tell me what you want! I'll do anything!",
                default: "The weight... it's crushing me..."
            },
            inner_critic_avalanche: {
                shutdown: "...",
                freeze: "Worthless... pathetic... failure...",
                default: "The voice won't stop..."
            },
            rage_wildfire: {
                fight: "GET AWAY FROM ME!",
                flight: "I can't control it anymore!",
                default: "So much anger... where does it end?"
            },
            dissociation_fog: {
                shutdown: "Nothing is real...",
                freeze: "Am I even here?",
                default: "Floating... disconnected..."
            }
        };
        
        const stormType = this.currentStorm.type;
        const dialogueSet = stormDialogue[stormType];
        const state = piece.dysregulationType || 'default';
        
        return dialogueSet[state] || dialogueSet.default;
    }

    checkStormBreakthroughs() {
        // Some pieces might have breakthroughs during storms
        const affectedPieces = Array.from(this.currentStorm.affectedPieces)
            .map(id => this.gameState.pieces.get(id))
            .filter(p => p && !p.captured);
        
        affectedPieces.forEach(piece => {
            // High trust and support can lead to breakthrough
            if (piece.trust >= 6) {
                const support = this.calculateSupportNetwork(piece);
                const breakthroughChance = 0.1 + (support * 0.1) + (piece.trust * 0.02);
                
                if (Math.random() < breakthroughChance) {
                    this.triggerStormBreakthrough(piece);
                }
            }
        });
    }

    triggerStormBreakthrough(piece) {
        // Piece overcomes the storm
        piece.setEmotionalState('regulated');
        piece.emotionalArmor = 3; // Temporary protection
        piece.modifyTrust(2);
        
        // Remove from affected list
        this.currentStorm.affectedPieces.delete(piece.id);
        
        // Add powerful memory
        piece.addMemory('storm_breakthrough', {
            storm: this.currentStorm.name,
            message: "I survived the storm and found my strength"
        });
        
        // Inspire nearby pieces
        const nearby = this.gameState.board.getAdjacentPieces(piece.position)
            .filter(p => p.team === piece.team);
        
        nearby.forEach(other => {
            if (other.emotionalState === 'dysregulated') {
                other.modifyTrust(0.5);
                if (Math.random() < 0.3) {
                    other.setEmotionalState('regulated');
                }
            }
        });
        
        // Trigger event
        this.gameState.triggerEvent({
            type: 'storm_breakthrough',
            piece: piece,
            message: `${piece.name} finds strength in the storm!`
        });
    }

    moveStormEpicenter() {
        // Storm drifts across board
        const directions = [
            { row: -1, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: -1 },
            { row: 0, col: 1 }
        ];
        
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const newEpicenter = {
            row: Math.max(0, Math.min(7, this.currentStorm.epicenter.row + direction.row)),
            col: Math.max(0, Math.min(7, this.currentStorm.epicenter.col + direction.col))
        };
        
        this.currentStorm.epicenter = newEpicenter;
    }

    endStorm() {
        // Show storm ending message
        this.gameState.triggerEvent({
            type: 'storm_ending',
            storm: this.currentStorm,
            message: this.currentStorm.dialogue.passing,
            affectedCount: this.currentStorm.affectedPieces.size
        });
        
        // Remove environmental effects
        this.removeEnvironmentalEffects();
        
        // Process aftermath
        this.processStormAftermath();
        
        // Add to history
        this.stormHistory.push({
            type: this.currentStorm.type,
            duration: this.currentStorm.duration,
            affectedPieces: this.currentStorm.affectedPieces.size,
            breakthroughs: this.countBreakthroughs(),
            turn: this.gameState.turn
        });
        
        // Clear current storm
        this.currentStorm = null;
        this.gameState.emotionalWeather = 'clearing';
    }

    processStormAftermath() {
        // Some pieces bond through shared trauma
        const affected = Array.from(this.currentStorm.affectedPieces)
            .map(id => this.gameState.pieces.get(id))
            .filter(p => p && !p.captured);
        
        affected.forEach(piece => {
            // Find other storm survivors nearby
            const nearbySurvivors = this.gameState.board.getAdjacentPieces(piece.position)
                .filter(p => p.team === piece.team && 
                           this.currentStorm.affectedPieces.has(p.id));
            
            nearbySurvivors.forEach(survivor => {
                piece.updateRelationship(survivor.id, 1);
                survivor.updateRelationship(piece.id, 1);
                
                if (Math.random() < 0.3) {
                    piece.addMemory('trauma_bond', {
                        with: survivor.name,
                        storm: this.currentStorm.name
                    });
                }
            });
        });
    }

    // Environmental effect implementations
    disruptSanctuaries() {
        this.environmentalEffects.set('sanctuary_disruption', {
            active: true,
            restore: () => {
                // Sanctuaries will work again after storm
            }
        });
    }

    applyMovementRestriction(factor) {
        this.environmentalEffects.set('movement_restriction', {
            active: true,
            factor: factor,
            restore: () => {
                // Normal movement returns
            }
        });
    }

    applyCommunicationBlock() {
        this.environmentalEffects.set('communication_block', {
            active: true,
            effectiveness: 0.5,
            restore: () => {
                // Communication restored
            }
        });
    }

    amplifyAggression(factor) {
        this.environmentalEffects.set('aggression_amplification', {
            active: true,
            factor: factor,
            restore: () => {
                // Aggression normalizes
            }
        });
    }

    removeEnvironmentalEffects() {
        this.environmentalEffects.forEach(effect => {
            if (effect.restore) {
                effect.restore();
            }
        });
        this.environmentalEffects.clear();
        
        // Reset modified values
        this.gameState.emotionalSystem.trustDecayRate = 1;
        this.gameState.emotionalSystem.contagionThreshold = 0.5;
    }

    // Visual effect creators
    createStormVisuals(phase) {
        // These would trigger visual effects in the UI
        const visualData = {
            type: this.currentStorm.visualEffect,
            phase: phase,
            epicenter: this.currentStorm.epicenter,
            intensity: this.currentStorm.intensity
        };
        
        this.gameState.triggerEvent({
            type: 'storm_visual',
            visual: visualData
        });
    }

    createPieceStormVisual(piece, effectType) {
        // Individual piece being affected by storm
        this.gameState.triggerEvent({
            type: 'piece_storm_effect',
            piece: piece,
            effect: effectType,
            storm: this.currentStorm.type
        });
    }

    // Analytics
    countBreakthroughs() {
        return Array.from(this.gameState.pieces.values())
            .filter(p => p.memories.some(m => 
                m.type === 'storm_breakthrough' && 
                m.storm === this.currentStorm.name
            )).length;
    }

    getStormReport() {
        if (!this.currentStorm) return null;
        
        return {
            name: this.currentStorm.name,
            phase: this.currentStorm.phase,
            turnsRemaining: this.currentStorm.turnsRemaining,
            affectedPieces: this.currentStorm.affectedPieces.size,
            epicenter: this.currentStorm.epicenter,
            resistance: this.calculateAverageResistance()
        };
    }

    calculateAverageResistance() {
        const pieces = Array.from(this.gameState.pieces.values())
            .filter(p => !p.captured);
        
        const totalResistance = pieces.reduce((sum, p) => 
            sum + this.calculateStormResistance(p), 0
        );
        
        return (totalResistance / pieces.length).toFixed(1);
    }
}