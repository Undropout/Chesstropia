// Generic emotional responses used across all teams
export const genericResponses = {
    // Responses to empathy commands by emotional state
    empathyResponses: {
        anxious: {
            // Positive responses (trust gained)
            positive: {
                validate: [
                    "You... you see it too? The worry?",
                    "Thank you for not saying I'm overreacting...",
                    "It IS scary, isn't it? I'm not crazy?",
                    "You understand... that helps somehow."
                ],
                soothe: [
                    "Your voice... it's calming the storm a little.",
                    "I can breathe when you talk like that.",
                    "The panic is... quieter now. Thank you.",
                    "Safe... I almost remember what that feels like."
                ],
                pause: [
                    "Time... yes, I need time. Thank you.",
                    "No rush? Really? You mean it?",
                    "I can take a moment? That's... that's huge.",
                    "The pressure just lifted a little. I can think."
                ],
                breathe: [
                    "In... and out... you're right...",
                    "Breathing with you... it helps...",
                    "Air. Right. I forgot about air.",
                    "One breath at a time... I can do that."
                ]
            },
            // Negative responses (trust lost)
            negative: {
                dismiss: [
                    "Calm down?! CALM DOWN?! That makes it WORSE!",
                    "Oh sure, just stop worrying. Why didn't I think of that?",
                    "You don't get it at all, do you?",
                    "Thanks, I'm cured. /s"
                ],
                rush: [
                    "No time?! But I... I can't...",
                    "The pressure! It's too much!",
                    "You're just like everyone else...",
                    "I KNEW you'd lose patience with me!"
                ],
                minimize: [
                    "It's not 'just' anything!",
                    "Don't tell me it's not a big deal!",
                    "You think I'm being dramatic...",
                    "My feelings aren't 'too much'!"
                ]
            }
        },
        
        shutdown: {
            positive: {
                space: [
                    "...",
                    "... space... yes...",
                    "... thank you for not pushing...",
                    "..."
                ],
                patience: [
                    "... you'll wait...?",
                    "...",
                    "... still there...?",
                    "... not leaving...?"
                ],
                presence: [
                    "... you're here...",
                    "... don't go...",
                    "...",
                    "... helps... you being here..."
                ]
            },
            negative: {
                demand: [
                    "...",
                    "... can't...",
                    "... too much...",
                    "..."
                ],
                frustrated: [
                    "... sorry I'm not... enough...",
                    "...",
                    "... disappointing you too...",
                    "... always let people down..."
                ]
            }
        },
        
        fight: {
            positive: {
                validate_anger: [
                    "You... you think my anger is okay?",
                    "I AM mad! And that's... allowed?",
                    "Finally someone who doesn't fear my fire!",
                    "Yes! This rage is MINE and it's VALID!"
                ],
                channel: [
                    "Use it? Not suppress it? That's new...",
                    "You want me to aim this somewhere helpful?",
                    "My anger as fuel... I never thought...",
                    "Point me at the problem. Let's burn it down."
                ]
            },
            negative: {
                suppress: [
                    "DON'T TELL ME TO CALM DOWN!",
                    "Control myself?! I'VE BEEN CONTROLLING FOR YEARS!",
                    "You want me quiet and compliant? NEVER AGAIN!",
                    "My anger TERRIFIES you, doesn't it? GOOD!"
                ]
            }
        },
        
        freeze: {
            positive: {
                gentle: [
                    "... (slight movement) ...",
                    "... trying... to... move...",
                    "... gentle... helps...",
                    "... thawing... slowly..."
                ],
                warmth: [
                    "... warmer... with you here...",
                    "... ice... cracking...",
                    "... almost... can... feel...",
                    "... spring... might come..."
                ]
            },
            negative: {
                force: [
                    "... (freezes more) ...",
                    "... can't... stop...",
                    "... making... it... worse...",
                    "... completely... frozen..."
                ]
            }
        },
        
        fawn: {
            positive: {
                boundaries: [
                    "I... I don't have to please you?",
                    "My needs matter too? Really?",
                    "It's okay to say no? You won't leave?",
                    "I can disagree and you'll still like me?"
                ],
                authentic: [
                    "Be myself? But what if you hate me?",
                    "You want the real me? Even the ugly parts?",
                    "I don't have to perform for your approval?",
                    "This feels dangerous but... freeing?"
                ]
            },
            negative: {
                exploit: [
                    "Of course! Whatever you want! I'll do anything!",
                    "Please don't be mad! I'll be better!",
                    "Tell me how to make you happy! Please!",
                    "I'm sorry! I'm sorry! What did I do wrong?"
                ]
            }
        }
    },
    
    // Contextual responses for specific situations
    situationalResponses: {
        selected: {
            regulated: [
                "Ready when you are.",
                "What's the plan?",
                "I trust you.",
                "Let's do this together."
            ],
            dysregulated: [
                "I... I don't know if I can...",
                "Everything feels wrong right now.",
                "Please... be gentle with me.",
                "I'm trying but it's so hard..."
            ]
        },
        
        beforeMove: {
            confident: [
                "I see the path.",
                "This feels right.",
                "Together, we've got this.",
                "Trust the process."
            ],
            uncertain: [
                "Are you sure about this?",
                "What if I mess up?",
                "I don't know...",
                "This is scary."
            ]
        },
        
        afterCapture: {
            guilty: [
                "I had to... but it feels awful.",
                "They looked so scared...",
                "Violence isn't who I want to be.",
                "I'm sorry... I'm so sorry..."
            ],
            justified: [
                "It was necessary.",
                "Sometimes conflict can't be avoided.",
                "I protected our team.",
                "I don't enjoy it, but I accept it."
            ]
        },
        
        captured: {
            accepting: [
                "It's okay. You did your best.",
                "I'm not giving up on us.",
                "This isn't the end.",
                "Keep going. I believe in you."
            ],
            bitter: [
                "You let this happen...",
                "I trusted you!",
                "Was I just a game piece to you?",
                "Forgotten already, I bet."
            ]
        },
        
        witnessCapture: {
            traumatized: [
                "No! Not them!",
                "I couldn't save them...",
                "They're gone... just like that...",
                "It could have been me."
            ],
            supportive: [
                "We'll get through this.",
                "They'd want us to keep going.",
                "Honor them by surviving.",
                "Their sacrifice won't be in vain."
            ]
        },
        
        stormApproaching: {
            prepared: [
                "I've survived storms before.",
                "We'll weather this together.",
                "Bring it on. I'm ready.",
                "Storms pass. We endure."
            ],
            terrified: [
                "Not again... please not again...",
                "I can feel it coming...",
                "The memories... they're flooding back...",
                "I don't think I can survive another one."
            ]
        },
        
        breakthrough: {
            joyful: [
                "I can see clearly now!",
                "The weight... it's gone!",
                "I'm FREE!",
                "This is what hope feels like!"
            ],
            disoriented: [
                "Everything's different now...",
                "Who am I without my pain?",
                "This freedom is terrifying.",
                "I don't know how to be okay."
            ]
        },
        
        trustMilestones: {
            low: [ // Trust -5 to -3
                "Why should I believe you?",
                "Everyone lies eventually.",
                "I'm just waiting for you to leave.",
                "Trust is for fools."
            ],
            building: [ // Trust -2 to 2
                "Maybe... maybe you're different.",
                "I want to trust but it's hard.",
                "You haven't hurt me... yet.",
                "Could this be real?"
            ],
            moderate: [ // Trust 3 to 6
                "You've been consistent. That matters.",
                "I'm starting to believe you care.",
                "This feels safer than before.",
                "Thank you for your patience."
            ],
            high: [ // Trust 7 to 9
                "I trust you with my broken pieces.",
                "You've seen my worst and stayed.",
                "This is what safety feels like.",
                "We're really a team, aren't we?"
            ],
            complete: [ // Trust 10
                "You taught me trust is possible.",
                "I'd follow you anywhere.",
                "You're my safe person.",
                "This is love, isn't it?"
            ]
        },
        
        defectionWarning: {
            pleading: [
                "I can't do this anymore...",
                "Why won't you SEE me?",
                "I'm drowning and you don't care!",
                "Last chance... please..."
            ],
            determined: [
                "I deserve better than this.",
                "You've shown me who you are.",
                "I'm done begging for crumbs.",
                "Goodbye. I choose me."
            ]
        }
    },
    
    // Memory-triggered responses
    memoryResponses: {
        positive: {
            firstTrust: [
                "Remember when I first trusted you?",
                "You were patient when I was difficult.",
                "That moment changed everything.",
                "I'm glad I took the chance."
            ],
            sharedVictory: [
                "We've won together before.",
                "Remember our comeback?",
                "We make a good team.",
                "History shows we can do this."
            ],
            healingMoment: [
                "You helped me through that storm.",
                "I was broken and you stayed.",
                "That's when I knew you were different.",
                "Thank you for not giving up on me."
            ]
        },
        negative: {
            betrayal: [
                "You promised last time...",
                "I remember when you let me down.",
                "Fool me once...",
                "History repeats, doesn't it?"
            ],
            abandonment: [
                "Everyone leaves eventually.",
                "Just like before...",
                "I knew this would happen.",
                "Alone again. As always."
            ],
            repeated_hurt: [
                "You keep doing this to me.",
                "Same pain, different day.",
                "When will I learn?",
                "The pattern never changes."
            ]
        }
    },
    
    // Relationship-based responses
    relationshipResponses: {
        toAlly: {
            supportive: [
                "I've got your back!",
                "We're in this together.",
                "Lean on me.",
                "Your pain is my pain."
            ],
            checking_in: [
                "Are you okay over there?",
                "Need help?",
                "I see you struggling.",
                "Want to talk about it?"
            ]
        },
        toEnemy: {
            respectful: [
                "We may be opponents, but you have dignity.",
                "I don't enjoy this conflict.",
                "May the best team win.",
                "No hard feelings."
            ],
            hostile: [
                "You represent everything that hurt me.",
                "I won't let you win.",
                "This is personal now.",
                "You remind me of them..."
            ]
        },
        toStranger: {
            curious: [
                "Who are you?",
                "Are you safe?",
                "Can I trust you?",
                "Show me who you really are."
            ],
            cautious: [
                "I'll wait and see.",
                "Trust is earned.",
                "Don't come too close yet.",
                "Time will tell."
            ]
        }
    },
    
    // Weather/environmental responses
    environmentalResponses: {
        stormActive: {
            struggling: [
                "The storm... it's in my head!",
                "Can't think... too loud...",
                "Memories everywhere!",
                "Make it stop!"
            ],
            enduring: [
                "Storm outside, but I'm still here.",
                "Weather the storm. Always have.",
                "This too shall pass.",
                "I am stronger than the wind."
            ]
        },
        calmWeather: {
            relieved: [
                "Finally, some peace.",
                "I can breathe again.",
                "The quiet helps.",
                "Moments like this heal."
            ],
            uneasy: [
                "It's too quiet...",
                "Calm before the storm?",
                "When's the next crisis?",
                "I don't trust this peace."
            ]
        }
    }
};

