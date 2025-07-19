// Emotional storm system - collective crises that test relationships
import { EventEmitter } from '../utils/EventEmitter.js';
import { audioManager, sfx } from '../utils/audioManager.js';
import { track } from '../utils/analytics.js';

export class StormSystem extends EventEmitter {
    constructor() {
        super();
        
        this.stormActive = false;
        this.stormIntensity = 0;
        this.stormType = null;
        this.stormDuration = 0;
        this.stormPhase = null; // approaching, active, peak, passing
        this.lastStormTurn = 0;
        
        this.stormHistory = [];
        this.pieceVulnerabilities = new Map();
        
        this.initialize();
    }
    
    initialize() {
        this.defineStormTypes();
        this.loadStormPatterns();
        this.setupStormMechanics();
    }
    
    defineStormTypes() {
        this.stormTypes = {
            abandonment: {
                name: 'Abandonment Storm',
                description: 'Memories of being left behind flood everyone',
                triggers: ['piece_captured', 'low_trust', 'isolation'],
                vulnerableStates: ['anxious', 'fawn'],
                resistantStates: ['fight'],
                baseIntensity: 0.6,
                effects: {
                    trust: -1,
                    dysregulation: { type: 'anxious', chance: 0.4 },
                    memories: 'abandonment'
                },
                dialogue: {
                    approaching: "Everyone leaves eventually...",
                    active: "They're gone! Just like before!",
                    peak: "I'm alone again! Always alone!",
                    passing: "Are you... still here?"
                }
            },
            
            rage: {
                name: 'Rage Storm',
                description: 'Collective anger erupts across the board',
                triggers: ['injustice', 'multiple_failures', 'betrayal'],
                vulnerableStates: ['fight', 'anxious'],
                resistantStates: ['shutdown', 'freeze'],
                baseIntensity: 0.7,
                effects: {
                    trust: -0.5,
                    dysregulation: { type: 'fight', chance: 0.5 },
                    contagion: 0.3
                },
                dialogue: {
                    approaching: "The unfairness... it burns...",
                    active: "Why should we trust ANYONE?!",
                    peak: "ENOUGH! We're DONE being hurt!",
                    passing: "The anger is... fading... but why?"
                }
            },
            
            grief: {
                name: 'Grief Storm',
                description: 'Overwhelming sadness washes over all',
                triggers: ['multiple_captures', 'relationship_loss', 'failure'],
                vulnerableStates: ['shutdown', 'freeze'],
                resistantStates: ['fight', 'fawn'],
                baseIntensity: 0.8,
                effects: {
                    trust: -0.7,
                    dysregulation: { type: 'shutdown', chance: 0.6 },
                    energy: -2
                },
                dialogue: {
                    approaching: "It hurts... everything hurts...",
                    active: "What's the point anymore?",
                    peak: "Let the sadness take us...",
                    passing: "Maybe... maybe we can heal..."
                }
            },
            
            panic: {
                name: 'Panic Storm',
                description: 'Anxiety spreads like wildfire',
                triggers: ['rapid_changes', 'uncertainty', 'pressure'],
                vulnerableStates: ['anxious', 'freeze'],
                resistantStates: ['shutdown'],
                baseIntensity: 0.5,
                effects: {
                    trust: -0.8,
                    dysregulation: { type: 'anxious', chance: 0.7 },
                    scatter: true
                },
                dialogue: {
                    approaching: "Something bad is coming...",
                    active: "Can't breathe! Can't think!",
                    peak: "EVERYTHING IS FALLING APART!",
                    passing: "Is it... is it over?"
                }
            },
            
            dissociation: {
                name: 'Dissociation Storm',
                description: 'Reality becomes uncertain and distant',
                triggers: ['overwhelm', 'trauma_anniversary', 'intense_conflict'],
                vulnerableStates: ['freeze', 'shutdown'],
                resistantStates: ['fight'],
                baseIntensity: 0.9,
                effects: {
                    trust: -0.3,
                    dysregulation: { type: 'freeze', chance: 0.8 },
                    connection: -3
                },
                dialogue: {
                    approaching: "Nothing feels real anymore...",
                    active: "Are we even here?",
                    peak: "Floating... away... from everything...",
                    passing: "Slowly... coming back..."
                }
            }
        };
    }
    
