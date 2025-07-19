// Manages the 10-match campaign structure and progression
export class CampaignManager {
    constructor(teamId) {
        this.team = teamId;
        this.currentMatch = 1;
        this.campaignData = this.loadCampaignData(teamId);
        this.progress = {
            victories: 0,
            trustedPieces: [],
            breakthroughs: [],
            defections: [],
            stormsWeathered: 0,
            empathyMoments: [],
            unlockedTeams: [teamId],
            achievements: []
        };
        this.narrativeState = {};
    }

    loadCampaignData(teamId) {
        const campaigns = {
            donuts: {
                name: "The Lonely Pastries",
                theme: "Finding belonging after abandonment",
                description: "Orphaned donuts seeking their place in the world",
                colorScheme: 'amber', // Their anxiety shows as amber
                
                matches: [
                    {
                        match: 1,
                        title: "First Day at the Shelter",
                        opponent: "stern_baker",
                        opponentStyle: "harsh",
                        dysregulatedCount: 2,
                        stormTurn: null,
                        objectives: [
                            { type: 'piece_trust', target: 5, pieceIndex: 0, description: "Help Sprinkles trust you" },
                            { type: 'no_defection', description: "Don't let anyone run away" }
                        ],
                        intro: "The donuts huddle together, abandoned at dawn. Their baker never came back.",
                        specialRules: [],
                        unlocks: { piece_backstory: 'sprinkles' }
                    },
                    
                    {
                        match: 2,
                        title: "The Food Critic Arrives",
                        opponent: "perfectionist_critic",
                        opponentStyle: "harsh",
                        dysregulatedCount: 3,
                        stormTurn: 8,
                        stormType: 'performance_pressure',
                        objectives: [
                            { type: 'weather_storm', description: "Help the team through Performance Pressure" },
                            { type: 'collective_trust', target: 25, description: "Build collective trust" }
                        ],
                        intro: "A famous food critic approaches. The donuts' glazes start to sweat.",
                        specialRules: [{ type: 'fragile_confidence' }],
                        unlocks: { empathy_combo: 'sweet_reassurance' }
                    },
                    
                    {
                        match: 3,
                        title: "Midnight Doubts",
                        opponent: "insomniac_manager",
                        opponentStyle: "confused",
                        dysregulatedCount: 4,
                        stormTurn: null,
                        objectives: [
                            { type: 'night_fears', description: "Calm midnight anxieties" },
                            { type: 'piece_breakthrough', pieceIndex: 1, description: "Help Glazed Gary find peace" }
                        ],
                        intro: "3 AM. The display case feels vast and empty. Old fears creep in.",
                        specialRules: [{ type: 'shadow_anxiety', effect: 'anxiety spreads in darkness' }],
                        unlocks: { team: 'croissants' }
                    },
                    
                    {
                        match: 4,
                        title: "The Day-Old Discount",
                        opponent: "bargain_hunter",
                        opponentStyle: "learning",
                        dysregulatedCount: 3,
                        stormTurn: 10,
                        stormType: 'abandonment_echo',
                        objectives: [
                            { type: 'self_worth', description: "Maintain team's self-worth" },
                            { type: 'no_breakdown', description: "Prevent emotional breakdown" }
                        ],
                        intro: "The 'Day-Old' sign goes up. They're worth less now. They've always known it.",
                        specialRules: [{ type: 'diminishing_value', effect: 'trust decays faster' }],
                        unlocks: { piece_backstory: 'boston_cream_betty' }
                    },
                    
                    {
                        match: 5,
                        title: "Finding Foster Family",
                        opponent: "gentle_grandmother",
                        opponentStyle: "supportive",
                        dysregulatedCount: 2,
                        stormTurn: null,
                        objectives: [
                            { type: 'learn_trust', description: "Learn to accept kindness" },
                            { type: 'mutual_support', description: "Pieces support each other" }
                        ],
                        intro: "A kind grandmother enters. But kindness feels dangerous when you've been hurt.",
                        specialRules: [{ type: 'trust_resistance', effect: 'kindness triggers suspicion' }],
                        unlocks: { empathy_combo: 'patient_presence' }
                    },
                    
                    {
                        match: 6,
                        title: "The Bake Sale Betrayal",
                        opponent: "rival_baker",
                        opponentStyle: "harsh",
                        dysregulatedCount: 5,
                        stormTurn: 7,
                        stormType: 'rage_wildfire',
                        objectives: [
                            { type: 'process_betrayal', description: "Process feelings of betrayal" },
                            { type: 'maintain_bonds', description: "Keep the team together" }
                        ],
                        intro: "Your rival reveals they called the health inspector. The betrayal stings.",
                        specialRules: [{ type: 'betrayal_trigger', effect: 'trust gains halved' }],
                        unlocks: { piece_backstory: 'jelly_james' }
                    },
                    
                    {
                        match: 7,
                        title: "Adoption Day",
                        opponent: "nervous_parent",
                        opponentStyle: "learning",
                        dysregulatedCount: 3,
                        stormTurn: null,
                        objectives: [
                            { type: 'ready_for_love', description: "Prepare pieces for adoption" },
                            { type: 'collective_breakthrough', count: 3, description: "Multiple breakthroughs" }
                        ],
                        intro: "A family wants to adopt. But 'forever' is a scary promise to believe.",
                        specialRules: [{ type: 'hope_and_fear', effect: 'extreme emotional swings' }],
                        unlocks: { team: 'renaissance_pets' }
                    },
                    
                    {
                        match: 8,
                        title: "The Return",
                        opponent: "original_baker",
                        opponentStyle: "confused",
                        dysregulatedCount: 6,
                        stormTurn: 5,
                        stormType: 'inner_critic_avalanche',
                        objectives: [
                            { type: 'face_past', description: "Confront abandonment trauma" },
                            { type: 'choose_future', description: "Choose their own path" }
                        ],
                        intro: "The baker who abandoned them returns. 'I had my reasons,' they say.",
                        specialRules: [{ type: 'trauma_confrontation', effect: 'all pieces start dysregulated' }],
                        narrativeBranch: true
                    },
                    
                    {
                        match: 9,
                        title: "Building a New Home",
                        opponent: "community_organizer",
                        opponentStyle: "supportive",
                        dysregulatedCount: 2,
                        stormTurn: null,
                        objectives: [
                            { type: 'create_sanctuary', description: "Build emotional safety" },
                            { type: 'max_trust', count: 4, description: "Maximum trust with 4 pieces" }
                        ],
                        intro: "Together, they're building something new. A place where broken pastries belong.",
                        specialRules: [{ type: 'sanctuary_building', effect: 'can create safe squares' }],
                        unlocks: { empathy_combo: 'unconditional_acceptance' }
                    },
                    
                    {
                        match: 10,
                        title: "The Grand Opening",
                        opponent: "enlightened_chef",
                        opponentStyle: "enlightened",
                        dysregulatedCount: 1,
                        stormTurn: 12,
                        stormType: 'dissociation_fog',
                        objectives: [
                            { type: 'final_test', description: "Face the ultimate emotional challenge" },
                            { type: 'found_family', description: "Prove bonds are unbreakable" }
                        ],
                        intro: "Opening day of their shelter bakery. Will old fears return, or have they healed?",
                        specialRules: [{ type: 'echo_of_past', effect: 'past traumas resurface' }],
                        finale: true
                    }
                ]
            },
            
            renaissance_pets: {
                name: "The Perfect Portraits",
                theme: "Dropping the mask of perfection",
                description: "Renaissance pets hiding their true selves behind oil paint facades",
                colorScheme: 'cyan',
                
                matches: [
                    {
                        match: 1,
                        title: "Behind the Gilded Frame",
                        opponent: "art_collector",
                        opponentStyle: "harsh",
                        dysregulatedCount: 2,
                        stormTurn: null,
                        objectives: [
                            { type: 'maintain_facade', description: "Balance authenticity and expectations" },
                            { type: 'piece_trust', target: 5, pieceIndex: 0, description: "Help Duchess drop her mask" }
                        ],
                        intro: "In the gallery after hours, the portraits begin to move. Their painted smiles crack.",
                        specialRules: [{ type: 'facade_pressure', effect: 'showing emotion damages trust' }]
                    }
                    // ... rest of renaissance_pets campaign
                ],
                // Shorter for example
            },
            
            baseballerinas: {
                name: "The Conflicted Athletes",
                theme: "Integrating opposing identities",
                description: "Part athlete, part artist, fully confused",
                colorScheme: 'magenta',
                
                matches: [
                    {
                        match: 1,
                        title: "Opening Night Double-Header",
                        opponent: "sports_coach",
                        opponentStyle: "harsh",
                        dysregulatedCount: 3,
                        stormTurn: null,
                        objectives: [
                            { type: 'identity_balance', description: "Honor both sides of identity" },
                            { type: 'no_splitting', description: "Prevent identity fragmentation" }
                        ],
                        intro: "Game at 6, recital at 8. The baseballerinas stretch in the dugout, tutus over uniforms."
                    }
                    // ... rest matches
                ]
            }
        };
        
        return campaigns[teamId] || campaigns.donuts;
    }

