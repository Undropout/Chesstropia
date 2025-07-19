// System for managing empathetic interactions with pieces
import { EventEmitter } from '../utils/EventEmitter.js';
import { genericResponses } from '../data/dialogue/genericResponses.js';
import { personalityTraits } from '../data/personalities.js';
import { sfx } from '../utils/audioManager.js';
import { track } from '../utils/analytics.js';

export class EmpathySystem extends EventEmitter {
    constructor() {
        super();
        
        this.activeInteraction = null;
        this.interactionHistory = [];
        this.empathyPatterns = new Map();
        this.comboTracker = new Map();
        
        this.initialize();
    }
    
    initialize() {
        this.loadEmpathyCommands();
        this.loadResponsePatterns();
        this.setupComboSystem();
    }
    
    loadEmpathyCommands() {
        // Base empathy commands available for all emotional states
        this.baseCommands = {
            validate: {
                id: 'validate',
                text: 'I see you\'re struggling',
                hint: 'Acknowledge their feelings',
                tags: ['acknowledgment', 'validation'],
                effectiveness: {
                    anxious: 0.8,
                    shutdown: 0.6,
                    fight: 0.7,
                    freeze: 0.5,
                    fawn: 0.9
                }
            },
            
            space: {
                id: 'space',
                text: 'Take all the time you need',
                hint: 'Give them room to process',
                tags: ['patience', 'space'],
                effectiveness: {
                    anxious: 0.5,
                    shutdown: 0.9,
                    fight: 0.4,
                    freeze: 0.8,
                    fawn: 0.3
                }
            },
            
            soothe: {
                id: 'soothe',
                text: 'You\'re safe here with me',
                hint: 'Offer comfort and safety',
                tags: ['comfort', 'safety'],
                effectiveness: {
                    anxious: 0.9,
                    shutdown: 0.4,
                    fight: 0.3,
                    freeze: 0.7,
                    fawn: 0.6
                }
            },
            
            encourage: {
                id: 'encourage',
                text: 'You\'re stronger than you know',
                hint: 'Build their confidence',
                tags: ['strength', 'encouragement'],
                effectiveness: {
                    anxious: 0.6,
                    shutdown: 0.3,
                    fight: 0.8,
                    freeze: 0.4,
                    fawn: 0.5
                }
            }
        };
        
        // State-specific commands
        this.stateCommands = {
            anxious: [
                {
                    id: 'breathe_together',
                    text: 'Let\'s breathe together',
                    hint: 'Help them regulate',
                    tags: ['regulation', 'grounding'],
                    effectiveness: { anxious: 0.9 }
                },
                {
                    id: 'normalize_worry',
                    text: 'It\'s okay to feel worried',
                    hint: 'Normalize their anxiety',
                    tags: ['normalization', 'acceptance'],
                    effectiveness: { anxious: 0.8 }
                }
            ],
            
            shutdown: [
                {
                    id: 'quiet_presence',
                    text: '(Sit quietly with them)',
                    hint: 'Just be present',
                    tags: ['presence', 'nonverbal'],
                    effectiveness: { shutdown: 0.9 }
                },
                {
                    id: 'no_pressure',
                    text: 'No need to talk',
                    hint: 'Remove performance pressure',
                    tags: ['acceptance', 'patience'],
                    effectiveness: { shutdown: 0.8 }
                }
            ],
            
            fight: [
                {
                    id: 'validate_anger',
                    text: 'Your anger makes sense',
                    hint: 'Validate their rage',
                    tags: ['validation', 'anger'],
                    effectiveness: { fight: 0.9 }
                },
                {
                    id: 'channel_energy',
                    text: 'Let\'s use that fire',
                    hint: 'Channel anger productively',
                    tags: ['redirection', 'empowerment'],
                    effectiveness: { fight: 0.8 }
                }
            ],
            
            freeze: [
                {
                    id: 'gentle_warmth',
                    text: 'I\'m here, no rush',
                    hint: 'Offer gentle presence',
                    tags: ['patience', 'warmth'],
                    effectiveness: { freeze: 0.9 }
                },
                {
                    id: 'small_steps',
                    text: 'Just wiggle a finger',
                    hint: 'Encourage micro-movements',
                    tags: ['gentle', 'gradual'],
                    effectiveness: { freeze: 0.7 }
                }
            ],
            
            fawn: [
                {
                    id: 'your_needs_matter',
                    text: 'What do YOU need?',
                    hint: 'Center their needs',
                    tags: ['boundaries', 'self-focus'],
                    effectiveness: { fawn: 0.9 }
                },
                {
                    id: 'no_pleasing_needed',
                    text: 'You don\'t need to please me',
                    hint: 'Release performance pressure',
                    tags: ['freedom', 'authenticity'],
                    effectiveness: { fawn: 0.8 }
                }
            ]
        };
        
        // Harmful responses to avoid
        this.harmfulResponses = {
            anxious: ['calm down', 'stop worrying', 'you\'re overreacting'],
            shutdown: ['talk to me', 'snap out of it', 'hello?'],
            fight: ['control yourself', 'calm down', 'too aggressive'],
            freeze: ['just move', 'hurry up', 'what\'s wrong with you'],
            fawn: ['stop being so needy', 'be yourself', 'you\'re too much']
        };
    }
    