// Response selection helper functions
export function getResponse(state, situation, quality, trust = 5) {
    // Quality can be 'positive', 'negative', or specific sub-types
    let responses = [];
    
    // Get base responses for the emotional state
    if (genericResponses.empathyResponses[state]) {
        if (genericResponses.empathyResponses[state][quality]) {
            responses = genericResponses.empathyResponses[state][quality];
        }
    }
    
    // Add situational responses if applicable
    if (situation && genericResponses.situationalResponses[situation]) {
        responses = [...responses, ...genericResponses.situationalResponses[situation]];
    }
    
    // Filter by trust level if needed
    if (trust < 0 && genericResponses.situationalResponses.trustMilestones.low) {
        responses = [...responses, ...genericResponses.situationalResponses.trustMilestones.low];
    }
    
    // Return random response from available options
    return responses[Math.floor(Math.random() * responses.length)] || "...";
}

// Get response based on relationship
export function getRelationshipResponse(relationship, relationshipType) {
    const responses = genericResponses.relationshipResponses[relationshipType];
    if (!responses) return "...";
    
    // Select based on relationship value
    if (relationship > 5) {
        return responses.supportive?.[Math.floor(Math.random() * responses.supportive.length)] || "...";
    } else if (relationship < -3) {
        return responses.hostile?.[Math.floor(Math.random() * responses.hostile.length)] || "...";
    } else {
        return responses.cautious?.[Math.floor(Math.random() * responses.cautious.length)] || "...";
    }
}

// Get milestone response
export function getMilestoneResponse(type, trust) {
    let category;
    if (trust >= 10) category = 'complete';
    else if (trust >= 7) category = 'high';
    else if (trust >= 3) category = 'moderate';
    else if (trust >= -2) category = 'building';
    else category = 'low';
    
    const responses = genericResponses.situationalResponses.trustMilestones[category];
    return responses[Math.floor(Math.random() * responses.length)] || "...";
}