    loadMatch(matchNumber) {
        const matchData = this.campaignData.matches[matchNumber - 1];
        if (!matchData) return null;
        
        // Process any narrative branches based on previous choices
        if (matchData.narrativeBranch) {
            this.processNarrativeBranch(matchData);
        }
        
        // Add campaign context
        matchData.campaignProgress = this.progress;
        matchData.teamId = this.team;
        matchData.matchNumber = matchNumber;
        
        // Load appropriate opponent based on story
        matchData.opponentTeam = this.getOpponentTeam(matchData.opponent);
        
        return matchData;
    }

    getOpponentTeam(opponentId) {
        const opponents = {
            stern_baker: {
                name: "Stern Baker's Utensils",
                pieces: this.generateOpponentPieces('utilitarian'),
                personality: "No-nonsense kitchen tools who believe in discipline"
            },
            perfectionist_critic: {
                name: "The Critic's Favorites",
                pieces: this.generateOpponentPieces('perfectionist'),
                personality: "Pieces who've never made a mistake... allegedly"
            },
            gentle_grandmother: {
                name: "Grandma's Treasures",
                pieces: this.generateOpponentPieces('nurturing'),
                personality: "Well-loved pieces who know the value of patience"
            },
            enlightened_chef: {
                name: "The Sage's Ingredients",
                pieces: this.generateOpponentPieces('wise'),
                personality: "Ancient spices who've seen it all and accept it all"
            }
            // ... more opponents
        };
        
        return opponents[opponentId] || this.generateGenericOpponent();
    }

