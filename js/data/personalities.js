// Personality trait definitions and behavior modifiers
export const personalityTraits = {
    // Core personality types
    corePersonalities: {
        anxiousAttacher: {
            name: "Anxious Attacher",
            description: "Bonds quickly but fears abandonment",
            traits: {
                trustGainRate: 1.5,
                trustLossRate: 2.0,
                anxietyTendency: 0.7,
                abandonmentSensitivity: 0.9,
                bondingSpeed: 'fast',
                supportSeeking: 'high'
            },
            behaviors: {
                whenTrusted: "Becomes deeply loyal and protective",
                whenBetrayed: "Spirals into abandonment panic",
                underStress: "Seeks constant reassurance",
                inRelationships: "Clingy but devoted"
            },
            triggers: ['being ignored', 'distance', 'goodbye', 'alone'],
            comfortNeeds: ['consistency', 'reassurance', 'presence']
        },
        
        avoidantProtector: {
            name: "Avoidant Protector",
            description: "Self-sufficient but struggles with intimacy",
            traits: {
                trustGainRate: 0.5,
                trustLossRate: 1.0,
                shutdownTendency: 0.8,
                independenceNeed: 0.9,
                bondingSpeed: 'slow',
                supportSeeking: 'low'
            },
            behaviors: {
                whenTrusted: "Slowly opens up, shows hidden depths",
                whenBetrayed: "Confirms beliefs, withdraws further",
                underStress: "Isolates and goes silent",
                inRelationships: "Distant but secretly caring"
            },
            triggers: ['too close', 'need me', 'depend on', 'vulnerable'],
            comfortNeeds: ['space', 'patience', 'autonomy']
        },
        
        volatileReactor: {
            name: "Volatile Reactor",
            description: "Intense emotions, quick to anger or joy",
            traits: {
                trustGainRate: 1.0,
                trustLossRate: 1.8,
                fightTendency: 0.7,
                emotionalIntensity: 0.9,
                bondingSpeed: 'variable',
                supportSeeking: 'demanding'
            },
            behaviors: {
                whenTrusted: "Fiercely protective and passionate",
                whenBetrayed: "Explosive anger followed by deep hurt",
                underStress: "Lashes out then regrets",
                inRelationships: "Intense and unpredictable"
            },
            triggers: ['calm down', 'control yourself', 'too much', 'dramatic'],
            comfortNeeds: ['validation', 'channel energy', 'acceptance']
        },
        
        peoplepleaser: {
            name: "People Pleaser",
            description: "Sacrifices self for others' happiness",
            traits: {
                trustGainRate: 1.2,
                trustLossRate: 1.5,
                fawnTendency: 0.9,
                selfNeglect: 0.8,
                bondingSpeed: 'immediate',
                supportSeeking: 'indirect'
            },
            behaviors: {
                whenTrusted: "Devoted but loses self",
                whenBetrayed: "Blames self, tries harder",
                underStress: "Overextends to fix everything",
                inRelationships: "Gives until empty"
            },
            triggers: ['disappointed', 'not enough', 'should do more', 'selfish'],
            comfortNeeds: ['boundaries', 'self-worth', 'permission to say no']
        },
        
        traumatizedFreezer: {
            name: "Traumatized Freezer",
            description: "Paralyzed by past pain, struggles to act",
            traits: {
                trustGainRate: 0.6,
                trustLossRate: 1.4,
                freezeTendency: 0.9,
                decisionParalysis: 0.8,
                bondingSpeed: 'glacial',
                supportSeeking: 'frozen'
            },
            behaviors: {
                whenTrusted: "Slowly thaws, tentative hope",
                whenBetrayed: "Complete shutdown for days",
                underStress: "Becomes statue-like",
                inRelationships: "Present but not engaged"
            },
            triggers: ['decide now', 'move', 'choose', 'hurry'],
            comfortNeeds: ['gentle warmth', 'no pressure', 'safety']
        }
    },
    
    // Secondary traits that modify core personality
    modifierTraits: {
        // Trauma responses
        hypervigilant: {
            description: "Constantly scanning for threats",
            effects: {
                anxietyBase: '+20%',
                trustGainRate: '-30%',
                stormResistance: '-2',
                awarenessBonus: '+50%'
            },
            behaviors: [
                "Notices every micro-expression",
                "Jumps at sudden movements",
                "Reads danger into neutral situations",
                "Exhausted from constant alertness"
            ]
        },
        
        dissociative: {
            description: "Disconnects from reality under stress",
            effects: {
                shutdownChance: '+40%',
                emotionalRange: '-50%',
                contagionResistance: '+30%',
                presenceReduction: '-60%'
            },
            behaviors: [
                "Goes blank during conflict",
                "Forgets emotional moments",
                "Feels unreal or dreamlike",
                "Others feel they're 'not there'"
            ]
        },
        
        // Attachment styles
        disorganized: {
            description: "Chaotic, unpredictable attachment patterns",
            effects: {
                behaviorConsistency: '-70%',
                moodSwings: '+80%',
                relationshipChaos: '+90%',
                healingDifficulty: '+50%'
            },
            behaviors: [
                "Craves closeness then pushes away",
                "Behavior makes no apparent sense",
                "Different person day to day",
                "Confuses self and others"
            ]
        },
        
        earned_secure: {
            description: "Healed from insecurity through work",
            effects: {
                trustGainRate: '+40%',
                emotionalRegulation: '+60%',
                supportOffering: '+80%',
                breakthroughChance: '+30%'
            },
            behaviors: [
                "Models healthy attachment",
                "Helps others heal",
                "Maintains boundaries kindly",
                "Stable through storms"
            ]
        },
        
        // Coping mechanisms
        intellectualizer: {
            description: "Uses logic to avoid feelings",
            effects: {
                emotionalExpression: '-60%',
                analysisParalysis: '+70%',
                shutdownType: 'logical',
                empathyDifficulty: '+40%'
            },
            behaviors: [
                "Explains feelings rather than feeling",
                "Cites research during emotional moments",
                "Frustrates with emotional distance",
                "Breakthrough requires feeling, not thinking"
            ]
        },
        
        caretaker: {
            description: "Heals self by healing others",
            effects: {
                supportOffering: '+90%',
                selfNeglect: '+80%',
                burnoutRisk: '+70%',
                teamHealing: '+40%'
            },
            behaviors: [
                "Always checking on others",
                "Ignores own pain to help",
                "Crashes when not needed",
                "Must learn self-care"
            ]
        },
        
        // Resilience factors
        survivor: {
            description: "Has endured and grown stronger",
            effects: {
                stormResistance: '+4',
                trustLossReduction: '30%',
                recoverySpeed: '+50%',
                hopeGeneration: '+60%'
            },
            behaviors: [
                "Weathers crisis calmly",
                "Shares strength with others",
                "Bounces back faster",
                "Inspires through example"
            ]
        },
        
        brittle_strength: {
            description: "Appears strong but near breaking",
            effects: {
                facadeStrength: '+80%',
                actualResilience: '-60%',
                suddenCollapseRisk: '+90%',
                maskingAbility: '+70%'
            },
            behaviors: [
                "The 'strong one' who suddenly shatters",
                "Can't show weakness",
                "One more thing will break them",
                "Needs permission to not be okay"
            ]
        }
    },
    
    // Relationship dynamics
    relationshipPatterns: {
        enmeshed: {
            description: "No boundaries between self and others",
            with: ['anxiousAttacher', 'peoplepleaser'],
            dynamics: {
                boundaryBlur: 0.9,
                emotionalContagion: 2.0,
                codependency: 0.8,
                identityLoss: 0.7
            }
        },
        
        push_pull: {
            description: "Alternates between closeness and distance",
            with: ['volatileReactor', 'disorganized'],
            dynamics: {
                cycleIntensity: 0.8,
                predictability: 0.2,
                exhaustionRate: 0.9,
                dramaGeneration: 0.7
            }
        },
        
        parallel_play: {
            description: "Together but not connecting",
            with: ['avoidantProtector', 'traumatizedFreezer'],
            dynamics: {
                proximityComfort: 0.7,
                emotionalDistance: 0.8,
                stableLoneliness: 0.6,
                growthDifficulty: 0.5
            }
        },
        
        healing_partnership: {
            description: "Mutual growth and support",
            with: ['earned_secure', 'survivor'],
            dynamics: {
                mutualSupport: 0.9,
                healthyBoundaries: 0.8,
                growthAcceleration: 0.7,
                conflictResolution: 0.8
            }
        }
    },
    
    // Personality evolution paths
    evolutionPaths: {
        anxiousToSecure: {
            start: 'anxiousAttacher',
            end: 'earned_secure',
            requirements: {
                consistentSafety: 10, // turns
                trustMaintained: 7,
                abandonmentSurvived: 2,
                breakthroughAchieved: true
            },
            stages: [
                "Hypervigilance decreasing",
                "Testing boundaries",
                "Trusting consistency",
                "Internalizing safety",
                "Secure functioning"
            ]
        },
        
        avoidantToConnected: {
            start: 'avoidantProtector',
            end: 'earned_secure',
            requirements: {
                gentleApproach: 15, // turns
                spaceRespected: 10,
                vulnerabilityRewarded: 3,
                connectionNotForced: true
            },
            stages: [
                "Walls showing cracks",
                "Tentative reaching",
                "Allowing closeness",
                "Embracing connection",
                "Integrated attachment"
            ]
        },
        
        frozenToFlowing: {
            start: 'traumatizedFreezer',
            end: 'survivor',
            requirements: {
                patientPresence: 20, // turns
                noForcedMovement: true,
                warmthProvided: 15,
                thawingSupported: 5
            },
            stages: [
                "Micro-movements",
                "Thawing edges",
                "Flow returning",
                "Active choosing",
                "Fluid resilience"
            ]
        }
    },
    
    // Personality combinations that create unique dynamics
    specialCombinations: {
        rescuer_rescued: {
            personalities: ['caretaker', 'peoplepleaser'],
            creates: "Exhausting dynamic of mutual self-sacrifice",
            risks: ["Both burn out", "No one receives", "Resentment builds"],
            growth: "Learning to receive and give equally"
        },
        
        fortress_meets_fortress: {
            personalities: ['avoidantProtector', 'avoidantProtector'],
            creates: "Profound loneliness despite proximity",
            risks: ["Never truly connect", "Mutual isolation", "Wasted potential"],
            growth: "One must brave vulnerability first"
        },
        
        fire_and_ice: {
            personalities: ['volatileReactor', 'traumatizedFreezer'],
            creates: "Intense pursuit-withdrawal pattern",
            risks: ["Reactor overwhelms", "Freezer shuts down more", "Destructive cycle"],
            growth: "Finding middle ground of expression"
        },
        
        wounded_healers: {
            personalities: ['survivor', 'brittle_strength'],
            creates: "Deep understanding but risk of mutual collapse",
            risks: ["Triggered together", "Strength performance", "Hidden struggles"],
            growth: "Honest vulnerability strengthens both"
        }
    },
    
    // Methods for personality interactions
    interactionCalculators: {
        calculateTrustModifier(personality1, personality2) {
            // How personalities affect trust building between pieces
            const compatibility = this.getCompatibility(personality1, personality2);
            const baseModifier = compatibility.score;
            
            // Apply specific modifiers
            if (personality1.traits.supportSeeking === 'high' && 
                personality2.modifiers.includes('caretaker')) {
                return baseModifier * 1.5;
            }
            
            if (personality1.traits.independenceNeed > 0.7 && 
                personality2.traits.bondingSpeed === 'fast') {
                return baseModifier * 0.7;
            }
            
            return baseModifier;
        },
        
        calculateContagionRisk(personality1, personality2) {
            // How likely emotional states spread between personalities
            let risk = 0.5; // base
            
            if (personality1.modifiers.includes('hypervigilant')) {
                risk += 0.2;
            }
            
            if (personality2.traits.emotionalIntensity > 0.7) {
                risk += 0.3;
            }
            
            if (personality2.modifiers.includes('dissociative')) {
                risk -= 0.2;
            }
            
            return Math.max(0.1, Math.min(0.9, risk));
        },
        
        getCompatibility(personality1, personality2) {
            // Check special combinations first
            for (const combo of Object.values(personalityTraits.specialCombinations)) {
                if (combo.personalities.includes(personality1.name) && 
                    combo.personalities.includes(personality2.name)) {
                    return {
                        score: 0.5, // Complicated compatibility
                        dynamic: combo.creates,
                        risks: combo.risks,
                        growth: combo.growth
                    };
                }
            }
            
            // Calculate based on traits
            let score = 0.5;
            
            // Complementary support needs
            if (personality1.traits.supportSeeking === 'high' && 
                personality2.traits.supportOffering > 0.7) {
                score += 0.2;
            }
            
            // Matching bonding speeds
            if (personality1.traits.bondingSpeed === personality2.traits.bondingSpeed) {
                score += 0.1;
            }
            
            // Conflicting needs
            if (personality1.traits.independenceNeed > 0.7 && 
                personality2.traits.abandonmentSensitivity > 0.7) {
                score -= 0.3;
            }
            
            return {
                score: Math.max(0.1, Math.min(0.9, score)),
                dynamic: "Standard interaction",
                risks: ["Typical relational challenges"],
                growth: "Mutual understanding possible"
            };
        }
    },
    
    // Personality dialogue modifiers
    dialogueStyles: {
        anxious_optimist: {
            patterns: ["ending with hopeful question", "self-doubt followed by hope", "seeking reassurance"],
            examples: [
                "I'm scared but... maybe it'll be okay?",
                "What if I fail? But what if I don't?",
                "You really think I can do this?"
            ]
        },
        
        guarded_soft: {
            patterns: ["short sentences", "hidden vulnerability", "deflection with care"],
            examples: [
                "I'm fine. Are you?",
                "Don't worry about me.",
                "..thanks. I guess."
            ]
        },
        
        bitter_hopeful: {
            patterns: ["cynicism with cracks of hope", "past pain informing present", "testing waters"],
            examples: [
                "Sure, THIS time will be different.",
                "I want to believe you, but...",
                "Fool me twice..."
            ]
        },
        
        desperate_bright: {
            patterns: ["manic positivity", "denial through cheer", "exhausting enthusiasm"],
            examples: [
                "Everything's GREAT! Really! GREAT!",
                "No problems here! All sunshine!",
                "Happy happy happy! See? HAPPY!"
            ]
        }
    }
};

