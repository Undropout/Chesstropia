// Manages save states, progress tracking, and player statistics
export class SaveManager {
    constructor() {
        this.saveVersion = '1.0.0';
        this.autoSaveInterval = 60000; // Auto-save every minute
        this.maxSaveSlots = 5;
        this.currentSlot = 'auto';
        
        this.initializeSaveSystem();
        this.startAutoSave();
    }
    
    initializeSaveSystem() {
        // Check for existing saves
        this.saves = this.loadAllSaves();
        
        // Initialize statistics tracking
        this.statistics = this.loadStatistics();
        
        // Initialize achievements
        this.achievements = this.loadAchievements();
        
        // Migration for older save versions
        this.migrateSaves();
    }
    
    // Save state structure
    createSaveState(gameState, metadata = {}) {
        return {
            version: this.saveVersion,
            timestamp: Date.now(),
            metadata: {
                name: metadata.name || 'Autosave',
                matchNumber: gameState.matchNumber || 1,
                team: gameState.currentTeam,
                difficulty: gameState.difficulty,
                ...metadata
            },
            gameState: {
                // Board state
                board: this.serializeBoard(gameState.board),
                pieces: this.serializePieces(gameState.pieces),
                currentTurn: gameState.currentTurn,
                turnCount: gameState.turnCount,
                
                // Emotional states
                teamMood: gameState.teamMood,
                activeStorm: gameState.activeStorm,
                stormProgress: gameState.stormProgress,
                
                // Progress
                trust: this.serializeTrust(gameState.pieces),
                relationships: this.serializeRelationships(gameState.pieces),
                breakthroughs: gameState.breakthroughs,
                defections: gameState.defections,
                
                // Match progress
                playerScore: gameState.playerScore,
                opponentScore: gameState.opponentScore,
                capturedPieces: gameState.capturedPieces
            },
            statistics: {
                // Current match stats
                trustGained: gameState.stats.trustGained,
                trustLost: gameState.stats.trustLost,
                empathyAttempts: gameState.stats.empathyAttempts,
                successfulEmpathy: gameState.stats.successfulEmpathy,
                dysregulationEvents: gameState.stats.dysregulationEvents,
                regulationSuccesses: gameState.stats.regulationSuccesses
            }
        };
    }
    
    // Serialization methods
    serializeBoard(board) {
        const serialized = [];
        for (let row = 0; row < 8; row++) {
            serialized[row] = [];
            for (let col = 0; col < 8; col++) {
                const piece = board.getPieceAt(row, col);
                serialized[row][col] = piece ? piece.id : null;
            }
        }
        return serialized;
    }
    
    serializePieces(pieces) {
        const serialized = {};
        pieces.forEach((piece, id) => {
            serialized[id] = {
                id: piece.id,
                name: piece.name,
                team: piece.team,
                position: piece.position,
                captured: piece.captured,
                isKing: piece.isKing,
                
                // Emotional data
                trust: piece.trust,
                emotionalState: piece.emotionalState,
                dysregulationType: piece.dysregulationType,
                dysregulationTurns: piece.dysregulationTurns,
                resilience: piece.resilience,
                
                // Personality
                personality: piece.personality,
                traits: piece.traits,
                memories: piece.memories,
                
                // Relationships
                relationshipMap: Array.from(piece.relationshipMap.entries()),
                
                // Special states
                hasBreakthrough: piece.hasBreakthrough,
                defectionRisk: piece.defectionRisk,
                supportReceived: piece.supportReceived
            };
        });
        return serialized;
    }
    
    serializeTrust(pieces) {
        const trust = {};
        pieces.forEach((piece, id) => {
            trust[id] = {
                current: piece.trust,
                history: piece.trustHistory || [],
                gained: piece.trustGained || 0,
                lost: piece.trustLost || 0
            };
        });
        return trust;
    }
    
    serializeRelationships(pieces) {
        const relationships = [];
        pieces.forEach((piece1) => {
            piece1.relationshipMap.forEach((value, piece2Id) => {
                // Only save each relationship once
                if (piece1.id < piece2Id) {
                    relationships.push({
                        piece1: piece1.id,
                        piece2: piece2Id,
                        value: value,
                        type: this.categorizeRelationship(value)
                    });
                }
            });
        });
        return relationships;
    }
    