    generateOpponentPieces(archetype) {
        const archetypes = {
            utilitarian: {
                names: ["Knife", "Fork", "Spoon", "Whisk", "Timer", "Scale"],
                traits: { resilience: 4, empathy: 2, aggression: 4 }
            },
            perfectionist: {
                names: ["Gold Star", "A Plus", "Trophy", "Medal", "Ribbon", "Crown"],
                traits: { resilience: 3, empathy: 1, anxiety: 5 }
            },
            nurturing: {
                names: ["Warm Blanket", "Soft Pillow", "Gentle Light", "Calm Tea", "Sweet Song", "Quiet Garden"],
                traits: { resilience: 5, empathy: 5, patience: 5 }
            },
            wise: {
                names: ["Ancient Salt", "Elder Pepper", "Sage Leaf", "Time Itself", "Memory Jar", "Story Seed"],
                traits: { resilience: 5, empathy: 4, understanding: 5 }
            }
        };
        
        const data = archetypes[archetype] || archetypes.utilitarian;
        return data.names.map(name => ({
            name,
            personality: { ...data.traits, archetype }
        }));
    }

    processNarrativeBranch(matchData) {
        // Modify match based on previous choices
        if (this.narrativeState.forgaveBaker) {
            matchData.intro += " The baker's apology still echoes in their minds.";
            matchData.dysregulatedCount = Math.max(1, matchData.dysregulatedCount - 1);
        } else if (this.narrativeState.rejectedBaker) {
            matchData.intro += " They chose their found family over their creator.";
            matchData.objectives.push({
                type: 'solidarity',
                description: "Show unity in your choice"
            });
        }
    }