// Personality generator for dynamic creation
export class PersonalityGenerator {
    static generatePersonality(baseType, modifiers = []) {
        const base = personalityTraits.corePersonalities[baseType];
        if (!base) {
            console.error(`Unknown personality type: ${baseType}`);
            return null;
        }
        
        // Deep clone base personality
        const personality = JSON.parse(JSON.stringify(base));
        
        // Apply modifiers
        modifiers.forEach(modifierName => {
            const modifier = personalityTraits.modifierTraits[modifierName];
            if (modifier) {
                this.applyModifier(personality, modifier);
            }
        });
        
        // Add unique quirks
        personality.quirks = this.generateQuirks(personality);
        
        // Set dialogue style
        personality.dialogueStyle = this.selectDialogueStyle(personality);
        
        return personality;
    }
    
    static applyModifier(personality, modifier) {
        // Apply effect modifiers
        Object.entries(modifier.effects).forEach(([key, value]) => {
            if (typeof value === 'string' && value.includes('%')) {
                // Percentage modification
                const percent = parseFloat(value) / 100;
                const trait = key.replace('Base', '').replace('Chance', 'Tendency');
                if (personality.traits[trait] !== undefined) {
                    personality.traits[trait] *= (1 + percent);
                }
            } else if (typeof value === 'string' && value.includes('+')) {
                // Addition
                const addition = parseFloat(value);
                if (personality.traits[key] !== undefined) {
                    personality.traits[key] += addition;
                }
            }
        });
        
        // Add modifier behaviors
        if (!personality.modifiers) {
            personality.modifiers = [];
        }
        personality.modifiers.push(modifier.description);
        
        // Merge behaviors
        personality.behaviors.modifierBehaviors = modifier.behaviors;
    }
    