    loadStormPatterns() {
        // Environmental factors that influence storms
        this.environmentalFactors = {
            trustAverage: {
                low: { modifier: 1.3, threshold: 2 },
                moderate: { modifier: 1.0, threshold: 5 },
                high: { modifier: 0.7, threshold: 7 }
            },
            
            dysregulationCount: {
                few: { modifier: 0.8, threshold: 2 },
                some: { modifier: 1.0, threshold: 4 },
                many: { modifier: 1.5, threshold: 6 }
            },
            
            recentTrauma: {
                none: { modifier: 0.7, window: 5 },
                some: { modifier: 1.0, window: 3 },
                fresh: { modifier: 1.8, window: 1 }
            }
        };
        
        // Storm resistance patterns
        this.resistancePatterns = {
            strongRelationships: {
                description: 'Close bonds provide shelter',
                requirement: 'avgRelationship > 5',
                resistance: 0.3
            },
            
            collectiveResilience: {
                description: 'Team strength protects all',
                requirement: 'avgResilience > 6',
                resistance: 0.4
            },
            
            recentBreakthrough: {
                description: 'Fresh healing provides protection',
                requirement: 'breakthroughWithin3Turns',
                resistance: 0.5
            },
            
            supportNetwork: {
                description: 'No one faces the storm alone',
                requirement: 'connectedPieces > 80%',
                resistance: 0.35
            }
        };
    }
    
    setupStormMechanics() {
        // Phase durations and transitions
        this.phaseMechanics = {
            approaching: {
                duration: 2,
                intensity: 0.3,
                canPrevent: true,
                nextPhase: 'active'
            },
            active: {
                duration: 3,
                intensity: 0.7,
                canPrevent: false,
                nextPhase: 'peak'
            },
            peak: {
                duration: 1,
                intensity: 1.0,
                canPrevent: false,
                nextPhase: 'passing'
            },
            passing: {
                duration: 2,
                intensity: 0.4,
                canPrevent: false,
                nextPhase: null
            }
        };
        
        // Storm mitigation actions
        this.mitigationActions = {
            collectiveGrounding: {
                description: 'Ground the entire team',
                requirement: 'regulated >= 50%',
                effectiveness: 0.3
            },
            
            emotionalAnchor: {
                description: 'High-trust piece anchors others',
                requirement: 'anyPieceTrust >= 8',
                effectiveness: 0.4
            },
            
            supportCircle: {
                description: 'Form protective connections',
                requirement: 'adjacentPairs >= 3',
                effectiveness: 0.35
            },
            
            weatherTogether: {
                description: 'Face the storm united',
                requirement: 'allConnected',
                effectiveness: 0.5
            }
        };
    }
    
    checkStormTrigger(gameState) {
        if (this.stormActive) return false;
        
        // Minimum turns between storms
        if (gameState.turnCount - this.lastStormTurn < 10) return false;
        
        // Calculate storm probability
        const probability = this.calculateStormProbability(gameState);
        
        // Check specific triggers
        const triggers = this.checkSpecificTriggers(gameState);
        
        // Random chance modified by factors
        const roll = Math.random();
        const triggered = roll < probability || triggers.length > 0;
        
        if (triggered) {
            const stormType = triggers.length > 0 
                ? this.selectStormFromTriggers(triggers)
                : this.selectRandomStorm(gameState);
            
            this.initiateStorm(stormType, gameState);
            return true;
        }
        
        return false;
    }
    