    completeMatch(matchResult) {
        const currentMatchData = this.campaignData.matches[this.currentMatch - 1];
        
        // Record progress
        if (matchResult.victory) {
            this.progress.victories++;
        }
        
        // Track trusted pieces
        matchResult.trustedPieces.forEach(piece => {
            if (!this.progress.trustedPieces.includes(piece.id)) {
                this.progress.trustedPieces.push(piece.id);
            }
        });
        
        // Track breakthroughs
        this.progress.breakthroughs.push(...matchResult.breakthroughs);
        
        // Track defections
        this.progress.defections.push(...matchResult.defections);
        
        // Count weathered storms
        if (matchResult.stormWeathered) {
            this.progress.stormsWeathered++;
        }
        
        // Process unlocks
        if (currentMatchData.unlocks) {
            this.processUnlocks(currentMatchData.unlocks);
        }
        
        // Check achievements
        this.checkAchievements(matchResult);
        
        // Advance to next match
        this.currentMatch++;
        
        // Save progress
        this.saveProgress();
        
        return {
            nextMatch: this.currentMatch,
            unlockedContent: currentMatchData.unlocks,
            newAchievements: this.getNewAchievements(),
            campaignComplete: this.currentMatch > this.campaignData.matches.length
        };
    }

    processUnlocks(unlocks) {
        Object.entries(unlocks).forEach(([type, content]) => {
            switch(type) {
                case 'team':
                    if (!this.progress.unlockedTeams.includes(content)) {
                        this.progress.unlockedTeams.push(content);
                    }
                    break;
                    
                case 'piece_backstory':
                    this.unlockBackstory(content);
                    break;
                    
                case 'empathy_combo':
                    this.unlockEmpathyCombo(content);
                    break;
            }
        });
    }

    unlockBackstory(pieceId) {
        const backstories = {
            sprinkles: {
                title: "Sprinkles' Story",
                text: "Made for a birthday that never came. The party was cancelled, the baker overwhelmed. Sprinkles waited all night for birthday candles that never arrived. Now every celebration feels like a broken promise."
            },
            glazed_gary: {
                title: "Gary's Midnight Origins",
                text: "Created during a midnight stress-baking session. Gary absorbed all the baker's 3 AM anxieties. He knows every worry that keeps people awake, every fear that glazes eyes with tears."
            },
            boston_cream_betty: {
                title: "Betty's Hidden Center",
                text: "Betty hides her cream filling like others hide their soft hearts. She learned early that showing your sweetness means someone will consume it. Better to seem plain. Safer."
            }
            // ... more backstories
        };
        
        if (!this.progress.unlockedBackstories) {
            this.progress.unlockedBackstories = [];
        }
        
        this.progress.unlockedBackstories.push({
            id: pieceId,
            ...backstories[pieceId]
        });
    }

    unlockEmpathyCombo(comboId) {
        const combos = {
            sweet_reassurance: {
                name: "Sweet Reassurance",
                commands: ["validate", "soothe", "here"],
                effect: "Extra effective for abandonment anxiety",
                bonus: 3
            },
            patient_presence: {
                name: "Patient Presence",
                commands: ["pause", "breathe", "ready"],
                effect: "Helps frozen pieces thaw",
                bonus: 2
            },
            unconditional_acceptance: {
                name: "Unconditional Acceptance",
                commands: ["validate", "space", "always"],
                effect: "Heals deepest wounds",
                bonus: 4
            }
        };
        
        if (!this.progress.unlockedCombos) {
            this.progress.unlockedCombos = [];
        }
        
        this.progress.unlockedCombos.push({
            id: comboId,
            ...combos[comboId]
        });
    }