    static generateQuirks(personality) {
        const quirks = [];
        
        // Anxiety-based quirks
        if (personality.traits.anxietyTendency > 0.6) {
            quirks.push(this.selectRandom([
                "Counts pieces obsessively when nervous",
                "Rehearses conversations before speaking",
                "Apologizes for existing"
            ]));
        }
        
        // Attachment-based quirks
        if (personality.traits.abandonmentSensitivity > 0.7) {
            quirks.push(this.selectRandom([
                "Panics when allies move away",
                "Constantly asks 'are we okay?'",
                "Hoards small kindnesses as memories"
            ]));
        }
        
        // Coping quirks
        if (personality.traits.shutdownTendency > 0.6) {
            quirks.push(this.selectRandom([
                "Goes completely silent mid-sentence",
                "Stares at nothing when overwhelmed",
                "Forgets own name under stress"
            ]));
        }
        
        return quirks;
    }
    
    static selectDialogueStyle(personality) {
        // Match personality to dialogue style
        if (personality.traits.anxietyTendency > 0.6 && personality.traits.trustGainRate > 1.0) {
            return 'anxious_optimist';
        }
        
        if (personality.traits.independenceNeed > 0.7) {
            return 'guarded_soft';
        }
        
        if (personality.traits.trustLossRate > 1.5 && personality.traits.bondingSpeed !== 'fast') {
            return 'bitter_hopeful';
        }
        
        if (personality.traits.fawnTendency > 0.7) {
            return 'desperate_bright';
        }
        
        return 'neutral';
    }
    