    categorizeRelationship(value) {
        if (value >= 8) return 'deep_bond';
        if (value >= 5) return 'friendship';
        if (value >= 2) return 'acquaintance';
        if (value >= -2) return 'neutral';
        if (value >= -5) return 'tension';
        if (value >= -8) return 'conflict';
        return 'hostile';
    }
    
    // Save operations
    save(gameState, slot = 'auto', metadata = {}) {
        try {
            const saveState = this.createSaveState(gameState, metadata);
            const key = `chesstropia_save_${slot}`;
            
            localStorage.setItem(key, JSON.stringify(saveState));
            
            // Update saves list
            if (!this.saves[slot]) {
                this.saves[slot] = {};
            }
            this.saves[slot] = {
                timestamp: saveState.timestamp,
                metadata: saveState.metadata
            };
            
            this.updateSavesList();
            
            return { success: true, slot: slot };
        } catch (error) {
            console.error('Save failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    load(slot = 'auto') {
        try {
            const key = `chesstropia_save_${slot}`;
            const savedData = localStorage.getItem(key);
            
            if (!savedData) {
                return { success: false, error: 'No save found' };
            }
            
            const saveState = JSON.parse(savedData);
            
            // Deserialize the data
            const gameState = this.deserializeSaveState(saveState);
            
            return { success: true, gameState: gameState };
        } catch (error) {
            console.error('Load failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    deserializeSaveState(saveState) {
        // Reconstruct pieces
        const pieces = new Map();
        Object.entries(saveState.gameState.pieces).forEach(([id, pieceData]) => {
            const piece = {
                ...pieceData,
                relationshipMap: new Map(pieceData.relationshipMap)
            };
            pieces.set(id, piece);
        });
        
        // Reconstruct full game state
        return {
            ...saveState.gameState,
            pieces: pieces,
            loadedFrom: saveState
        };
    }
    
    // Save management
    deleteSave(slot) {
        const key = `chesstropia_save_${slot}`;
        localStorage.removeItem(key);
        delete this.saves[slot];
        this.updateSavesList();
    }
    
    loadAllSaves() {
        const saves = {};
        const savesList = localStorage.getItem('chesstropia_saves_list');
        
        if (savesList) {
            return JSON.parse(savesList);
        }
        
        // Scan for existing saves
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('chesstropia_save_')) {
                const slot = key.replace('chesstropia_save_', '');
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    saves[slot] = {
                        timestamp: data.timestamp,
                        metadata: data.metadata
                    };
                } catch (e) {
                    console.error('Invalid save:', key);
                }
            }
        }
        
        return saves;
    }
    
    updateSavesList() {
        localStorage.setItem('chesstropia_saves_list', JSON.stringify(this.saves));
    }
    
    // Auto-save functionality
    startAutoSave() {
        this.autoSaveTimer = setInterval(() => {
            if (window.gameState && window.gameState.inProgress) {
                this.save(window.gameState, 'auto', { name: 'Autosave' });
            }
        }, this.autoSaveInterval);
    }
    
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
    }
    
    // Statistics tracking
    loadStatistics() {
        const stats = localStorage.getItem('chesstropia_statistics');
        return stats ? JSON.parse(stats) : this.createEmptyStatistics();
    }
    
    createEmptyStatistics() {
        return {
            global: {
                totalMatches: 0,
                matchesWon: 0,
                matchesLost: 0,
                perfectMatches: 0,
                
                totalTrust: 0,
                totalTrustGained: 0,
                totalTrustLost: 0,
                averageTrust: 0,
                
                totalBreakthroughs: 0,
                totalDefections: 0,
                piecesHealed: 0,
                piecesBroken: 0,
                
                stormsWeathered: 0,
                stormsFailures: 0,
                
                empathyAttempts: 0,
                empathySuccesses: 0,
                empathyRate: 0,
                
                playtime: 0,
                favoriteTeam: null,
                favoriteEmpathyCommand: null
            },
            
            perTeam: {},
            
            perPiece: {},
            
            milestones: {
                firstBreakthrough: null,
                firstPerfectMatch: null,
                firstDefection: null,
                allTeamsUnlocked: null,
                masterEmpath: null
            },
            
            records: {
                highestTrust: 0,
                mostBreakthroughs: 0,
                longestWinStreak: 0,
                fastestBreakthrough: null,
                mostTrustedPiece: null
            }
        };
    }
    
