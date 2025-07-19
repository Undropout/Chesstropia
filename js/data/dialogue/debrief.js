// Post-match debriefing and reflection dialogue
export const debriefDialogues = {
    // Victory debriefs
    victoryDebrief: {
        highTrust: {
            // Won with most pieces trusting (avg trust > 7)
            summary: [
                "You didn't just win. You helped them heal.",
                "Victory through compassion. The rarest kind.",
                "They followed you because they trusted you.",
                "This is what healthy leadership looks like."
            ],
            
            pieceReflections: [
                "{piece}: I've never felt safer in a game.",
                "{piece}: We won together. ALL of us.",
                "{piece}: You saw us as people, not pawns.",
                "{piece}: I'd follow you anywhere now."
            ],
            
            lessons: [
                "Trust built: {trustGained} points across the team",
                "Emotional crises resolved: {crisesResolved}",
                "Breakthroughs achieved: {breakthroughs}",
                "No one was left behind."
            ],
            
            growth: [
                "Your empathy rating: COMPASSIONATE",
                "Team bond strength: UNBREAKABLE",
                "Healing progress: SIGNIFICANT",
                "You've changed lives today."
            ]
        },
        
        mixedTrust: {
            // Won but trust varied (avg trust 3-7)
            summary: [
                "A victory, but at what cost?",
                "You won the game. Some hearts remain unclaimed.",
                "Success and struggle, intertwined.",
                "Chess was conquered. Emotions? Still in progress."
            ],
            
            pieceReflections: [
                "{highTrustPiece}: Thank you for believing in me.",
                "{lowTrustPiece}: We won... but I still don't know if I matter to you.",
                "{anxiousPiece}: The victory feels hollow when I'm still scared.",
                "{regulatedPiece}: I'm proud of how far we've come."
            ],
            
            lessons: [
                "Trust gained: {trustGained} (but {trustLost} was lost)",
                "Some pieces still struggling: {dysregulatedCount}",
                "Relationships need work: {negativeRelationships}",
                "Victory doesn't heal all wounds."
            ],
            
            growth: [
                "Your empathy rating: LEARNING",
                "Team bond strength: DEVELOPING", 
                "Areas for growth identified",
                "The journey continues."
            ]
        },
        
        lowTrust: {
            // Won despite low trust (avg trust < 3)
            summary: [
                "A pyrrhic victory. You won, but they're broken.",
                "The board is yours. Their trust isn't.",
                "Strategic success, emotional failure.",
                "You moved pieces. You didn't move hearts."
            ],
            
            pieceReflections: [
                "{piece}: You used us to win. Nothing more.",
                "{piece}: I did what you wanted. Happy now?",
                "{piece}: This victory tastes like ash.",
                "{piece}: We're just game pieces to you, aren't we?"
            ],
            
            lessons: [
                "Trust lost: {trustLost} points",
                "Defection risks: {defectionRisks} pieces",
                "Unresolved trauma: {unresolvedCount}",
                "Winning isn't everything."
            ],
            
            growth: [
                "Your empathy rating: STRUGGLING",
                "Team bond strength: FRACTURED",
                "Serious reflection needed",
                "They deserved better."
            ]
        }
    },
    
    // Defeat debriefs
    defeatDebrief: {
        highTrust: {
            // Lost but maintained trust
            summary: [
                "You lost the match but won their hearts.",
                "Defeat on the board, victory in trust.",
                "They'd rather lose with you than win without you.",
                "This loss means more than most victories."
            ],
            
            pieceReflections: [
                "{piece}: I'm sorry we couldn't win for you.",
                "{piece}: You never gave up on us. That matters more.",
                "{piece}: Losing together beats winning alone.",
                "{piece}: Next time. We'll get them next time."
            ],
            
            lessons: [
                "Trust maintained despite defeat: {trustLevel}",
                "Team cohesion: STRONGER THAN EVER",
                "Emotional growth: CONTINUED",
                "True victory is connection."
            ],
            
            growth: [
                "Your empathy rating: EXCEPTIONAL",
                "Team loyalty: UNWAVERING",
                "You chose compassion over competition",
                "They'll remember this forever."
            ]
        },
        
        strugglingTrust: {
            // Lost while trust was declining
            summary: [
                "Defeat compounded by disconnection.",
                "Lost the game, losing the team.",
                "When trust fails, everything fails.",
                "Two battles lost today."
            ],
            
            pieceReflections: [
                "{piece}: I knew we'd lose. I could feel it.",
                "{piece}: Hard to win when we don't trust each other.",
                "{piece}: Maybe with more support...",
                "{piece}: This hurts more than just losing."
            ],
            
            lessons: [
                "Trust issues contributed to defeat",
                "Dysregulated pieces: {dysregulatedCount}",
                "Communication breakdowns: {failedEmpathy}",
                "Connection affects performance."
            ],
            
            growth: [
                "Your empathy rating: DEVELOPING",
                "Team needs emotional support",
                "Focus on healing before strategy",
                "Rebuild trust, then try again."
            ]
        },
        
        afterDefections: {
            // Lost after pieces defected
            summary: [
                "They left. Then you lost. Cause and effect.",
                "Betrayal led to defeat.",
                "An army divided cannot stand.",
                "The real loss happened before the checkmate."
            ],
            
            pieceReflections: [
                "{loyalPiece}: I stayed, but it wasn't enough.",
                "{witness}: Watching {defector} leave broke us.",
                "{struggling}: Maybe they had the right idea...",
                "{faithful}: We need to heal before we can win."
            ],
            
            lessons: [
                "Defections: {defectionCount} pieces lost",
                "Trust breakdown was catastrophic",
                "Team morale: SHATTERED",
                "Prevention is better than damage control."
            ],
            
            growth: [
                "Your empathy rating: CRISIS MODE",
                "Urgent intervention needed",
                "Address the betrayal trauma",
                "Healing must come first."
            ]
        }
    },
    
    // Special situation debriefs
    specialDebriefs: {
        perfectRun: {
            // No pieces lost trust, all regulated
            summary: [
                "Perfection. Every piece trusted, healed, and whole.",
                "You've achieved the impossible: universal healing.",
                "This is what mastery looks like.",
                "You didn't just play. You transformed lives."
            ],
            
            pieceReflections: [
                "{piece}: I didn't know I could feel this safe.",
                "{piece}: You gave me hope when I had none.",
                "{piece}: My anxiety... it's manageable now!",
                "{piece}: We're not just a team. We're family."
            ],
            
            achievement: "ENLIGHTENED COACH"
        },
        
        massBreakthrough: {
            // Multiple pieces had breakthroughs
            summary: [
                "A cascade of healing swept through your team.",
                "One breakthrough inspired another, then another...",
                "You facilitated a collective transformation.",
                "This is the power of supportive community."
            ],
            
            pieceReflections: [
                "{piece1}: When I broke through, {piece2} saw it was possible!",
                "{piece2}: And then I realized I could heal too!",
                "{piece3}: We're all growing together!",
                "{piece4}: This is what hope looks like!"
            ],
            
            achievement: "BREAKTHROUGH CATALYST"
        },
        
        stormSurvival: {
            // Weathered an emotional storm without casualties
            summary: [
                "The storm raged, but you held them together.",
                "Not one piece lost to the tempest.",
                "You were their anchor in chaos.",
                "Storms reveal true leadership."
            ],
            
            pieceReflections: [
                "{piece}: The storm was terrifying, but you were there.",
                "{piece}: I thought I'd break. Your support saved me.",
                "{piece}: We weathered it together. We can survive anything.",
                "{piece}: You didn't let the storm take us."
            ],
            
            achievement: "STORM GUARDIAN"
        },
        
        redemptionArc: {
            // Brought back piece from brink of defection
            summary: [
                "They were leaving. You brought them home.",
                "Trust rebuilt from ashes.",
                "The hardest healing: recovering from betrayal.",
                "Second chances can change everything."
            ],
            
            pieceReflections: [
                "{redeemed}: I... I almost left. Thank you for fighting for me.",
                "{redeemed}: You saw past my anger to my pain.",
                "{witness}: Watching you save {redeemed} gave me hope.",
                "{redeemed}: I thought I was beyond saving. I was wrong."
            ],
            
            achievement: "BRIDGE BUILDER"
        }
    },
    
    // Statistical summaries
    statsSummary: {
        trustMetrics: [
            "Starting team trust: {startTrust}",
            "Final team trust: {endTrust}",
            "Trust gained: +{trustGained}",
            "Trust lost: -{trustLost}",
            "Net change: {netChange}"
        ],
        
        emotionalMetrics: [
            "Dysregulation episodes: {dysregulationCount}",
            "Successfully regulated: {regulatedCount}",
            "Breakthroughs achieved: {breakthroughCount}",
            "Emotional storms weathered: {stormsWeathered}",
            "Contagion events: {contagionCount}"
        ],
        
        relationshipMetrics: [
            "Positive relationships formed: {positiveRelationships}",
            "Relationships healed: {healedRelationships}",
            "Relationships damaged: {damagedRelationships}",
            "Team cohesion score: {cohesionScore}/100"
        ],
        
        empathyMetrics: [
            "Empathy attempts: {empathyAttempts}",
            "Successful interventions: {successfulEmpathy}",
            "Failed attempts: {failedEmpathy}",
            "Success rate: {empathySuccessRate}%",
            "Most effective approach: {bestApproach}"
        ]
    },
    
    // Growth suggestions
    growthSuggestions: {
        lowTrust: [
            "Focus on consistency over grand gestures",
            "Listen more than you direct",
            "Address anxiety before attempting moves",
            "Remember: trust takes time to build"
        ],
        
        highDysregulation: [
            "Learn to recognize early warning signs",
            "Create emotional safety before strategy",
            "Use supportive positioning to prevent contagion",
            "Practice patience with frozen pieces"
        ],
        
        relationshipIssues: [
            "Pay attention to piece interactions",
            "Resolve conflicts before they fester",
            "Use proximity to build positive bonds",
            "Remember past traumas affect current dynamics"
        ],
        
        stormPreparedness: [
            "Build trust reserves before storms hit",
            "Position supportive pieces strategically",
            "Learn each piece's storm triggers",
            "Prepare for cascade effects"
        ]
    },
    
    // Emotional intelligence scores
    eqScoring: {
        calculate(stats) {
            const scores = {
                awareness: this.calculateAwareness(stats),
                regulation: this.calculateRegulation(stats),
                empathy: this.calculateEmpathy(stats),
                relationships: this.calculateRelationships(stats),
                growth: this.calculateGrowth(stats)
            };
            
            scores.overall = Math.round(
                (scores.awareness + scores.regulation + scores.empathy + 
                 scores.relationships + scores.growth) / 5
            );
            
            return scores;
        },
        
        getLevel(score) {
            if (score >= 90) return "ENLIGHTENED";
            if (score >= 75) return "COMPASSIONATE";
            if (score >= 60) return "DEVELOPING";
            if (score >= 40) return "LEARNING";
            return "BEGINNING";
        },
        
        calculateAwareness(stats) {
            // How well player recognized emotional states
            const recognitionRate = stats.correctStateIdentification / stats.totalIdentifications;
            const earlyInterventions = stats.preventativeActions / stats.totalCrises;
            return Math.round((recognitionRate + earlyInterventions) * 50);
        },
        
        calculateRegulation(stats) {
            // How well player helped regulate emotions
            const regulationSuccess = stats.successfulRegulations / stats.attemptedRegulations;
            const stormSurvival = stats.stormsWeathered / stats.totalStorms;
            return Math.round((regulationSuccess + stormSurvival) * 50);
        },
        
        calculateEmpathy(stats) {
            // How well player showed understanding
            const empathySuccess = stats.successfulEmpathy / stats.totalEmpathy;
            const trustBuilding = stats.trustGained / (stats.trustGained + stats.trustLost);
            return Math.round((empathySuccess + trustBuilding) * 50);
        },
        
        calculateRelationships(stats) {
            // How well player managed team dynamics
            const positiveRatio = stats.positiveRelationships / stats.totalRelationships;
            const teamCohesion = stats.finalCohesion / 100;
            return Math.round((positiveRatio + teamCohesion) * 50);
        },
        
        calculateGrowth(stats) {
            // How much growth/healing occurred
            const breakthroughRate = stats.breakthroughs / stats.totalPieces;
            const healingProgress = stats.healedPieces / stats.totalPieces;
            return Math.round((breakthroughRate + healingProgress) * 50);
        }
    }
};