    static selectRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

// Personality evolution tracker
export class PersonalityEvolution {
    constructor(piece) {
        this.piece = piece;
        this.originalPersonality = piece.personality.name;
        this.currentStage = 0;
        this.evolutionPath = null;
        this.progress = {};
    }
    
    checkEvolution() {
        // Find applicable evolution path
        for (const [pathName, path] of Object.entries(personalityTraits.evolutionPaths)) {
            if (path.start === this.originalPersonality) {
                this.evolutionPath = path;
                break;
            }
        }
        
        if (!this.evolutionPath) return false;
        
        // Check requirements
        const requirements = this.evolutionPath.requirements;
        let allMet = true;
        
        Object.entries(requirements).forEach(([key, value]) => {
            if (typeof value === 'number') {
                if (!this.progress[key] || this.progress[key] < value) {
                    allMet = false;
                }
            } else if (typeof value === 'boolean') {
                if (this.progress[key] !== value) {
                    allMet = false;
                }
            }
        });
        
        return allMet;
    }
    
    progressToNextStage() {
        if (this.currentStage < this.evolutionPath.stages.length - 1) {
            this.currentStage++;
            return {
                newStage: this.evolutionPath.stages[this.currentStage],
                isComplete: false
            };
        } else {
            // Evolution complete
            return {
                newPersonality: this.evolutionPath.end,
                isComplete: true
            };
        }
    }
    
    trackProgress(event, value = 1) {
        if (!this.progress[event]) {
            this.progress[event] = 0;
        }
        this.progress[event] += value;
        
        // Check if evolution triggered
        if (this.checkEvolution()) {
            return this.progressToNextStage();
        }
        
        return null;
    }
}