    updateStatistics(matchResult) {
        // Update global stats
        this.statistics.global.totalMatches++;
        
        if (matchResult.victory) {
            this.statistics.global.matchesWon++;
        } else {
            this.statistics.global.matchesLost++;
        }
        
        // Trust statistics
        this.statistics.global.totalTrustGained += matchResult.trustGained;
        this.statistics.global.totalTrustLost += matchResult.trustLost;
        
        // Breakthrough and defection tracking
        this.statistics.global.totalBreakthroughs += matchResult.breakthroughs.length;
        this.statistics.global.totalDefections += matchResult.defections.length;
        
        // Empathy tracking
        this.statistics.global.empathyAttempts += matchResult.empathyAttempts;
        this.statistics.global.empathySuccesses += matchResult.empathySuccesses;
        this.statistics.global.empathyRate = 
            this.statistics.global.empathySuccesses / 
            Math.max(1, this.statistics.global.empathyAttempts);
        
        // Team-specific stats
        const teamId = matchResult.team;
        if (!this.statistics.perTeam[teamId]) {
            this.statistics.perTeam[teamId] = {
                matches: 0,
                wins: 0,
                avgTrust: 0,
                breakthroughs: 0,
                playtime: 0
            };
        }
        
        this.statistics.perTeam[teamId].matches++;
        if (matchResult.victory) {
            this.statistics.perTeam[teamId].wins++;
        }
        
        // Update records
        this.updateRecords(matchResult);
        
        // Save statistics
        this.saveStatistics();
    }
    
    updateRecords(matchResult) {
        // Highest trust
        const maxTrust = Math.max(...matchResult.finalTrust.values());
        if (maxTrust > this.statistics.records.highestTrust) {
            this.statistics.records.highestTrust = maxTrust;
        }
        
        // Most breakthroughs in a match
        if (matchResult.breakthroughs.length > this.statistics.records.mostBreakthroughs) {
            this.statistics.records.mostBreakthroughs = matchResult.breakthroughs.length;
        }
        
        // Track milestones
        if (!this.statistics.milestones.firstBreakthrough && matchResult.breakthroughs.length > 0) {
            this.statistics.milestones.firstBreakthrough = Date.now();
        }
        
        if (!this.statistics.milestones.firstDefection && matchResult.defections.length > 0) {
            this.statistics.milestones.firstDefection = Date.now();
        }
        
        if (matchResult.perfectMatch && !this.statistics.milestones.firstPerfectMatch) {
            this.statistics.milestones.firstPerfectMatch = Date.now();
        }
    }
    
    saveStatistics() {
        localStorage.setItem('chesstropia_statistics', JSON.stringify(this.statistics));
    }
    
    // Achievements system
    loadAchievements() {
        const achievements = localStorage.getItem('chesstropia_achievements');
        return achievements ? JSON.parse(achievements) : this.createAchievementsList();
    }
    