// Debrief generator
export class DebriefGenerator {
    static generateDebrief(matchResult, gameState) {
        const stats = this.calculateStats(matchResult, gameState);
        const debriefType = this.determineDebriefType(stats);
        const debrief = {
            type: debriefType,
            stats: stats,
            summary: this.selectSummary(debriefType, stats),
            pieceReflections: this.generatePieceReflections(gameState, stats),
            lessons: this.generateLessons(stats),
            growth: this.generateGrowthReport(stats),
            suggestions: this.generateSuggestions(stats),
            eqScore: debriefDialogues.eqScoring.calculate(stats)
        };
        
        return debrief;
    }
    
    static calculateStats(matchResult, gameState) {
        const pieces = Array.from(gameState.pieces.values());
        const playerPieces = pieces.filter(p => p.team === 'player');
        
        return {
            victory: matchResult.victory,
            startTrust: matchResult.startingTrust,
            endTrust: this.calculateAverageTrust(playerPieces),
            trustGained: matchResult.trustGained,
            trustLost: matchResult.trustLost,
            netChange: matchResult.trustGained - matchResult.trustLost,
            dysregulatedCount: playerPieces.filter(p => p.emotionalState === 'dysregulated').length,
            regulatedCount: playerPieces.filter(p => p.emotionalState === 'regulated').length,
            breakthroughCount: matchResult.breakthroughs.length,
            defectionCount: matchResult.defections.length,
            stormsWeathered: matchResult.stormsWeathered,
            successfulEmpathy: matchResult.successfulEmpathy,
            failedEmpathy: matchResult.failedEmpathy,
            totalEmpathy: matchResult.successfulEmpathy + matchResult.failedEmpathy,
            empathySuccessRate: Math.round(
                (matchResult.successfulEmpathy / 
                (matchResult.successfulEmpathy + matchResult.failedEmpathy)) * 100
            ),
            positiveRelationships: this.countPositiveRelationships(playerPieces),
            totalRelationships: this.countTotalRelationships(playerPieces),
            finalCohesion: this.calculateCohesion(playerPieces)
        };
    }
    