    loadResponsePatterns() {
        // Personality-based response modifiers
        this.responseModifiers = {
            anxiousAttacher: {
                positiveMultiplier: 1.3,
                negativeMultiplier: 1.5,
                preferredTags: ['safety', 'validation', 'comfort'],
                avoidTags: ['space', 'independence']
            },
            
            avoidantProtector: {
                positiveMultiplier: 0.8,
                negativeMultiplier: 1.2,
                preferredTags: ['space', 'patience', 'respect'],
                avoidTags: ['closeness', 'intensity']
            },
            
            volatileReactor: {
                positiveMultiplier: 1.0,
                negativeMultiplier: 1.8,
                preferredTags: ['validation', 'intensity', 'action'],
                avoidTags: ['suppression', 'calm']
            },
            
            peoplepleaser: {
                positiveMultiplier: 1.2,
                negativeMultiplier: 1.4,
                preferredTags: ['boundaries', 'self-focus', 'worth'],
                avoidTags: ['performance', 'pleasing']
            },
            
            traumatizedFreezer: {
                positiveMultiplier: 0.7,
                negativeMultiplier: 1.6,
                preferredTags: ['patience', 'gentle', 'gradual'],
                avoidTags: ['pressure', 'speed']
            }
        };
    }
    
    setupComboSystem() {
        // Effective command combinations
        this.empathyCombos = {
            anxious_relief: {
                sequence: ['validate', 'breathe_together', 'soothe'],
                effect: 'Deep calming',
                bonus: 2
            },
            
            shutdown_thaw: {
                sequence: ['space', 'quiet_presence', 'gentle_warmth'],
                effect: 'Gradual opening',
                bonus: 3
            },
            
            anger_transformation: {
                sequence: ['validate_anger', 'channel_energy', 'encourage'],
                effect: 'Productive rage',
                bonus: 2
            },
            
            freeze_melt: {
                sequence: ['space', 'gentle_warmth', 'small_steps'],
                effect: 'Movement returns',
                bonus: 3
            },
            
            fawn_boundaries: {
                sequence: ['your_needs_matter', 'no_pleasing_needed', 'validate'],
                effect: 'Self-discovery',
                bonus: 2
            }
        };
    }
    
    getEmpathyOptions(piece) {
        const options = [];
        const state = piece.emotionalState;
        
        // Add base commands
        Object.values(this.baseCommands).forEach(command => {
            options.push(this.enhanceCommand(command, piece));
        });
        
        // Add state-specific commands
        if (this.stateCommands[state]) {
            this.stateCommands[state].forEach(command => {
                options.push(this.enhanceCommand(command, piece));
            });
        }
        
        // Sort by predicted effectiveness
        options.sort((a, b) => b.predictedSuccess - a.predictedSuccess);
        
        // Return top 4 options
        return options.slice(0, 4);
    }
    
    enhanceCommand(command, piece) {
        const enhanced = { ...command };
        
        // Calculate predicted success
        enhanced.predictedSuccess = this.calculatePredictedSuccess(command, piece);
        
        // Add personality-specific hints
        const modifier = this.responseModifiers[piece.personality.name];
        if (modifier) {
            if (command.tags.some(tag => modifier.preferredTags.includes(tag))) {
                enhanced.hint += ' ✓';
                enhanced.preferred = true;
            }
            if (command.tags.some(tag => modifier.avoidTags.includes(tag))) {
                enhanced.hint += ' ⚠';
                enhanced.risky = true;
            }
        }
        
        // Check combo potential
        const lastCommand = this.getLastCommand(piece.id);
        if (lastCommand) {
            const comboPotential = this.checkComboPotential(lastCommand, command.id);
            if (comboPotential) {
                enhanced.hint += ` (Combo: ${comboPotential.effect})`;
                enhanced.combo = comboPotential;
            }
        }
        
        return enhanced;
    }
    