    createAchievementsList() {
        return {
            // Trust achievements
            firstTrust: { 
                id: 'first_trust',
                name: 'Building Bridges',
                description: 'Gain your first trust point',
                unlocked: false 
            },
            trustMaster: {
                id: 'trust_master',
                name: 'Trust Master',
                description: 'Reach 10 trust with any piece',
                unlocked: false
            },
            teamBonding: {
                id: 'team_bonding',
                name: 'Stronger Together',
                description: 'Have all pieces above 5 trust',
                unlocked: false
            },
            
            // Breakthrough achievements
            firstBreakthrough: {
                id: 'first_breakthrough',
                name: 'Breakthrough Moment',
                description: 'Help a piece achieve breakthrough',
                unlocked: false
            },
            breakthroughCascade: {
                id: 'breakthrough_cascade',
                name: 'Domino Effect',
                description: 'Trigger 3 breakthroughs in one match',
                unlocked: false
            },
            
            // Empathy achievements
            perfectEmpathy: {
                id: 'perfect_empathy',
                name: 'Perfect Understanding',
                description: 'Complete 10 empathy attempts without failure',
                unlocked: false
            },
            emotionalIntelligence: {
                id: 'emotional_intelligence',
                name: 'Emotional Intelligence',
                description: 'Successfully handle all 5 dysregulation types',
                unlocked: false
            },
            
            // Storm achievements
            stormSurvivor: {
                id: 'storm_survivor',
                name: 'Weather the Storm',
                description: 'Survive an emotional storm without casualties',
                unlocked: false
            },
            stormHealer: {
                id: 'storm_healer',
                name: 'Eye of the Storm',
                description: 'Have a piece breakthrough during a storm',
                unlocked: false
            },
            
            // Challenge achievements
            perfectMatch: {
                id: 'perfect_match',
                name: 'Perfect Harmony',
                description: 'Win without losing any trust',
                unlocked: false
            },
            fromTheAshes: {
                id: 'from_the_ashes',
                name: 'From the Ashes',
                description: 'Win after having a piece defect',
                unlocked: false
            },
            
            // Team achievements
            donutsChampion: {
                id: 'donuts_champion',
                name: 'Sweet Victory',
                description: 'Complete the Donuts campaign',
                unlocked: false
            },
            allTeamsUnlocked: {
                id: 'all_teams_unlocked',
                name: 'Universal Empathy',
                description: 'Unlock all teams',
                unlocked: false
            },
            
            // Special achievements
            listener: {
                id: 'listener',
                name: 'Good Listener',
                description: 'Witness 100 piece memories',
                unlocked: false
            },
            healer: {
                id: 'healer',
                name: 'Wounded Healer',
                description: 'Help 50 pieces reach regulated state',
                unlocked: false
            },
            unbreakableBond: {
                id: 'unbreakable_bond',
                name: 'Unbreakable Bond',
                description: 'Maintain a relationship at 10 for 20 turns',
                unlocked: false
            }
        };
    }
    
    checkAchievements(gameState, event) {
        const newUnlocks = [];
        
        // Check each achievement condition
        Object.entries(this.achievements).forEach(([id, achievement]) => {
            if (!achievement.unlocked && this.checkAchievementCondition(id, gameState, event)) {
                achievement.unlocked = true;
                achievement.unlockedAt = Date.now();
                newUnlocks.push(achievement);
            }
        });
        
        if (newUnlocks.length > 0) {
            this.saveAchievements();
            return newUnlocks;
        }
        
        return null;
    }
    
    checkAchievementCondition(achievementId, gameState, event) {
        switch(achievementId) {
            case 'first_trust':
                return event.type === 'trust_gained' && event.value > 0;
                
            case 'trust_master':
                return event.type === 'trust_gained' && event.piece.trust >= 10;
                
            case 'team_bonding':
                return Array.from(gameState.pieces.values())
                    .filter(p => p.team === 'player')
                    .every(p => p.trust > 5);
                
            case 'first_breakthrough':
                return event.type === 'breakthrough';
                
            case 'perfect_empathy':
                return this.statistics.global.empathyAttempts >= 10 &&
                       this.statistics.global.empathyRate === 1;
                
            // Add more conditions...
            
            default:
                return false;
        }
    }
    
    saveAchievements() {
        localStorage.setItem('chesstropia_achievements', JSON.stringify(this.achievements));
    }
    
    // Progress tracking
    getOverallProgress() {
        const progress = {
            // Campaign progress
            campaignsCompleted: Object.values(this.statistics.perTeam)
                .filter(t => t.wins > 0).length,
            totalCampaigns: 16,
            
            // Achievement progress
            achievementsUnlocked: Object.values(this.achievements)
                .filter(a => a.unlocked).length,
            totalAchievements: Object.keys(this.achievements).length,
            
            // Healing progress
            totalHealed: this.statistics.global.piecesHealed,
            healingRate: this.statistics.global.totalBreakthroughs / 
                        Math.max(1, this.statistics.global.totalMatches),
            
            // Empathy skill
            empathyLevel: this.calculateEmpathyLevel(),
            
            // Time investment
            totalPlaytime: this.statistics.global.playtime,
            
            // Current streak
            currentStreak: this.getCurrentStreak()
        };
        
        progress.overallCompletion = 
            (progress.campaignsCompleted / progress.totalCampaigns * 0.5) +
            (progress.achievementsUnlocked / progress.totalAchievements * 0.3) +
            (Math.min(progress.empathyLevel / 10, 1) * 0.2);
        
        return progress;
    }
    
