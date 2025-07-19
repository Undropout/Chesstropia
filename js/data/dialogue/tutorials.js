// Tutorial dialogue and teaching moments
export const tutorialDialogues = {
    // Initial game tutorial
    firstTimePlayer: {
        welcome: {
            sequence: [
                {
                    speaker: "System",
                    text: "Welcome to Chesstropia.",
                    pause: 2000
                },
                {
                    speaker: "System", 
                    text: "This isn't just checkers.",
                    pause: 2000
                },
                {
                    speaker: "System",
                    text: "Your pieces have feelings. Trauma. Hope.",
                    pause: 3000
                },
                {
                    speaker: "System",
                    text: "They need more than strategy. They need empathy.",
                    pause: 3000
                }
            ]
        },
        
        firstPiece: {
            sequence: [
                {
                    speaker: "System",
                    text: "See that piece with the '!' symbol?",
                    highlight: "anxious_piece",
                    pause: 2000
                },
                {
                    speaker: "Sprinkles",
                    text: "I... I don't know if I can move...",
                    emotion: "anxious"
                },
                {
                    speaker: "System",
                    text: "Sprinkles is anxious. Moving her without addressing this...",
                    pause: 2000
                },
                {
                    speaker: "System",
                    text: "Well, let's just say it won't go well.",
                    pause: 2000
                }
            ]
        },
        
        empathyIntro: {
            sequence: [
                {
                    speaker: "System",
                    text: "When you select a dysregulated piece, you'll see empathy options.",
                    highlight: "empathy_interface"
                },
                {
                    speaker: "System",
                    text: "Choose your words carefully. They remember everything.",
                    pause: 3000
                },
                {
                    speaker: "System",
                    text: "Wrong responses damage trust. And trust is everything here.",
                    pause: 3000
                }
            ]
        },
        
        firstEmpathyChoice: {
            beforeChoice: [
                {
                    speaker: "System",
                    text: "Sprinkles is anxious about moving. How will you respond?",
                    showOptions: true
                }
            ],
            
            afterGoodChoice: [
                {
                    speaker: "Sprinkles",
                    text: "You... you understand? That helps...",
                    emotion: "relieved"
                },
                {
                    speaker: "System",
                    text: "Good. You've gained her trust. See the meter?",
                    highlight: "trust_meter"
                },
                {
                    speaker: "System",
                    text: "Keep building trust. Lose too much, and pieces might...",
                    pause: 2000
                },
                {
                    speaker: "System",
                    text: "Well, they have options. Let's leave it at that.",
                    pause: 2000
                }
            ],
            
            afterBadChoice: [
                {
                    speaker: "Sprinkles",
                    text: "I KNEW you wouldn't understand!",
                    emotion: "hurt"
                },
                {
                    speaker: "System",
                    text: "Ouch. 'Calm down' is rarely helpful for anxiety.",
                    pause: 2000
                },
                {
                    speaker: "System",
                    text: "Trust decreased. Too many mistakes and... consequences follow.",
                    highlight: "trust_meter"
                }
            ]
        },
        
        movementBasics: {
            sequence: [
                {
                    speaker: "System",
                    text: "Now that Sprinkles trusts you, she can move.",
                    pause: 2000
                },
                {
                    speaker: "System",
                    text: "Checkers rules apply - diagonal moves, jumping captures.",
                    highlight: "possible_moves"
                },
                {
                    speaker: "System",
                    text: "But remember: capturing affects emotions too.",
                    pause: 3000
                }
            ]
        },
        
        captureWarning: {
            sequence: [
                {
                    speaker: "System",
                    text: "You're about to capture an opponent piece...",
                    pause: 2000
                },
                {
                    speaker: "System",
                    text: "Some of your pieces might feel guilty about violence.",
                    pause: 2000
                },
                {
                    speaker: "System",
                    text: "Others who witness it might become traumatized.",
                    pause: 3000
                },
                {
                    speaker: "System",
                    text: "Every action has emotional consequences.",
                    pause: 2000
                }
            ]
        }
    },
    
    // Emotional state tutorials
    emotionalStates: {
        anxiety: {
            firstEncounter: [
                {
                    speaker: "System",
                    text: "This piece is showing anxiety - see the amber glow?",
                    highlight: "anxious_piece"
                },
                {
                    speaker: "System",
                    text: "Anxious pieces need reassurance, not pressure.",
                    pause: 2000
                },
                {
                    speaker: "System",
                    text: "Words like 'breathe', 'you're safe', and 'take your time' help.",
                    pause: 3000
                },
                {
                    speaker: "System",
                    text: "Avoid: 'calm down', 'hurry up', or minimizing their fears.",
                    pause: 3000
                }
            ]
        },
        
        shutdown: {
            firstEncounter: [
                {
                    speaker: "System",
                    text: "This piece has shut down - they've gone quiet.",
                    highlight: "shutdown_piece"
                },
                {
                    speaker: "System",
                    text: "Shutdown is a trauma response. They can barely speak.",
                    pause: 3000
                },
                {
                    speaker: "System",
                    text: "Be patient. Offer space. Don't demand responses.",
                    pause: 3000
                },
                {
                    speaker: "System",
                    text: "Sometimes just sitting with them helps.",
                    pause: 2000
                }
            ]
        },
        
        fight: {
            firstEncounter: [
                {
                    speaker: "System",
                    text: "This piece is in fight mode - see the magenta strobe?",
                    highlight: "fight_piece"
                },
                {
                    speaker: "System",
                    text: "Their anger is valid. Don't try to suppress it.",
                    pause: 3000
                },
                {
                    speaker: "System",
                    text: "Validate their rage. Help them channel it constructively.",
                    pause: 3000
                },
                {
                    speaker: "System",
                    text: "Never say 'calm down' to someone in fight mode.",
                    pause: 3000
                }
            ]
        },
        
        freeze: {
            firstEncounter: [
                {
                    speaker: "System",
                    text: "This piece is frozen - they literally can't move.",
                    highlight: "frozen_piece"
                },
                {
                    speaker: "System",
                    text: "Freeze is beyond anxiety. It's complete paralysis.",
                    pause: 3000
                },
                {
                    speaker: "System",
                    text: "Gentle warmth helps. Patience. No sudden movements.",
                    pause: 3000
                },
                {
                    speaker: "System",
                    text: "They'll thaw when they feel safe enough.",
                    pause: 2000
                }
            ]
        },
        
        fawn: {
            firstEncounter: [
                {
                    speaker: "System",
                    text: "This piece is fawning - trying desperately to please.",
                    highlight: "fawn_piece"
                },
                {
                    speaker: "System",
                    text: "They'll agree to anything, even if it hurts them.",
                    pause: 3000
                },
                {
                    speaker: "System",
                    text: "Help them find their boundaries. Their 'no' matters.",
                    pause: 3000
                },
                {
                    speaker: "System",
                    text: "Don't take advantage of their eagerness to please.",
                    pause: 3000
                }
            ]
        }
    },
    
    // Storm tutorials
    stormMechanics: {
        firstStormWarning: [
            {
                speaker: "System",
                text: "WARNING: Emotional Storm Approaching",
                effect: "screen_shake"
            },
            {
                speaker: "System",
                text: "Storms are collective emotional crises.",
                pause: 2000
            },
            {
                speaker: "System",
                text: "Your pieces will face their deepest triggers.",
                pause: 2000
            },
            {
                speaker: "System",
                text: "Support them through it, or watch them break.",
                pause: 3000
            }
        ],
        
        duringStorm: [
            {
                speaker: "System",
                text: "The storm is testing everyone's stability.",
                effect: "storm_visual"
            },
            {
                speaker: "System",
                text: "Adjacent pieces can support each other.",
                highlight: "adjacent_support"
            },
            {
                speaker: "System",
                text: "High-trust pieces resist storm effects better.",
                pause: 3000
            },
            {
                speaker: "System",
                text: "Some might have breakthroughs if supported well.",
                pause: 3000
            }
        ],
        
        afterStorm: [
            {
                speaker: "System",
                text: "The storm has passed. Let's assess the damage...",
                pause: 2000
            },
            {
                speaker: "System",
                text: "Pieces who survived together often bond.",
                highlight: "trauma_bonds"
            },
            {
                speaker: "System",
                text: "Those who broke through are stronger now.",
                highlight: "breakthrough_pieces"
            },
            {
                speaker: "System",
                text: "But some scars take time to heal.",
                pause: 3000
            }
        ]
    },
    
    // Advanced mechanics
    advancedConcepts: {
        trustMechanics: [
            {
                speaker: "System",
                text: "Let's talk about trust in detail.",
                pause: 2000
            },
            {
                speaker: "System",
                text: "Trust ranges from -5 to 10. At -5, pieces defect.",
                showDiagram: "trust_scale"
            },
            {
                speaker: "System",
                text: "At 10, they'll do anything for you. They trust completely.",
                pause: 3000
            },
            {
                speaker: "System",
                text: "But trust is fragile. One betrayal can undo months of work.",
                pause: 3000
            }
        ],
        
        defectionRisk: [
            {
                speaker: "System",
                text: "This piece is considering defection.",
                highlight: "defection_risk",
                effect: "warning_pulse"
            },
            {
                speaker: "System",
                text: "They're at -3 trust. One more mistake...",
                pause: 2000
            },
            {
                speaker: "System",
                text: "Defected pieces join the opposing team.",
                pause: 2000
            },
            {
                speaker: "System",
                text: "And they remember why they left.",
                pause: 3000
            }
        ],
        
        emotionalContagion: [
            {
                speaker: "System",
                text: "Emotions spread between adjacent pieces.",
                highlight: "contagion_spread"
            },
            {
                speaker: "System",
                text: "One anxious piece can trigger nearby allies.",
                pause: 3000
            },
            {
                speaker: "System",
                text: "But regulated pieces can also calm others.",
                pause: 3000
            },
            {
                speaker: "System",
                text: "Team emotional state matters as much as individual.",
                pause: 3000
            }
        ],
        
        breakthroughMoments: [
            {
                speaker: "System",
                text: "Sometimes, with enough trust and the right support...",
                pause: 2000
            },
            {
                speaker: "System",
                text: "Pieces can have breakthroughs - permanent healing.",
                effect: "rainbow_shimmer"
            },
            {
                speaker: "System",
                text: "These moments change everything for that piece.",
                pause: 3000
            },
            {
                speaker: "System",
                text: "And they can inspire breakthroughs in others.",
                pause: 3000
            }
        ]
    },
    
    // Team-specific tutorials
    teamTutorials: {
        donuts: [
            {
                speaker: "System",
                text: "The Donuts have abandonment trauma.",
                pause: 2000
            },
            {
                speaker: "System",
                text: "They bond quickly but fear being left.",
                pause: 2000
            },
            {
                speaker: "System",
                text: "Consistency matters more than grand gestures.",
                pause: 3000
            }
        ],
        
        renaissance_pets: [
            {
                speaker: "System",
                text: "Renaissance Pets hide behind perfect facades.",
                pause: 2000
            },
            {
                speaker: "System",
                text: "Their portraits show false selves.",
                pause: 2000
            },
            {
                speaker: "System",
                text: "Help them drop their masks, gently.",
                pause: 3000
            }
        ],
        
        baseballerinas: [
            {
                speaker: "System",
                text: "Baseballerinas are torn between identities.",
                pause: 2000
            },
            {
                speaker: "System",
                text: "They switch between baseball and ballet modes.",
                pause: 2000
            },
            {
                speaker: "System",
                text: "Help them integrate, not choose.",
                pause: 3000
            }
        ]
    },
    
    // Empathy combination hints
    empathyCombos: {
        discovered: [
            {
                speaker: "System",
                text: "You discovered a powerful combination!",
                effect: "combo_sparkle"
            },
            {
                speaker: "System",
                text: "Some empathy commands work better together.",
                pause: 2000
            },
            {
                speaker: "System",
                text: "This combo has been saved for future use.",
                pause: 2000
            }
        ]
    },
    
    // Failure teaching moments
    failureLessons: {
        trustBroken: [
            {
                speaker: "System",
                text: "Trust was broken. This happens.",
                pause: 2000
            },
            {
                speaker: "System",
                text: "Rebuilding is possible but takes time.",
                pause: 2000
            },
            {
                speaker: "System",
                text: "Learn from what went wrong.",
                pause: 3000
            }
        ],
        
        pieceDefected: [
            {
                speaker: "System",
                text: "They left. Sometimes that's how it goes.",
                pause: 2000
            },
            {
                speaker: "System",
                text: "Not every relationship can be saved.",
                pause: 3000
            },
            {
                speaker: "System",
                text: "But others still need you.",
                pause: 2000
            }
        ],
        
        matchLost: [
            {
                speaker: "System",
                text: "You lost the match. But did you lose their trust?",
                pause: 3000
            },
            {
                speaker: "System",
                text: "In Chesstropia, winning isn't everything.",
                pause: 3000
            },
            {
                speaker: "System",
                text: "Sometimes the real victory is in the healing.",
                pause: 3000
            }
        ]
    },
    
    // Meta tutorials
    metaLessons: {
        aboutEmpathy: [
            {
                speaker: "System",
                text: "This game is about emotional intelligence.",
                pause: 2000
            },
            {
                speaker: "System",
                text: "The skills you're learning here?",
                pause: 2000
            },
            {
                speaker: "System",
                text: "They work in real life too.",
                pause: 3000
            }
        ],
        
        aboutHealing: [
            {
                speaker: "System",
                text: "Healing isn't linear. Neither is this game.",
                pause: 3000
            },
            {
                speaker: "System",
                text: "Setbacks are part of the journey.",
                pause: 2000
            },
            {
                speaker: "System",
                text: "What matters is staying present.",
                pause: 3000
            }
        ],
        
        aboutConnection: [
            {
                speaker: "System",
                text: "Every piece represents someone's pain.",
                pause: 3000
            },
            {
                speaker: "System",
                text: "Maybe even your own.",
                pause: 3000
            },
            {
                speaker: "System",
                text: "Thank you for caring about them.",
                pause: 3000
            }
        ]
    }
};

