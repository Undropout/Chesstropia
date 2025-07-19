// Individual piece with emotional state and personality
export class Piece {
    constructor(id, team, type, position, personality) {
        // Basic properties
        this.id = id;
        this.team = team; // 'player' or 'opponent'
        this.type = type; // 'regular' or 'king'
        this.position = position;
        this.captured = false;
        this.hasMoved = false;

        // Personality and identity
        this.name = personality?.name || `Piece ${id}`;
        this.personality = personality || this.generateDefaultPersonality();
        this.backstory = personality?.backstory || "A piece with untold stories.";
        
        // Emotional properties
        this.emotionalState = 'regulated';
        this.dysregulationType = null;
        this.trust = 5; // -5 to 10 scale
        this.triggers = this.personality.triggers || [];
        this.comfortResponses = this.personality.comfortResponses || [];
        
        // Emotional history
        this.memories = [];
        this.recentCommands = []; // Last 3 commands for pattern detection
        this.emotionalHistory = [];
        this.relationshipMap = new Map(); // Other pieces -> relationship value
        
        // Current state modifiers
        this.stormResistance = this.personality.resilience || 3;
        this.currentMood = null;
        this.temporaryBuffs = [];
        this.emotionalArmor = 0;
    }

    generateDefaultPersonality() {
        return {
            name: `Piece ${this.id}`,
            coreWound: 'feeling unseen',
            triggers: ['harsh commands', 'being ignored'],
            comfortResponses: ['validation', 'patience'],
            resilience: 3,
            trustGainRate: 1,
            trustLossRate: 1
        };
    }

    // Emotional state management
    setEmotionalState(state, dysregulationType = null) {
        const previousState = this.emotionalState;
        this.emotionalState = state;
        this.dysregulationType = dysregulationType;
        
        // Record state change
        this.emotionalHistory.push({
            from: previousState,
            to: state,
            timestamp: Date.now(),
            trust: this.trust
        });

        // Trigger any personality-specific reactions
        this.processStateChange(previousState, state);
    }

    processStateChange(from, to) {
        // Some personalities have specific reactions to state changes
        if (this.personality.stateReactions) {
            const reaction = this.personality.stateReactions[`${from}_to_${to}`];
            if (reaction) {
                this.triggerPersonalityReaction(reaction);
            }
        }

        // Check for breakthrough moments
        if (from === 'dysregulated' && to === 'regulated' && this.trust >= 7) {
            this.addMemory('breakthrough', {
                message: 'Found calm in the storm',
                trust: this.trust
            });
        }
    }

    // Command response system
    respondToCommand(command, empathyModifiers = []) {
        // Add to recent commands
        this.recentCommands.push({
            command: command,
            modifiers: empathyModifiers,
            timestamp: Date.now()
        });
        if (this.recentCommands.length > 3) {
            this.recentCommands.shift();
        }

        // Calculate response based on state and modifiers
        const response = this.calculateEmotionalResponse(command, empathyModifiers);
        
        // Apply trust changes
        this.modifyTrust(response.trustChange);
        
        // Check for state changes
        if (response.newState) {
            this.setEmotionalState(response.newState, response.dysregulationType);
        }

        return response;
    }

    calculateEmotionalResponse(command, modifiers) {
        let trustChange = 0;
        let message = '';
        let newState = null;

        // Base response depends on current state
        switch(this.emotionalState) {
            case 'anxious':
                trustChange = this.handleAnxiousResponse(command, modifiers);
                break;
            case 'shutdown':
                trustChange = this.handleShutdownResponse(command, modifiers);
                break;
            case 'fight':
                trustChange = this.handleFightResponse(command, modifiers);
                break;
            case 'freeze':
                trustChange = this.handleFreezeResponse(command, modifiers);
                break;
            case 'fawn':
                trustChange = this.handleFawnResponse(command, modifiers);
                break;
            default:
                trustChange = this.handleRegulatedResponse(command, modifiers);
        }

        // Check modifiers for matches with comfort responses
        const hasComfortingModifier = modifiers.some(mod => 
            this.comfortResponses.includes(mod)
        );
        if (hasComfortingModifier) {
            trustChange += 1;
            message = this.generateComfortMessage(modifiers);
        }

        // Check for triggers
        const hasTriggering = this.checkForTriggers(command, modifiers);
        if (hasTriggering) {
            trustChange -= 2;
            newState = this.determineTriggeredState();
            message = this.generateTriggerMessage(hasTriggering);
        }

        // Pattern detection bonus
        if (this.detectPositivePattern(modifiers)) {
            trustChange += 0.5;
        }

        return {
            trustChange: trustChange * this.personality.trustGainRate,
            message: message || this.generateDefaultMessage(),
            newState: newState,
            dysregulationType: newState ? this.mapStateToDysregulation(newState) : null
        };
    }

    handleAnxiousResponse(command, modifiers) {
        const calmingPhrases = ['take your time', 'youre safe', 'no rush', 'im here'];
        const hasCalming = modifiers.some(mod => 
            calmingPhrases.includes(mod.toLowerCase().replace(/[^a-z]/g, ''))
        );

        if (hasCalming) {
            return 2; // Strong positive response
        } else if (modifiers.includes('challenge') || modifiers.includes('hurry')) {
            return -3; // Makes anxiety worse
        }
        return 0;
    }