    static determineDebriefType(stats) {
        if (stats.victory) {
            if (stats.endTrust > 7) return 'victoryHighTrust';
            if (stats.endTrust > 3) return 'victoryMixedTrust';
            return 'victoryLowTrust';
        } else {
            if (stats.defectionCount > 0) return 'defeatAfterDefections';
            if (stats.endTrust > 5) return 'defeatHighTrust';
            return 'defeatStrugglingTrust';
        }
    }
    
    static selectSummary(debriefType, stats) {
        const summaries = {
            victoryHighTrust: debriefDialogues.victoryDebrief.highTrust.summary,
            victoryMixedTrust: debriefDialogues.victoryDebrief.mixedTrust.summary,
            victoryLowTrust: debriefDialogues.victoryDebrief.lowTrust.summary,
            defeatHighTrust: debriefDialogues.defeatDebrief.highTrust.summary,
            defeatStrugglingTrust: debriefDialogues.defeatDebrief.strugglingTrust.summary,
            defeatAfterDefections: debriefDialogues.defeatDebrief.afterDefections.summary
        };
        
        const options = summaries[debriefType] || summaries.victoryMixedTrust;
        return options[Math.floor(Math.random() * options.length)];
    }
    
    static generatePieceReflections(gameState, stats) {
        const reflections = [];
        const pieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        // Get variety of perspectives
        const highTrustPiece = pieces.find(p => p.trust >= 7);
        const lowTrustPiece = pieces.find(p => p.trust <= 3);
        const breakthroughPiece = pieces.find(p => 
            p.memories.some(m => m.type === 'breakthrough')
        );
        const strugglingPiece = pieces.find(p => 
            p.emotionalState === 'dysregulated'
        );
        
        if (highTrustPiece) {
            reflections.push({
                piece: highTrustPiece.name,
                text: this.getReflectionText('positive', stats),
                emotion: 'grateful'
            });
        }
        
        if (lowTrustPiece) {
            reflections.push({
                piece: lowTrustPiece.name,
                text: this.getReflectionText('struggling', stats),
                emotion: 'uncertain'
            });
        }
        
        if (breakthroughPiece) {
            reflections.push({
                piece: breakthroughPiece.name,
                text: this.getReflectionText('transformed', stats),
                emotion: 'joyful'
            });
        }
        
        return reflections;
    }
    