    calculateEmpathyLevel() {
        const rate = this.statistics.global.empathyRate;
        const attempts = this.statistics.global.empathyAttempts;
        
        if (attempts < 10) return 1;
        if (rate < 0.3) return 2;
        if (rate < 0.5) return 3;
        if (rate < 0.7) return 4;
        if (rate < 0.8) return 5;
        if (rate < 0.9) return 6;
        if (rate < 0.95) return 7;
        if (rate < 0.98) return 8;
        if (rate < 0.99) return 9;
        return 10;
    }
    
    getCurrentStreak() {
        // Track consecutive days played
        const lastPlayed = localStorage.getItem('chesstropia_last_played');
        const today = new Date().toDateString();
        
        if (lastPlayed === today) {
            return parseInt(localStorage.getItem('chesstropia_streak') || '1');
        }
        
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (lastPlayed === yesterday) {
            const streak = parseInt(localStorage.getItem('chesstropia_streak') || '0') + 1;
            localStorage.setItem('chesstropia_streak', streak);
            localStorage.setItem('chesstropia_last_played', today);
            return streak;
        }
        
        // Streak broken
        localStorage.setItem('chesstropia_streak', '1');
        localStorage.setItem('chesstropia_last_played', today);
        return 1;
    }
    
    // Save migration for version updates
    migrateSaves() {
        Object.entries(this.saves).forEach(([slot, saveInfo]) => {
            try {
                const key = `chesstropia_save_${slot}`;
                const saveData = JSON.parse(localStorage.getItem(key));
                
                if (saveData.version !== this.saveVersion) {
                    const migrated = this.migrateSaveData(saveData);
                    localStorage.setItem(key, JSON.stringify(migrated));
                }
            } catch (error) {
                console.error(`Failed to migrate save ${slot}:`, error);
            }
        });
    }
    
    migrateSaveData(saveData) {
        // Handle version-specific migrations
        const migrations = {
            '0.9.0': this.migrateFrom090,
            '0.9.5': this.migrateFrom095
        };
        
        let currentData = saveData;
        let currentVersion = saveData.version;
        
        // Apply migrations in sequence
        while (currentVersion !== this.saveVersion) {
            const migration = migrations[currentVersion];
            if (migration) {
                currentData = migration.call(this, currentData);
                currentVersion = currentData.version;
            } else {
                console.warn(`No migration path from ${currentVersion}`);
                break;
            }
        }
        
        return currentData;
    }
    
    // Export/Import functionality
    exportSave(slot = 'auto') {
        const key = `chesstropia_save_${slot}`;
        const saveData = localStorage.getItem(key);
        
        if (!saveData) return null;
        
        const exportData = {
            save: saveData,
            statistics: localStorage.getItem('chesstropia_statistics'),
            achievements: localStorage.getItem('chesstropia_achievements'),
            exportDate: Date.now(),
            version: this.saveVersion
        };
        
        return btoa(JSON.stringify(exportData));
    }
    
    importSave(importString) {
        try {
            const exportData = JSON.parse(atob(importString));
            
            // Validate import
            if (!exportData.save || !exportData.version) {
                throw new Error('Invalid import data');
            }
            
            // Import save
            const saveData = JSON.parse(exportData.save);
            const slot = `import_${Date.now()}`;
            
            localStorage.setItem(`chesstropia_save_${slot}`, exportData.save);
            
            // Optionally import statistics and achievements
            if (exportData.statistics) {
                localStorage.setItem('chesstropia_statistics', exportData.statistics);
            }
            
            if (exportData.achievements) {
                localStorage.setItem('chesstropia_achievements', exportData.achievements);
            }
            
            // Reload saves list
            this.saves = this.loadAllSaves();
            this.statistics = this.loadStatistics();
            this.achievements = this.loadAchievements();
            
            return { success: true, slot: slot };
        } catch (error) {
            console.error('Import failed:', error);
            return { success: false, error: error.message };
        }
    }
}

// Export singleton
export const saveManager = new SaveManager();

// Window event listeners for auto-save
window.addEventListener('beforeunload', () => {
    if (window.gameState && window.gameState.inProgress) {
        saveManager.save(window.gameState, 'auto', { 
            name: 'Exit Autosave',
            reason: 'window_close'
        });
    }
});

window.addEventListener('blur', () => {
    if (window.gameState && window.gameState.inProgress) {
        saveManager.save(window.gameState, 'auto', {
            name: 'Background Autosave',
            reason: 'window_blur'
        });
    }
});