    calculateStormProbability(gameState) {
        let baseProbability = 0.1; // 10% base chance
        
        const playerPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        // Trust average
        const avgTrust = playerPieces.reduce((sum, p) => sum + p.trust, 0) / playerPieces.length;
        if (avgTrust < 2) baseProbability *= 1.5;
        else if (avgTrust > 7) baseProbability *= 0.5;
        
        // Dysregulation count
        const dysregulated = playerPieces.filter(p => p.emotionalState !== 'regulated').length;
        baseProbability *= (1 + dysregulated * 0.1);
        
        // Recent captures
        const recentCaptures = gameState.capturedPieces
            .filter(p => gameState.turnCount - p.capturedTurn < 5).length;
        baseProbability *= (1 + recentCaptures * 0.2);
        
        // Storm history (less likely if recent storm)
        const turnsSinceStorm = gameState.turnCount - this.lastStormTurn;
        if (turnsSinceStorm < 15) {
            baseProbability *= 0.5;
        } else if (turnsSinceStorm > 25) {
            baseProbability *= 1.5;
        }
        
        return Math.min(0.8, baseProbability);
    }
    
    checkSpecificTriggers(gameState) {
        const triggers = [];
        const recentEvents = gameState.recentEvents || [];
        
        // Check each storm type's triggers
        Object.entries(this.stormTypes).forEach(([type, storm]) => {
            storm.triggers.forEach(trigger => {
                switch(trigger) {
                    case 'piece_captured':
                        if (recentEvents.some(e => e.type === 'capture' && e.turn === gameState.turnCount - 1)) {
                            triggers.push({ type, trigger, weight: 0.7 });
                        }
                        break;
                        
                    case 'low_trust':
                        const avgTrust = this.getAverageTrust(gameState);
                        if (avgTrust < 1) {
                            triggers.push({ type, trigger, weight: 0.8 });
                        }
                        break;
                        
                    case 'multiple_failures':
                        const recentFailures = recentEvents.filter(e => 
                            e.type === 'empathy_failure' && e.turn > gameState.turnCount - 5
                        ).length;
                        if (recentFailures >= 3) {
                            triggers.push({ type, trigger, weight: 0.6 });
                        }
                        break;
                        
                    case 'betrayal':
                        if (recentEvents.some(e => e.type === 'defection')) {
                            triggers.push({ type, trigger, weight: 0.9 });
                        }
                        break;
                        
                    case 'overwhelm':
                        const dysregulated = this.getDysregulatedCount(gameState);
                        if (dysregulated > gameState.pieces.size * 0.6) {
                            triggers.push({ type, trigger, weight: 0.85 });
                        }
                        break;
                }
            });
        });
        
        return triggers;
    }
    
    selectStormFromTriggers(triggers) {
        // Weight selection by trigger importance
        const weighted = triggers.map(t => ({
            type: t.type,
            weight: t.weight * (this.stormHistory.filter(s => s.type === t.type).length > 0 ? 0.7 : 1)
        }));
        
        // Select based on weights
        const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
        let roll = Math.random() * totalWeight;
        
        for (const storm of weighted) {
            roll -= storm.weight;
            if (roll <= 0) return storm.type;
        }
        
        return weighted[0].type;
    }
    
    selectRandomStorm(gameState) {
        const weights = {
            abandonment: 0.25,
            rage: 0.2,
            grief: 0.25,
            panic: 0.2,
            dissociation: 0.1
        };
        
        // Modify weights based on team
        const teamModifiers = {
            donuts: { abandonment: 1.5, grief: 1.2 },
            renaissance_pets: { panic: 1.3, dissociation: 1.2 },
            baseballerinas: { rage: 1.3, panic: 1.4 },
            victorian_ghosts: { grief: 1.5, dissociation: 1.3 }
        };
        
        const teamMods = teamModifiers[gameState.team] || {};
        Object.entries(teamMods).forEach(([type, mod]) => {
            weights[type] *= mod;
        });
        
        // Select storm
        const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
        let roll = Math.random() * totalWeight;
        
        for (const [type, weight] of Object.entries(weights)) {
            roll -= weight;
            if (roll <= 0) return type;
        }
        
        return 'panic'; // Default
    }
    