    static getReflectionText(type, stats) {
        const templates = {
            positive: [
                "This journey has changed me.",
                "I trust you completely now.",
                "Thank you for not giving up on me.",
                "We really are a team."
            ],
            struggling: [
                "I want to trust, but it's hard.",
                "Maybe next time will be different.",
                "I'm trying, I really am.",
                "Why is connection so difficult?"
            ],
            transformed: [
                "I never thought I could heal like this!",
                "The breakthrough changed everything!",
                "I'm free from my old patterns!",
                "This is what growth feels like!"
            ]
        };
        
        const options = templates[type] || templates.struggling;
        return options[Math.floor(Math.random() * options.length)];
    }
    
    static generateLessons(stats) {
        const lessons = [];
        
        // Trust lesson
        if (stats.netChange > 0) {
            lessons.push(`Trust building successful: +${stats.netChange} net gain`);
        } else {
            lessons.push(`Trust declined: ${stats.netChange} net loss`);
        }
        
        // Regulation lesson
        if (stats.regulatedCount > stats.dysregulatedCount) {
            lessons.push("Emotional regulation achieved for majority");
        } else {
            lessons.push(`${stats.dysregulatedCount} pieces still need support`);
        }
        
        // Empathy lesson
        if (stats.empathySuccessRate > 70) {
            lessons.push(`Strong empathy skills: ${stats.empathySuccessRate}% success rate`);
        } else {
            lessons.push(`Empathy needs work: ${stats.empathySuccessRate}% success rate`);
        }
        
        // Relationship lesson
        const relationshipRatio = stats.positiveRelationships / stats.totalRelationships;
        if (relationshipRatio > 0.6) {
            lessons.push("Team relationships are strong");
        } else {
            lessons.push("Team dynamics need attention");
        }
        
        return lessons;
    }
    