    handleShutdownResponse(command, modifiers) {
        const gentlePhrases = ['im here', 'no pressure', 'when youre ready'];
        const hasGentle = modifiers.some(mod => 
            gentlePhrases.includes(mod.toLowerCase().replace(/[^a-z]/g, ''))
        );

        if (hasGentle) {
            return 1; // Slow progress
        } else if (modifiers.includes('focus') || modifiers.includes('snap out of it')) {
            return -2; // Pushes further into shutdown
        }
        return -0.5; // Shutdown deteriorates without proper care
    }

    handleFightResponse(command, modifiers) {
        if (modifiers.includes('validate') || modifiers.includes('i hear your anger')) {
            return 1; // Acknowledgment helps
        } else if (modifiers.includes('calm down') || modifiers.includes('control yourself')) {
            return -3; // Invalidation escalates
        }
        return -1; // Fight mode is self-destructive
    }

    // Trust and relationship management
    modifyTrust(amount) {
        const oldTrust = this.trust;
        this.trust = Math.max(-5, Math.min(10, this.trust + amount));
        
        // Trust milestones
        if (oldTrust < 7 && this.trust >= 7) {
            this.addMemory('trust_milestone', {
                message: 'I trust you now',
                level: 'deep'
            });
        } else if (oldTrust >= 0 && this.trust < 0) {
            this.addMemory('trust_broken', {
                message: 'You hurt me',
                level: 'wounded'
            });
        }

        // Check for defection risk
        if (this.trust <= -3) {
            this.considerDefection();
        }
    }

    considerDefection() {
        // Personality affects defection likelihood
        const defectionChance = this.personality.loyaltyThreshold || 0.3;
        if (Math.random() < defectionChance) {
            this.planningDefection = true;
        }
    }

    // Memory system
    addMemory(type, data) {
        this.memories.push({
            type: type,
            data: data,
            timestamp: Date.now(),
            emotionalState: this.emotionalState,
            trust: this.trust
        });

        // Keep memory list manageable
        if (this.memories.length > 20) {
            // Keep important memories
            this.memories = this.memories.filter(m => 
                m.type === 'breakthrough' || 
                m.type === 'trust_broken' ||
                m.type === 'first_meeting'
            ).concat(this.memories.slice(-10));
        }
    }

    // Relationship tracking
    updateRelationship(otherPieceId, change) {
        const current = this.relationshipMap.get(otherPieceId) || 0;
        this.relationshipMap.set(otherPieceId, current + change);
    }

    getRelationship(otherPieceId) {
        return this.relationshipMap.get(otherPieceId) || 0;
    }

    // Helper methods
    checkForTriggers(command, modifiers) {
        const allInput = [command, ...modifiers].join(' ').toLowerCase();
        return this.triggers.find(trigger => 
            allInput.includes(trigger.toLowerCase())
        );
    }

    determineTriggeredState() {
        // Based on personality, determine trauma response
        const responses = this.personality.traumaResponses || ['freeze', 'flight'];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    mapStateToDysregulation(state) {
        const mapping = {
            'freeze': 'frozen',
            'flight': 'anxious',
            'fight': 'aggressive',
            'fawn': 'people-pleasing',
            'shutdown': 'dissociated'
        };
        return mapping[state] || state;
    }

    detectPositivePattern(modifiers) {
        // Check if recent commands show consistent empathy
        if (this.recentCommands.length < 3) return false;
        
        const recentModifiers = this.recentCommands.flatMap(cmd => cmd.modifiers);
        const positiveCount = recentModifiers.filter(mod => 
            this.comfortResponses.includes(mod)
        ).length;
        
        return positiveCount >= 3;
    }

    generateComfortMessage(modifiers) {
        const messages = this.personality.comfortMessages || [
            "That... that helps.",
            "Thank you for understanding.",
            "I needed to hear that."
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    generateTriggerMessage(trigger) {
        const messages = this.personality.triggerMessages || [
            `Please don't say '${trigger}'...`,
            "That's... that's what they used to say.",
            "I can't handle that right now."
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    generateDefaultMessage() {
        if (this.trust > 7) {
            return "I trust you. Let's do this.";
        } else if (this.trust > 3) {
            return "Okay, I'll try.";
        } else if (this.trust > 0) {
            return "If you say so...";
        } else {
            return "Why should I listen to you?";
        }
    }

    // Serialization
    serialize() {
        return {
            id: this.id,
            team: this.team,
            type: this.type,
            position: this.position,
            captured: this.captured,
            name: this.name,
            personality: this.personality,
            emotionalState: this.emotionalState,
            trust: this.trust,
            memories: this.memories.slice(-10), // Keep recent memories
            relationshipMap: Array.from(this.relationshipMap.entries())
        };
    }

    deserialize(data) {
        Object.assign(this, data);
        this.relationshipMap = new Map(data.relationshipMap || []);
        this.memories = data.memories || [];
        this.recentCommands = [];
    }
}