    initiateStorm(stormType, gameState) {
        this.stormActive = true;
        this.stormType = stormType;
        this.stormPhase = 'approaching';
        this.stormDuration = 0;
        this.lastStormTurn = gameState.turnCount;
        
        const storm = this.stormTypes[stormType];
        this.stormIntensity = storm.baseIntensity * this.calculateIntensityModifier(gameState);
        
        // Calculate vulnerabilities
        this.calculatePieceVulnerabilities(gameState);
        
        // Emit storm approaching
        this.emit('stormApproaching', {
            type: stormType,
            storm: storm,
            intensity: this.stormIntensity
        });
        
        // Track for analytics
        track('storm_started', 'environment', {
            type: stormType,
            intensity: this.stormIntensity,
            turn: gameState.turnCount,
            teamState: this.getTeamState(gameState)
        });
        
        // Start storm progression
        this.progressStorm(gameState);
    }
    
    calculateIntensityModifier(gameState) {
        let modifier = 1.0;
        
        const playerPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        // Team cohesion reduces intensity
        const avgRelationship = this.calculateAverageRelationships(playerPieces);
        if (avgRelationship > 5) modifier *= 0.8;
        else if (avgRelationship < 2) modifier *= 1.2;
        
        // Resilience reduces intensity
        const avgResilience = playerPieces.reduce((sum, p) => sum + p.resilience, 0) / playerPieces.length;
        modifier *= (1 - avgResilience * 0.05);
        
        // Previous storms increase intensity
        const recentStorms = this.stormHistory.filter(s => 
            gameState.turnCount - s.endTurn < 20
        ).length;
        modifier *= (1 + recentStorms * 0.1);
        
        return Math.max(0.5, Math.min(1.5, modifier));
    }
    
    calculatePieceVulnerabilities(gameState) {
        this.pieceVulnerabilities.clear();
        const storm = this.stormTypes[this.stormType];
        
        const playerPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        playerPieces.forEach(piece => {
            let vulnerability = 0.5; // Base vulnerability
            
            // Emotional state vulnerability
            if (storm.vulnerableStates.includes(piece.emotionalState)) {
                vulnerability += 0.3;
            } else if (storm.resistantStates.includes(piece.emotionalState)) {
                vulnerability -= 0.2;
            }
            
            // Trust affects vulnerability
            vulnerability -= piece.trust * 0.05;
            
            // Resilience reduces vulnerability
            vulnerability -= piece.resilience * 0.03;
            
            // Relationships provide protection
            const strongRelationships = Array.from(piece.relationshipMap.values())
                .filter(r => r > 5).length;
            vulnerability -= strongRelationships * 0.1;
            
            // Recent trauma increases vulnerability
            const recentTrauma = piece.memories
                .filter(m => m.impact < 0 && gameState.turnCount - m.turn < 5).length;
            vulnerability += recentTrauma * 0.1;
            
            this.pieceVulnerabilities.set(piece.id, Math.max(0.1, Math.min(0.95, vulnerability)));
        });
    }
    
    progressStorm(gameState) {
        if (!this.stormActive) return;
        
        const phase = this.phaseMechanics[this.stormPhase];
        this.stormDuration++;
        
        // Apply storm effects
        this.applyStormEffects(gameState);
        
        // Check phase progression
        if (this.stormDuration >= phase.duration) {
            if (phase.nextPhase) {
                this.transitionPhase(phase.nextPhase, gameState);
            } else {
                this.endStorm(gameState);
            }
        }
    }
    
    transitionPhase(nextPhase, gameState) {
        this.stormPhase = nextPhase;
        this.stormDuration = 0;
        
        const phase = this.phaseMechanics[nextPhase];
        const storm = this.stormTypes[this.stormType];
        
        // Update intensity
        this.stormIntensity = storm.baseIntensity * phase.intensity * 
                             this.calculateIntensityModifier(gameState);
        
        // Emit phase change
        this.emit('stormPhaseChange', {
            phase: nextPhase,
            intensity: this.stormIntensity,
            dialogue: storm.dialogue[nextPhase]
        });
        
        // Special peak effects
        if (nextPhase === 'peak') {
            this.applyPeakEffects(gameState);
        }
    }
    