    static generateGrowthReport(stats) {
        const eq = debriefDialogues.eqScoring.calculate(stats);
        const level = debriefDialogues.eqScoring.getLevel(eq.overall);
        
        return {
            eqLevel: level,
            overallScore: eq.overall,
            breakdown: {
                awareness: `Emotional Awareness: ${eq.awareness}/100`,
                regulation: `Regulation Skills: ${eq.regulation}/100`,
                empathy: `Empathy Practice: ${eq.empathy}/100`,
                relationships: `Relationship Management: ${eq.relationships}/100`,
                growth: `Growth Facilitation: ${eq.growth}/100`
            },
            summary: this.getGrowthSummary(level)
        };
    }
    
    static getGrowthSummary(level) {
        const summaries = {
            ENLIGHTENED: "You've mastered the art of emotional support.",
            COMPASSIONATE: "Your empathy creates real change.",
            DEVELOPING: "You're learning to hold space for feelings.",
            LEARNING: "Every attempt teaches you something.",
            BEGINNING: "The journey of a thousand miles..."
        };
        
        return summaries[level];
    }
    
    static generateSuggestions(stats) {
        const suggestions = [];
        
        if (stats.endTrust < 5) {
            suggestions.push(...debriefDialogues.growthSuggestions.lowTrust);
        }
        
        if (stats.dysregulatedCount > 3) {
            suggestions.push(...debriefDialogues.growthSuggestions.highDysregulation);
        }
        
        if (stats.positiveRelationships < stats.totalRelationships * 0.5) {
            suggestions.push(...debriefDialogues.growthSuggestions.relationshipIssues);
        }
        
        if (stats.stormsWeathered > 0 && stats.breakthroughCount === 0) {
            suggestions.push(...debriefDialogues.growthSuggestions.stormPreparedness);
        }
        
        // Limit to top 3 suggestions
        return suggestions.slice(0, 3);
    }
    
    // Helper methods
    static calculateAverageTrust(pieces) {
        if (pieces.length === 0) return 0;
        const total = pieces.reduce((sum, p) => sum + p.trust, 0);
        return Math.round(total / pieces.length * 10) / 10;
    }
    
    static countPositiveRelationships(pieces) {
        let count = 0;
        pieces.forEach(piece => {
            piece.relationshipMap.forEach((value, key) => {
                if (value > 3) count++;
            });
        });
        return count;
    }
    
    static countTotalRelationships(pieces) {
        let count = 0;
        pieces.forEach(piece => {
            count += piece.relationshipMap.size;
        });
        return count;
    }
    
    static calculateCohesion(pieces) {
        // Complex calculation of team unity
        const avgTrust = this.calculateAverageTrust(pieces);
        const regulatedRatio = pieces.filter(p => p.emotionalState === 'regulated').length / pieces.length;
        const relationshipStrength = this.countPositiveRelationships(pieces) / Math.max(1, this.countTotalRelationships(pieces));
        
        return Math.round((avgTrust / 10 + regulatedRatio + relationshipStrength) * 33.33);
    }
}