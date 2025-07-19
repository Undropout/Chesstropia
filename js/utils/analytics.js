// Analytics for understanding player empathy patterns (privacy-focused)
export class EmotionalAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.events = [];
        this.patterns = new Map();
        this.privacyMode = this.getPrivacyPreference();
        
        this.initializeAnalytics();
    }
    
    generateSessionId() {
        // Generate anonymous session ID
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getPrivacyPreference() {
        // Respect user privacy by default
        return localStorage.getItem('chesstropia_analytics') !== 'false';
    }
    
    initializeAnalytics() {
        if (!this.privacyMode) return;
        
        // Track only aggregated, anonymous emotional patterns
        this.emotionalJourney = {
            sessionStart: this.startTime,
            empathyChoices: [],
            emotionalStates: new Map(),
            trustProgression: [],
            breakthroughMoments: [],
            struggleMoments: [],
            healingPatterns: []
        };
        
        // Pattern recognition system
        this.setupPatternRecognition();
    }
    
    setupPatternRecognition() {
        // Common empathy patterns to recognize
        this.empathyPatterns = {
            consistentValidation: {
                name: "Consistent Validator",
                description: "Regularly validates feelings before action",
                indicators: ["validate", "acknowledge", "understand"],
                count: 0
            },
            
            actionOriented: {
                name: "Action-Focused",
                description: "Prefers solving over sitting with feelings",
                indicators: ["fix", "solve", "move"],
                count: 0
            },
            
            patientPresence: {
                name: "Patient Presence",
                description: "Comfortable with silence and waiting",
                indicators: ["wait", "space", "time"],
                count: 0
            },
            
            emotionalMirror: {
                name: "Emotional Mirror",
                description: "Reflects and matches emotional states",
                indicators: ["feel", "together", "understand"],
                count: 0
            },
            
            boundarySetter: {
                name: "Boundary Educator",
                description: "Helps pieces find their boundaries",
                indicators: ["no", "boundary", "limit"],
                count: 0
            }
        };
        
        // Struggle patterns to identify
        this.strugglePatterns = {
            rushingHealing: {
                name: "Rushing Recovery",
                description: "Impatient with healing timeline",
                triggers: ["hurry", "faster", "come on"],
                occurrences: []
            },
            
            fixerComplex: {
                name: "Fixer Complex",
                description: "Uncomfortable with unsolved pain",
                triggers: ["fix", "solve", "better now"],
                occurrences: []
            },
            
            avoidingIntensity: {
                name: "Intensity Avoidance",
                description: "Backs away from strong emotions",
                triggers: ["calm down", "too much", "relax"],
                occurrences: []
            },
            
            projectionPattern: {
                name: "Projection",
                description: "Projects own healing needs onto pieces",
                triggers: ["like me", "I understand", "been there"],
                occurrences: []
            }
        };
    }
    
    // Event tracking methods
    trackEvent(category, action, data = {}) {
        if (!this.privacyMode) return;
        
        const event = {
            timestamp: Date.now(),
            sessionTime: Date.now() - this.startTime,
            category,
            action,
            data: this.sanitizeData(data)
        };
        
        this.events.push(event);
        this.processEvent(event);
        
        // Keep events list manageable
        if (this.events.length > 1000) {
            this.archiveOldEvents();
        }
    }
    
    sanitizeData(data) {
        // Remove any potentially identifying information
        const sanitized = { ...data };
        delete sanitized.userId;
        delete sanitized.email;
        delete sanitized.name;
        
        return sanitized;
    }
    
    processEvent(event) {
        // Route to appropriate processor
        switch (event.category) {
            case 'empathy':
                this.processEmpathyEvent(event);
                break;
            case 'trust':
                this.processTrustEvent(event);
                break;
            case 'breakthrough':
                this.processBreakthroughEvent(event);
                break;
            case 'struggle':
                this.processStruggleEvent(event);
                break;
            case 'relationship':
                this.processRelationshipEvent(event);
                break;
        }
    }
    
    // Empathy pattern analysis
    processEmpathyEvent(event) {
        const choice = event.data.choice;
        const outcome = event.data.outcome;
        
        // Track choice patterns
        this.emotionalJourney.empathyChoices.push({
            time: event.timestamp,
            choice: choice,
            success: outcome === 'positive',
            emotionalState: event.data.targetState
        });
        
        // Update pattern recognition
        Object.values(this.empathyPatterns).forEach(pattern => {
            if (pattern.indicators.some(indicator => choice.includes(indicator))) {
                pattern.count++;
            }
        });
        
        // Analyze empathy effectiveness
        this.analyzeEmpathyEffectiveness();
    }
    
    analyzeEmpathyEffectiveness() {
        const recentChoices = this.emotionalJourney.empathyChoices.slice(-20);
        const successRate = recentChoices.filter(c => c.success).length / recentChoices.length;
        
        // Track effectiveness by emotional state
        const stateEffectiveness = {};
        ['anxious', 'shutdown', 'fight', 'freeze', 'fawn'].forEach(state => {
            const stateChoices = recentChoices.filter(c => c.emotionalState === state);
            if (stateChoices.length > 0) {
                stateEffectiveness[state] = stateChoices.filter(c => c.success).length / stateChoices.length;
            }
        });
        
        this.patterns.set('empathy_effectiveness', {
            overall: successRate,
            byState: stateEffectiveness,
            timestamp: Date.now()
        });
    }
    
    // Trust progression tracking
    processTrustEvent(event) {
        this.emotionalJourney.trustProgression.push({
            time: event.timestamp,
            pieceId: event.data.pieceId,
            change: event.data.change,
            newLevel: event.data.newLevel,
            trigger: event.data.trigger
        });
        
        // Analyze trust building patterns
        this.analyzeTrustPatterns();
    }
    
    analyzeTrustPatterns() {
        const progressions = this.emotionalJourney.trustProgression;
        
        // Calculate trust velocity
        const recentProgressions = progressions.slice(-50);
        const trustVelocity = recentProgressions.reduce((sum, p) => sum + p.change, 0) / recentProgressions.length;
        
        // Identify trust catalysts
        const catalysts = {};
        recentProgressions.forEach(p => {
            if (p.change > 0) {
                catalysts[p.trigger] = (catalysts[p.trigger] || 0) + 1;
            }
        });
        
        this.patterns.set('trust_patterns', {
            velocity: trustVelocity,
            catalysts: catalysts,
            volatility: this.calculateTrustVolatility(recentProgressions)
        });
    }
    
    calculateTrustVolatility(progressions) {
        if (progressions.length < 2) return 0;
        
        let reversals = 0;
        for (let i = 1; i < progressions.length; i++) {
            if ((progressions[i].change > 0) !== (progressions[i-1].change > 0)) {
                reversals++;
            }
        }
        
        return reversals / progressions.length;
    }
    
    // Breakthrough moment analysis
    processBreakthroughEvent(event) {
        const breakthrough = {
            time: event.timestamp,
            pieceId: event.data.pieceId,
            triggerType: event.data.triggerType,
            precedingEvents: this.getRecentEventsForPiece(event.data.pieceId, 10),
            emotionalContext: event.data.emotionalContext
        };
        
        this.emotionalJourney.breakthroughMoments.push(breakthrough);
        this.analyzeBreakthroughPatterns();
    }
    
    analyzeBreakthroughPatterns() {
        const breakthroughs = this.emotionalJourney.breakthroughMoments;
        
        // Identify common breakthrough triggers
        const triggers = {};
        breakthroughs.forEach(b => {
            triggers[b.triggerType] = (triggers[b.triggerType] || 0) + 1;
        });
        
        // Analyze preceding patterns
        const precedingPatterns = this.findCommonPrecedingPatterns(breakthroughs);
        
        this.patterns.set('breakthrough_patterns', {
            commonTriggers: triggers,
            precedingPatterns: precedingPatterns,
            averageTimeToBreakthrough: this.calculateAverageTimeToBreakthrough()
        });
    }
    
    findCommonPrecedingPatterns(breakthroughs) {
        const patterns = {};
        
        breakthroughs.forEach(b => {
            const sequence = b.precedingEvents.map(e => e.action).join('-');
            patterns[sequence] = (patterns[sequence] || 0) + 1;
        });
        
        // Return top patterns
        return Object.entries(patterns)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([pattern, count]) => ({ pattern, count }));
    }
    
    // Struggle pattern identification
    processStruggleEvent(event) {
        const struggle = {
            time: event.timestamp,
            type: event.data.type,
            duration: event.data.duration,
            resolution: event.data.resolution
        };
        
        this.emotionalJourney.struggleMoments.push(struggle);
        
        // Update struggle patterns
        Object.values(this.strugglePatterns).forEach(pattern => {
            if (pattern.triggers.some(trigger => event.data.type.includes(trigger))) {
                pattern.occurrences.push(event.timestamp);
            }
        });
    }
    
    // Generate insights
    generateInsights() {
        const insights = {
            playStyle: this.identifyPlayStyle(),
            strengths: this.identifyStrengths(),
            growthAreas: this.identifyGrowthAreas(),
            emotionalIntelligence: this.assessEmotionalIntelligence(),
            recommendations: this.generateRecommendations()
        };
        
        return insights;
    }
    
    identifyPlayStyle() {
        // Find dominant empathy pattern
        let dominantPattern = null;
        let maxCount = 0;
        
        Object.entries(this.empathyPatterns).forEach(([key, pattern]) => {
            if (pattern.count > maxCount) {
                maxCount = pattern.count;
                dominantPattern = pattern;
            }
        });
        
        return {
            primary: dominantPattern?.name || "Balanced Approach",
            description: dominantPattern?.description || "Uses varied empathy strategies",
            consistency: this.calculateStyleConsistency()
        };
    }
    
    identifyStrengths() {
        const strengths = [];
        const effectiveness = this.patterns.get('empathy_effectiveness');
        
        if (effectiveness) {
            // High overall effectiveness
            if (effectiveness.overall > 0.8) {
                strengths.push({
                    area: "Empathic Accuracy",
                    description: "Excellent at reading emotional needs"
                });
            }
            
            // Check specific emotional states
            Object.entries(effectiveness.byState).forEach(([state, rate]) => {
                if (rate > 0.85) {
                    strengths.push({
                        area: `${state} Support`,
                        description: `Particularly effective with ${state} states`
                    });
                }
            });
        }
        
        // Trust building
        const trustPatterns = this.patterns.get('trust_patterns');
        if (trustPatterns?.velocity > 0.5) {
            strengths.push({
                area: "Trust Building",
                description: "Creates safe relationships quickly"
            });
        }
        
        return strengths;
    }
    
    identifyGrowthAreas() {
        const growthAreas = [];
        
        // Check struggle patterns
        Object.entries(this.strugglePatterns).forEach(([key, pattern]) => {
            if (pattern.occurrences.length > 5) {
                growthAreas.push({
                    area: pattern.name,
                    description: pattern.description,
                    frequency: pattern.occurrences.length
                });
            }
        });
        
        // Low effectiveness areas
        const effectiveness = this.patterns.get('empathy_effectiveness');
        if (effectiveness) {
            Object.entries(effectiveness.byState).forEach(([state, rate]) => {
                if (rate < 0.5) {
                    growthAreas.push({
                        area: `${state} Support`,
                        description: `Could improve response to ${state} states`,
                        frequency: "ongoing"
                    });
                }
            });
        }
        
        return growthAreas;
    }
    
    assessEmotionalIntelligence() {
        const scores = {
            awareness: this.calculateAwarenessScore(),
            regulation: this.calculateRegulationScore(),
            empathy: this.calculateEmpathyScore(),
            relationships: this.calculateRelationshipScore()
        };
        
        const overall = Object.values(scores).reduce((sum, score) => sum + score, 0) / 4;
        
        return {
            scores,
            overall,
            level: this.getEQLevel(overall)
        };
    }
    
    calculateAwarenessScore() {
        // Based on recognizing emotional states correctly
        const effectiveness = this.patterns.get('empathy_effectiveness');
        if (!effectiveness) return 50;
        
        return Math.round(effectiveness.overall * 100);
    }
    
    calculateRegulationScore() {
        // Based on helping pieces regulate
        const breakthroughs = this.emotionalJourney.breakthroughMoments.length;
        const struggles = this.emotionalJourney.struggleMoments.length;
        
        if (breakthroughs + struggles === 0) return 50;
        
        return Math.round((breakthroughs / (breakthroughs + struggles)) * 100);
    }
    
    calculateEmpathyScore() {
        // Based on empathy choice success
        const choices = this.emotionalJourney.empathyChoices;
        if (choices.length === 0) return 50;
        
        const successRate = choices.filter(c => c.success).length / choices.length;
        return Math.round(successRate * 100);
    }
    
    calculateRelationshipScore() {
        // Based on trust patterns
        const trustPatterns = this.patterns.get('trust_patterns');
        if (!trustPatterns) return 50;
        
        const score = (trustPatterns.velocity + 1) * 50; // Normalize to 0-100
        return Math.max(0, Math.min(100, Math.round(score)));
    }
    
    getEQLevel(score) {
        if (score >= 90) return "Exceptional";
        if (score >= 75) return "Advanced";
        if (score >= 60) return "Developing";
        if (score >= 45) return "Emerging";
        return "Beginning";
    }
    
    generateRecommendations() {
        const recommendations = [];
        const insights = {
            playStyle: this.identifyPlayStyle(),
            growthAreas: this.identifyGrowthAreas()
        };
        
        // Style-based recommendations
        if (insights.playStyle.primary === "Action-Focused") {
            recommendations.push({
                title: "Practice Presence",
                description: "Try sitting with emotions before jumping to solutions",
                practice: "Use 'pause' and 'breathe' options more frequently"
            });
        }
        
        // Growth area recommendations
        insights.growthAreas.forEach(area => {
            if (area.area === "Rushing Recovery") {
                recommendations.push({
                    title: "Patience with Process",
                    description: "Healing takes time - trust the journey",
                    practice: "Count to 5 before choosing empathy responses"
                });
            }
        });
        
        return recommendations;
    }
    
    // Session summary
    generateSessionSummary() {
        const duration = Date.now() - this.startTime;
        const insights = this.generateInsights();
        
        return {
            duration: this.formatDuration(duration),
            eventsTracked: this.events.length,
            empathyChoices: this.emotionalJourney.empathyChoices.length,
            breakthroughs: this.emotionalJourney.breakthroughMoments.length,
            insights: insights,
            patterns: Array.from(this.patterns.entries())
        };
    }
    
    formatDuration(ms) {
        const minutes = Math.floor(ms / 60000);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        }
        return `${minutes}m`;
    }
    
    // Utility methods
    getRecentEventsForPiece(pieceId, count = 10) {
        return this.events
            .filter(e => e.data.pieceId === pieceId)
            .slice(-count);
    }
    
    calculateStyleConsistency() {
        const recentChoices = this.emotionalJourney.empathyChoices.slice(-20);
        if (recentChoices.length < 5) return 0;
        
        // Check how consistent the choices are
        const choiceTypes = recentChoices.map(c => c.choice.split('_')[0]);
        const uniqueTypes = new Set(choiceTypes).size;
        
        return 1 - (uniqueTypes / choiceTypes.length);
    }
    
    archiveOldEvents() {
        // Keep only last 500 events in memory
        const archived = this.events.splice(0, this.events.length - 500);
        
        // Could save to IndexedDB for long-term analysis
        if (window.indexedDB && this.privacyMode) {
            this.saveToIndexedDB('archived_events', archived);
        }
    }
    
    // Privacy controls
    setPrivacyMode(enabled) {
        this.privacyMode = enabled;
        localStorage.setItem('chesstropia_analytics', enabled);
        
        if (!enabled) {
            this.clearAllData();
        }
    }
    
    clearAllData() {
        this.events = [];
        this.patterns.clear();
        this.emotionalJourney = {
            empathyChoices: [],
            emotionalStates: new Map(),
            trustProgression: [],
            breakthroughMoments: [],
            struggleMoments: [],
            healingPatterns: []
        };
    }
    
    // Export functionality
    exportInsights() {
        const summary = this.generateSessionSummary();
        const data = {
            generated: new Date().toISOString(),
            session: this.sessionId,
            summary: summary,
            privacyNote: "This data is anonymous and contains no personal information"
        };
        
        return JSON.stringify(data, null, 2);
    }
}

// Export singleton
export const analytics = new EmotionalAnalytics();

// Helper functions for easy tracking
export const track = (category, action, data) => {
    analytics.trackEvent(category, action, data);
};

export const trackEmpathy = (choice, outcome, targetState) => {
    analytics.trackEvent('empathy', choice, { choice, outcome, targetState });
};

export const trackTrust = (pieceId, change, newLevel, trigger) => {
    analytics.trackEvent('trust', change > 0 ? 'gained' : 'lost', {
        pieceId, change, newLevel, trigger
    });
};

export const trackBreakthrough = (pieceId, triggerType, context) => {
    analytics.trackEvent('breakthrough', 'achieved', {
        pieceId, triggerType, emotionalContext: context
    });
};

export const getInsights = () => analytics.generateInsights();
export const getSummary = () => analytics.generateSessionSummary();