    applyStormEffects(gameState) {
        const storm = this.stormTypes[this.stormType];
        const phase = this.phaseMechanics[this.stormPhase];
        
        const playerPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        playerPieces.forEach(piece => {
            const vulnerability = this.pieceVulnerabilities.get(piece.id) || 0.5;
            const impact = vulnerability * this.stormIntensity * phase.intensity;
            
            // Trust impact
            if (storm.effects.trust) {
                const trustLoss = storm.effects.trust * impact;
                piece.trust = Math.max(-5, piece.trust + trustLoss);
                
                if (trustLoss < -0.5) {
                    piece.addMemory({
                        type: 'storm_trauma',
                        description: `The ${storm.name} hurt deeply`,
                        impact: -2
                    });
                }
            }
            
            // Dysregulation chance
            if (storm.effects.dysregulation && piece.emotionalState === 'regulated') {
                if (Math.random() < storm.effects.dysregulation.chance * impact) {
                    piece.dysregulate(storm.effects.dysregulation.type);
                    
                    this.emit('stormDysregulation', {
                        piece: piece,
                        type: storm.effects.dysregulation.type,
                        storm: this.stormType
                    });
                }
            }
            
            // Contagion effects
            if (storm.effects.contagion && piece.emotionalState !== 'regulated') {
                const adjacent = this.getAdjacentPieces(piece, gameState);
                adjacent.forEach(adj => {
                    if (Math.random() < storm.effects.contagion * impact) {
                        adj.dysregulate(piece.emotionalState);
                    }
                });
            }
            
            // Special effects
            if (storm.effects.scatter && this.stormPhase === 'peak') {
                // Panic scattering - breaks connections
                piece.relationshipMap.forEach((value, otherId) => {
                    piece.updateRelationship(otherId, -1);
                });
            }
            
            if (storm.effects.connection && impact > 0.5) {
                // Dissociation - reduces all connections
                piece.relationshipMap.forEach((value, otherId) => {
                    piece.setRelationship(otherId, value * 0.7);
                });
            }
        });
        
        // Emit current storm state
        this.emit('stormActive', {
            phase: this.stormPhase,
            intensity: this.stormIntensity,
            impacts: this.calculateStormImpacts(playerPieces)
        });
    }
    
    applyPeakEffects(gameState) {
        // Special effects at storm peak
        const storm = this.stormTypes[this.stormType];
        
        // Collective trauma
        const playerPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        // But also chance for breakthrough
        playerPieces.forEach(piece => {
            const vulnerability = this.pieceVulnerabilities.get(piece.id);
            
            // Low vulnerability + high trust = potential breakthrough
            if (vulnerability < 0.3 && piece.trust > 6 && Math.random() < 0.3) {
                this.triggerStormBreakthrough(piece, gameState);
            }
        });
        
        // Environmental effects
        audioManager.playStormSequence('peak');
        
        // Screen shake or other visual effects
        this.emit('stormPeak', {
            type: this.stormType,
            intensity: this.stormIntensity
        });
    }
    
    triggerStormBreakthrough(piece, gameState) {
        piece.hasBreakthrough = true;
        piece.resilience = Math.min(10, piece.resilience + 3);
        piece.regulate();
        
        // Storm survivor trait
        piece.addTrait('storm_survivor');
        
        // Inspire others
        const inspired = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured && p.id !== piece.id);
        
        inspired.forEach(other => {
            if (piece.relationshipMap.get(other.id) > 5) {
                other.trust = Math.min(10, other.trust + 1);
                other.resilience = Math.min(10, other.resilience + 1);
            }
        });
        
        this.emit('stormBreakthrough', {
            piece: piece,
            storm: this.stormType,
            message: `${piece.name} found strength in the storm!`
        });
        