    checkAchievements(matchResult) {
        const achievements = [
            {
                id: 'first_trust',
                name: "First Bond",
                description: "A piece fully trusts you",
                condition: () => matchResult.trustedPieces.some(p => p.trust >= 10)
            },
            {
                id: 'storm_survivor',
                name: "Weather the Storm",
                description: "Complete a match despite an emotional storm",
                condition: () => matchResult.stormWeathered && matchResult.victory
            },
            {
                id: 'no_one_left_behind',
                name: "No One Left Behind",
                description: "Complete a match with no defections",
                condition: () => matchResult.defections.length === 0
            },
            {
                id: 'mass_breakthrough',
                name: "Collective Healing",
                description: "3+ pieces have breakthroughs in one match",
                condition: () => matchResult.breakthroughs.length >= 3
            },
            {
                id: 'empathy_master',
                name: "Empathy Master",
                description: "Use 10 different empathy combinations successfully",
                condition: () => this.progress.empathyMoments.length >= 10
            },
            {
                id: 'the_journey',
                name: "The Journey",
                description: "Complete a full campaign",
                condition: () => this.currentMatch > this.campaignData.matches.length
            }
        ];
        
        achievements.forEach(achievement => {
            if (!this.progress.achievements.find(a => a.id === achievement.id)) {
                if (achievement.condition()) {
                    this.progress.achievements.push({
                        ...achievement,
                        unlockedAt: Date.now(),
                        match: this.currentMatch
                    });
                }
            }
        });
    }

    getNewAchievements() {
        // Return achievements unlocked in the last match
        return this.progress.achievements.filter(a => a.match === this.currentMatch - 1);
    }

    getCampaignStats() {
        const totalMatches = this.campaignData.matches.length;
        const winRate = this.progress.victories / Math.max(1, this.currentMatch - 1);
        
        return {
            campaign: this.campaignData.name,
            progress: `${this.currentMatch - 1}/${totalMatches}`,
            winRate: `${Math.round(winRate * 100)}%`,
            trustedPieces: this.progress.trustedPieces.length,
            breakthroughs: this.progress.breakthroughs.length,
            stormsWeathered: this.progress.stormsWeathered,
            achievements: this.progress.achievements.length
        };
    }

    getMatchPreview(matchNumber) {
        const match = this.campaignData.matches[matchNumber - 1];
        if (!match) return null;
        
        return {
            title: match.title,
            description: match.intro,
            difficulty: this.calculateDifficulty(match),
            objectives: match.objectives.map(obj => obj.description),
            warnings: this.getMatchWarnings(match)
        };
    }

    calculateDifficulty(match) {
        let difficulty = match.dysregulatedCount;
        
        if (match.stormTurn) difficulty += 2;
        if (match.opponentStyle === 'harsh') difficulty += 1;
        if (match.specialRules.some(r => r.type === 'fragile_confidence')) difficulty += 1;
        
        if (difficulty <= 3) return 'Gentle';
        if (difficulty <= 5) return 'Challenging';
        if (difficulty <= 7) return 'Difficult';
        return 'Intense';
    }

    getMatchWarnings(match) {
        const warnings = [];
        
        if (match.stormType) {
            warnings.push(`Emotional Storm: ${match.stormType.replace(/_/g, ' ').toUpperCase()}`);
        }
        
        if (match.specialRules.some(r => r.type === 'betrayal_trigger')) {
            warnings.push('Contains themes of betrayal');
        }
        
        if (match.narrativeBranch) {
            warnings.push('Story-altering decisions ahead');
        }
        
        return warnings;
    }

    getOpponentStyle() {
        const match = this.campaignData.matches[this.currentMatch - 1];
        return match ? match.opponentStyle : 'learning';
    }

    serialize() {
        return {
            team: this.team,
            currentMatch: this.currentMatch,
            progress: this.progress,
            narrativeState: this.narrativeState
        };
    }

    deserialize(data) {
        this.team = data.team;
        this.currentMatch = data.currentMatch;
        this.progress = data.progress;
        this.narrativeState = data.narrativeState;
        this.campaignData = this.loadCampaignData(this.team);
    }

    saveProgress() {
        // Save to localStorage
        localStorage.setItem(`chesstropia_campaign_${this.team}`, JSON.stringify(this.serialize()));
    }

    loadProgress() {
        const saved = localStorage.getItem(`chesstropia_campaign_${this.team}`);
        if (saved) {
            this.deserialize(JSON.parse(saved));
            return true;
        }
        return false;
    }
}