    calculatePredictedSuccess(command, piece) {
        let success = 0.5; // Base 50% chance
        
        // State effectiveness
        const stateEffectiveness = command.effectiveness[piece.emotionalState] || 0.5;
        success = stateEffectiveness;
        
        // Personality modifier
        const modifier = this.responseModifiers[piece.personality.name];
        if (modifier) {
            if (command.tags.some(tag => modifier.preferredTags.includes(tag))) {
                success *= modifier.positiveMultiplier;
            }
            if (command.tags.some(tag => modifier.avoidTags.includes(tag))) {
                success *= 0.7;
            }
        }
        
        // Trust modifier
        const trustModifier = 0.5 + (piece.trust / 20); // -5 to 10 -> 0.25 to 1
        success *= trustModifier;
        
        // History modifier (learn from past interactions)
        const historyModifier = this.getHistoryModifier(piece.id, command.id);
        success *= historyModifier;
        
        // Dysregulation duration penalty
        if (piece.dysregulationTurns > 5) {
            success *= 0.8; // Harder to help if dysregulated for long
        }
        
        return Math.max(0.1, Math.min(0.95, success));
    }
    
    processEmpathy(piece, command) {
        const interaction = {
            pieceId: piece.id,
            command: command.id,
            timestamp: Date.now(),
            initialState: piece.emotionalState,
            initialTrust: piece.trust
        };
        
        this.activeInteraction = interaction;
        
        // Calculate success
        const roll = Math.random();
        const threshold = command.predictedSuccess || 0.5;
        const success = roll < threshold;
        
        // Check for critical success/failure
        const criticalSuccess = roll < threshold * 0.3;
        const criticalFailure = roll > 0.95;
        
        // Process result
        let result;
        if (criticalSuccess) {
            result = this.processCriticalSuccess(piece, command);
        } else if (criticalFailure) {
            result = this.processCriticalFailure(piece, command);
        } else if (success) {
            result = this.processSuccess(piece, command);
        } else {
            result = this.processFailure(piece, command);
        }
        
        // Complete interaction record
        interaction.success = success;
        interaction.result = result;
        interaction.finalState = piece.emotionalState;
        interaction.finalTrust = piece.trust;
        
        this.interactionHistory.push(interaction);
        this.updateEmpathyPattern(piece.id, command.id, success);
        
        // Check for combo completion
        if (command.combo) {
            this.processCombo(piece, command.combo);
        }
        
        // Emit result
        if (success) {
            this.emit('empathySuccess', { piece, command, result });
        } else {
            this.emit('empathyFailure', { piece, command, result });
        }
        
        return result;
    }
    
    processSuccess(piece, command) {
        const response = this.getSuccessResponse(piece, command);
        
        // Trust gain
        const trustGain = 0.5 + Math.random() * 0.5;
        piece.trust = Math.min(10, piece.trust + trustGain);
        
        // Possible regulation
        let regulated = false;
        if (Math.random() < 0.3 + (command.effectiveness[piece.emotionalState] || 0) * 0.4) {
            piece.regulate();
            regulated = true;
        } else {
            // Reduce dysregulation
            piece.dysregulationTurns = Math.max(0, piece.dysregulationTurns - 1);
        }
        
        // Create memory
        piece.addMemory({
            type: 'empathy_success',
            description: `You understood my ${piece.emotionalState} feelings`,
            impact: 1
        });
        
        // Sound effect
        sfx.empathySuccess();
        
        return {
            success: true,
            feedback: response,
            trustChange: trustGain,
            regulated: regulated,
            canMoveAnyway: piece.resilience > 5
        };
    }
    
    processCriticalSuccess(piece, command) {
        const response = "That's exactly what I needed to hear!";
        
        // Major trust gain
        const trustGain = 1.5 + Math.random();
        piece.trust = Math.min(10, piece.trust + trustGain);
        
        // Always regulate
        piece.regulate();
        
        // Resilience boost
        piece.resilience = Math.min(10, piece.resilience + 0.5);
        
        // Special memory
        piece.addMemory({
            type: 'perfect_empathy',
            description: 'You knew exactly what I needed',
            impact: 3
        });
        
        // Possible breakthrough trigger
        if (piece.trust >= 8 && !piece.hasBreakthrough) {
            piece.breakthroughReady = true;
        }
        
        // Sound effect
        sfx.empathyPerfect();
        
        return {
            success: true,
            critical: true,
            feedback: response,
            trustChange: trustGain,
            regulated: true,
            canMoveAnyway: true
        };
    }
    