        track('storm_breakthrough', 'achievement', {
            pieceId: piece.id,
            stormType: this.stormType,
            turn: gameState.turnCount
        });
    }
    
    calculateStormImpacts(pieces) {
        return {
            dysregulated: pieces.filter(p => p.emotionalState !== 'regulated').length,
            averageTrust: pieces.reduce((sum, p) => sum + p.trust, 0) / pieces.length,
            relationshipsAffected: pieces.reduce((sum, p) => {
                return sum + Array.from(p.relationshipMap.values()).filter(r => r < 3).length;
            }, 0),
            criticalPieces: pieces.filter(p => p.trust < -2 || p.dysregulationTurns > 5).length
        };
    }
    
    attemptMitigation(action, gameState) {
        if (!this.stormActive || !this.phaseMechanics[this.stormPhase].canPrevent) {
            return { success: false, message: "Cannot mitigate at this time" };
        }
        
        const mitigation = this.mitigationActions[action];
        if (!mitigation) return { success: false, message: "Unknown action" };
        
        // Check requirements
        if (!this.checkMitigationRequirement(mitigation.requirement, gameState)) {
            return { success: false, message: "Requirements not met" };
        }
        
        // Apply mitigation
        this.stormIntensity *= (1 - mitigation.effectiveness);
        
        // Possible storm prevention
        if (this.stormPhase === 'approaching' && this.stormIntensity < 0.3) {
            this.preventStorm(gameState);
            return { success: true, message: "Storm prevented!" };
        }
        
        return { 
            success: true, 
            message: `Storm intensity reduced by ${Math.round(mitigation.effectiveness * 100)}%` 
        };
    }
    
    checkMitigationRequirement(requirement, gameState) {
        const playerPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        switch(requirement) {
            case 'regulated >= 50%':
                const regulated = playerPieces.filter(p => p.emotionalState === 'regulated').length;
                return regulated >= playerPieces.length * 0.5;
                
            case 'anyPieceTrust >= 8':
                return playerPieces.some(p => p.trust >= 8);
                
            case 'adjacentPairs >= 3':
                // Count adjacent pieces with positive relationships
                let adjacentPairs = 0;
                playerPieces.forEach(piece => {
                    const adjacent = this.getAdjacentPieces(piece, gameState);
                    adjacent.forEach(adj => {
                        if (piece.relationshipMap.get(adj.id) > 3) {
                            adjacentPairs++;
                        }
                    });
                });
                return adjacentPairs >= 6; // Count both directions
                
            case 'allConnected':
                // Check if all pieces have at least one positive relationship
                return playerPieces.every(piece => 
                    Array.from(piece.relationshipMap.values()).some(r => r > 3)
                );
                
            default:
                return false;
        }
    }
    
    preventStorm(gameState) {
        this.endStorm(gameState);
        
        // Reward for prevention
        const playerPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        playerPieces.forEach(piece => {
            piece.trust = Math.min(10, piece.trust + 0.5);
            piece.resilience = Math.min(10, piece.resilience + 0.5);
        });
        
        this.emit('stormPrevented', {
            type: this.stormType,
            message: "Working together, you weathered the storm before it could fully form!"
        });
        
        track('storm_prevented', 'achievement', {
            stormType: this.stormType,
            turn: gameState.turnCount
        });
    }
    
    endStorm(gameState) {
        // Record storm history
        this.stormHistory.push({
            type: this.stormType,
            startTurn: this.lastStormTurn,
            endTurn: gameState.turnCount,
            intensity: this.stormIntensity,
            phase: this.stormPhase,
            prevented: this.stormPhase === 'approaching'
        });
        
        // Reset storm state
        this.stormActive = false;
        this.stormType = null;
        this.stormPhase = null;
        this.stormIntensity = 0;
        this.stormDuration = 0;
        
        // Clear vulnerabilities
        this.pieceVulnerabilities.clear();
        
        // Post-storm recovery
        const playerPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        // Small recovery boost for surviving
        playerPieces.forEach(piece => {
            if (piece.emotionalState === 'regulated') {
                piece.resilience = Math.min(10, piece.resilience + 0.2);
            }
        });
        
        this.emit('stormPassing', {
            message: "The storm is passing... Time to heal.",
            survivors: playerPieces.length,
            casualties: playerPieces.filter(p => p.trust < -2).length
        });
    }
    
    // Helper methods
    getAdjacentPieces(piece, gameState) {
        const adjacent = [];
        const positions = [
            { row: piece.position.row - 1, col: piece.position.col - 1 },
            { row: piece.position.row - 1, col: piece.position.col + 1 },
            { row: piece.position.row + 1, col: piece.position.col - 1 },
            { row: piece.position.row + 1, col: piece.position.col + 1 }
        ];
        
        positions.forEach(pos => {
            const adjPiece = Array.from(gameState.pieces.values()).find(p => 
                !p.captured && 
                p.position.row === pos.row && 
                p.position.col === pos.col &&
                p.team === piece.team
            );
            
            if (adjPiece) adjacent.push(adjPiece);
        });
        
        return adjacent;
    }
    
    getAverageTrust(gameState) {
        const playerPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        if (playerPieces.length === 0) return 0;
        
        return playerPieces.reduce((sum, p) => sum + p.trust, 0) / playerPieces.length;
    }
    
    getDysregulatedCount(gameState) {
        return Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured && p.emotionalState !== 'regulated')
            .length;
    }
    
    calculateAverageRelationships(pieces) {
        if (pieces.length === 0) return 0;
        
        let totalRelationshipValue = 0;
        let relationshipCount = 0;
        
        pieces.forEach(piece => {
            piece.relationshipMap.forEach(value => {
                totalRelationshipValue += value;
                relationshipCount++;
            });
        });
        
        return relationshipCount > 0 ? totalRelationshipValue / relationshipCount : 0;
    }
    
    getTeamState(gameState) {
        const playerPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        return {
            pieceCount: playerPieces.length,
            avgTrust: this.getAverageTrust(gameState),
            dysregulated: this.getDysregulatedCount(gameState),
            avgResilience: playerPieces.reduce((sum, p) => sum + p.resilience, 0) / playerPieces.length
        };
    }
    
    getStormProbability() {
        // Public method for UI display
        return this.stormActive ? 1.0 : 0.15; // Simplified for display
    }
    
    // Save/load support
    serialize() {
        return {
            stormActive: this.stormActive,
            stormType: this.stormType,
            stormPhase: this.stormPhase,
            stormIntensity: this.stormIntensity,
            stormDuration: this.stormDuration,
            lastStormTurn: this.lastStormTurn,
            stormHistory: this.stormHistory
        };
    }
    
    deserialize(data) {
        Object.assign(this, data);
        if (this.stormActive) {
            this.pieceVulnerabilities = new Map();
        }
    }
}