// Tutorial state manager
export class TutorialManager {
    constructor() {
        this.viewedTutorials = this.loadViewedTutorials();
        this.currentSequence = null;
        this.sequenceIndex = 0;
    }
    
    loadViewedTutorials() {
        const saved = localStorage.getItem('chesstropia_viewed_tutorials');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveViewedTutorials() {
        localStorage.setItem('chesstropia_viewed_tutorials', JSON.stringify(this.viewedTutorials));
    }
    
    shouldShowTutorial(tutorialId) {
        return !this.viewedTutorials.includes(tutorialId);
    }
    
    markViewed(tutorialId) {
        if (!this.viewedTutorials.includes(tutorialId)) {
            this.viewedTutorials.push(tutorialId);
            this.saveViewedTutorials();
        }
    }
    
    startTutorial(category, subcategory) {
        const tutorial = tutorialDialogues[category]?.[subcategory];
        if (!tutorial) return;
        
        this.currentSequence = tutorial.sequence || tutorial;
        this.sequenceIndex = 0;
        
        return this.getCurrentMessage();
    }
    
    getCurrentMessage() {
        if (!this.currentSequence || this.sequenceIndex >= this.currentSequence.length) {
            return null;
        }
        
        return this.currentSequence[this.sequenceIndex];
    }
    
    advance() {
        this.sequenceIndex++;
        return this.getCurrentMessage();
    }
    
    skip() {
        this.currentSequence = null;
        this.sequenceIndex = 0;
    }
    
    getTutorialForContext(context) {
        // Return appropriate tutorial based on game context
        switch(context.type) {
            case 'first_anxious_piece':
                if (this.shouldShowTutorial('anxiety_intro')) {
                    return this.startTutorial('emotionalStates', 'anxiety');
                }
                break;
                
            case 'first_storm':
                if (this.shouldShowTutorial('storm_intro')) {
                    return this.startTutorial('stormMechanics', 'firstStormWarning');
                }
                break;
                
            case 'low_trust_warning':
                if (this.shouldShowTutorial('defection_risk')) {
                    return this.startTutorial('advancedConcepts', 'defectionRisk');
                }
                break;
        }
        
        return null;
    }
}

// Export singleton
export const tutorialManager = new TutorialManager();