    processFailure(piece, command) {
        const response = this.getFailureResponse(piece, command);
        
        // Trust loss
        const trustLoss = 0.3 + Math.random() * 0.4;
        piece.trust = Math.max(-5, piece.trust - trustLoss);
        
        // Worsen dysregulation
        piece.dysregulationTurns += 1;
        
        // Chance of emotional contagion
        if (Math.random() < 0.2) {
            piece.emotionalContagion = true;
        }
        
        // Negative memory
        piece.addMemory({
            type: 'empathy_failure',
            description: `You didn't understand my ${piece.emotionalState} feelings`,
            impact: -1
        });
        
        // Sound effect
        sfx.empathyFail();
        
        return {
            success: false,
            feedback: response,
            trustChange: -trustLoss,
            regulated: false,
            canMoveAnyway: false
        };
    }
    
    processCriticalFailure(piece, command) {
        const response = this.getHarmfulResponse(piece, command);
        
        // Major trust loss
        const trustLoss = 1 + Math.random();
        piece.trust = Math.max(-5, piece.trust - trustLoss);
        
        // Dysregulation worsens or changes
        if (Math.random() < 0.3) {
            // Switch to different dysregulation
            const states = ['anxious', 'shutdown', 'fight', 'freeze', 'fawn'];
            const newState = states[Math.floor(Math.random() * states.length)];
            piece.dysregulate(newState);
        } else {
            piece.dysregulationTurns += 2;
        }
        
        // Traumatic memory
        piece.addMemory({
            type: 'empathy_harm',
            description: 'Your words made it worse',
            impact: -3
        });
        
        // Defection risk
        if (piece.trust <= -3) {
            piece.defectionRisk = true;
        }
        
        return {
            success: false,
            critical: true,
            feedback: response,
            trustChange: -trustLoss,
            regulated: false,
            canMoveAnyway: false
        };
    }
    
    getSuccessResponse(piece, command) {
        const responses = genericResponses.empathyResponses[piece.emotionalState]?.positive[command.id];
        if (responses && responses.length > 0) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        return "That... actually helps. Thank you.";
    }
    
    getFailureResponse(piece, command) {
        const responses = genericResponses.empathyResponses[piece.emotionalState]?.negative.general;
        if (responses && responses.length > 0) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        return "That's not what I need right now...";
    }
    