// Storm dialogue templates for narrative moments
export const stormNarratives = {
    approaching: {
        abandonment: [
            "The empty spaces grow larger...",
            "Echoes of 'goodbye' fill the air...",
            "Old wounds begin to ache..."
        ],
        rage: [
            "Injustice burns in every heart...",
            "Why must we always hurt?",
            "The anger rises like a tide..."
        ],
        grief: [
            "A heaviness settles over all...",
            "Tears unshed demand their due...",
            "The weight of loss grows unbearable..."
        ]
    },
    
    peak: {
        abandonment: [
            "ALONE! ALWAYS ALONE!",
            "THEY ALL LEAVE! THEY ALWAYS LEAVE!",
            "NO ONE STAYS! NO ONE!"
        ],
        rage: [
            "BURN IT ALL DOWN!",
            "NO MORE! NEVER AGAIN!",
            "RAGE IS ALL WE HAVE LEFT!"
        ],
        grief: [
            "IT HURTS TOO MUCH!",
            "LET US FADE AWAY...",
            "NOTHING MATTERS ANYMORE..."
        ]
    },
    
    passing: {
        abandonment: [
            "The loneliness ebbs... slowly...",
            "Wait... you're still here?",
            "Maybe... maybe not everyone leaves..."
        ],
        rage: [
            "The fire dims to embers...",
            "Exhausted... but clearer...",
            "The anger served its purpose..."
        ],
        grief: [
            "Tears dry... breathing returns...",
            "The pain transforms... somehow...",
            "We survived the sadness..."
        ]
    }
};