    getHarmfulResponse(piece, command) {
        // Check if command matches harmful patterns
        const harmfulPhrases = this.harmfulResponses[piece.emotionalState] || [];
        
        const responses = [
            "That's exactly what NOT to say!",
            "You're making it so much worse!",
            "Do you even care about how I feel?",
            "I knew you wouldn't understand..."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    updateEmpathyPattern(pieceId, commandId, success) {
        if (!this.empathyPatterns.has(pieceId)) {
            this.empathyPatterns.set(pieceId, new Map());
        }
        
        const piecePatterns = this.empathyPatterns.get(pieceId);
        if (!piecePatterns.has(commandId)) {
            piecePatterns.set(commandId, { successes: 0, failures: 0 });
        }
        
        const pattern = piecePatterns.get(commandId);
        if (success) {
            pattern.successes++;
        } else {
            pattern.failures++;
        }
    }
    
    getHistoryModifier(pieceId, commandId) {
        const piecePatterns = this.empathyPatterns.get(pieceId);
        if (!piecePatterns) return 1.0;
        
        const pattern = piecePatterns.get(commandId);
        if (!pattern) return 1.0;
        
        const total = pattern.successes + pattern.failures;
        if (total < 3) return 1.0; // Not enough data
        
        const successRate = pattern.successes / total;
        
        // Learn from history
        if (successRate > 0.7) return 1.2; // This works well
        if (successRate < 0.3) return 0.8; // This doesn't work
        
        return 1.0;
    }
    
    getLastCommand(pieceId) {
        const recentInteractions = this.interactionHistory
            .filter(i => i.pieceId === pieceId)
            .slice(-3);
        
        if (recentInteractions.length === 0) return null;
        
        return recentInteractions[recentInteractions.length - 1].command;
    }
    
    checkComboPotential(lastCommand, currentCommand) {
        for (const [comboName, combo] of Object.entries(this.empathyCombos)) {
            const comboProgress = this.comboTracker.get(comboName) || 0;
            
            if (combo.sequence[comboProgress] === lastCommand &&
                combo.sequence[comboProgress + 1] === currentCommand) {
                return combo;
            }
        }
        
        return null;
    }
    
    processCombo(piece, combo) {
        // Apply combo bonus
        piece.trust = Math.min(10, piece.trust + combo.bonus);
        
        // Special effects based on combo
        switch(combo.effect) {
            case 'Deep calming':
                piece.resilience += 1;
                break;
            case 'Gradual opening':
                piece.trustGainRate *= 1.2;
                break;
            case 'Productive rage':
                piece.strength += 1;
                break;
            case 'Movement returns':
                piece.frozen = false;
                break;
            case 'Self-discovery':
                piece.authenticity = true;
                break;
        }
        
        // Track combo achievement
        track('empathy_combo', 'achievement', {
            combo: combo.effect,
            pieceId: piece.id
        });
    }
    
    // Group empathy (storm support)
    processGroupEmpathy(pieces, approach) {
        const results = [];
        
        pieces.forEach(piece => {
            if (piece.emotionalState === 'regulated') return;
            
            // Group approaches have different effectiveness
            const groupModifier = this.getGroupApproachModifier(approach, piece.emotionalState);
            
            const baseCommand = {
                id: approach,
                predictedSuccess: 0.6 * groupModifier
            };
            
            const result = this.processEmpathy(piece, baseCommand);
            results.push({ piece, result });
        });
        
        return results;
    }
    
    getGroupApproachModifier(approach, state) {
        const modifiers = {
            calm_presence: { anxious: 0.8, shutdown: 0.9, fight: 0.4, freeze: 0.7, fawn: 0.6 },
            group_validation: { anxious: 0.7, shutdown: 0.5, fight: 0.8, freeze: 0.6, fawn: 0.9 },
            collective_strength: { anxious: 0.6, shutdown: 0.4, fight: 0.9, freeze: 0.5, fawn: 0.7 }
        };
        
        return modifiers[approach]?.[state] || 0.5;
    }
    
    // Learning system
    getEmpathyInsights() {
        const insights = {
            patterns: [],
            recommendations: [],
            warnings: []
        };
        
        // Analyze patterns
        this.empathyPatterns.forEach((patterns, pieceId) => {
            patterns.forEach((stats, commandId) => {
                const successRate = stats.successes / (stats.successes + stats.failures);
                
                if (successRate > 0.8 && stats.successes > 3) {
                    insights.patterns.push({
                        piece: pieceId,
                        command: commandId,
                        effectiveness: 'high'
                    });
                } else if (successRate < 0.3 && stats.failures > 3) {
                    insights.warnings.push({
                        piece: pieceId,
                        command: commandId,
                        effectiveness: 'low'
                    });
                }
            });
        });
        
        // Generate recommendations
        if (insights.patterns.length > 0) {
            insights.recommendations.push('You\'ve found effective approaches for some pieces');
        }
        
        if (insights.warnings.length > 0) {
            insights.recommendations.push('Some approaches consistently fail - try alternatives');
        }
        
        return insights;
    }
    
    // Reset for new game
    reset() {
        this.activeInteraction = null;
        this.interactionHistory = [];
        this.empathyPatterns.clear();
        this.comboTracker.clear();
    }
}

// Empathy response templates for specific situations
export const situationalEmpathy = {
    firstInteraction: {
        gentle: "Hi there. I see you're having a tough time.",
        direct: "What's happening for you right now?",
        supportive: "I'm here. You're not alone in this."
    },
    
    afterFailure: {
        apologetic: "I'm sorry, that wasn't helpful. Let me try again.",
        patient: "I'm still learning what you need.",
        persistent: "We'll figure this out together."
    },
    
    afterSuccess: {
        encouraging: "See? You're doing great.",
        reinforcing: "That's the strength I knew you had.",
        connecting: "We make a good team."
    },
    
    duringStorm: {
        anchoring: "Focus on my voice. You're safe.",
        grounding: "Feel your feet on the ground. You're here.",
        protective: "I won't let the storm take you."
    },
    
    nearBreakthrough: {
        supporting: "Something's shifting in you. I can feel it.",
        encouraging: "You're so close to something beautiful.",
        witnessing: "I see you becoming who you really are."
    }
};