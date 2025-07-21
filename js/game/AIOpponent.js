// AI opponent with emotional awareness and varying play styles
import { EventEmitter } from '../utils/EventEmitter.js';

export class AIOpponent extends EventEmitter {
    constructor(difficulty = 'normal') {
        super();
        
        this.difficulty = difficulty;
        this.personality = this.generateAIPersonality();
        this.moveHistory = [];
        this.targetingPatterns = new Map();
        this.emotionalAwareness = this.getEmotionalAwareness();
        
        this.initialize();
    }
    
    initialize() {
        this.setupDifficultyParameters();
        this.loadStrategies();
        this.initializeLearningSystem();
    }
    
    generateAIPersonality() {
        const personalities = {
            ruthless: {
                name: 'The Ruthless',
                description: 'Targets vulnerable pieces without mercy',
                traits: {
                    aggression: 0.9,
                    empathy: 0.1,
                    strategy: 0.7,
                    adaptability: 0.5
                },
                targetPreference: 'vulnerable',
                dialogue: {
                    capture: 'Weakness will be punished.',
                    threatened: 'Your emotions make you weak.',
                    winning: 'This is the natural order.',
                    losing: 'Impossible. You\'re too soft to win.'
                }
            },
            
            strategic: {
                name: 'The Strategist',
                description: 'Calculates optimal moves regardless of emotion',
                traits: {
                    aggression: 0.5,
                    empathy: 0.3,
                    strategy: 0.95,
                    adaptability: 0.8
                },
                targetPreference: 'optimal',
                dialogue: {
                    capture: 'A necessary move.',
                    threatened: 'Interesting counterplay.',
                    winning: 'As calculated.',
                    losing: 'I miscalculated your emotional strength.'
                }
            },
            
            conflicted: {
                name: 'The Conflicted',
                description: 'Struggles with causing emotional harm',
                traits: {
                    aggression: 0.4,
                    empathy: 0.7,
                    strategy: 0.6,
                    adaptability: 0.6
                },
                targetPreference: 'regulated',
                dialogue: {
                    capture: 'I\'m sorry... but this is the game...',
                    threatened: 'Maybe we both can find peace?',
                    winning: 'This doesn\'t feel like victory...',
                    losing: 'Perhaps this is better...'
                }
            },
            
            learning: {
                name: 'The Student',
                description: 'Adapts to player\'s emotional patterns',
                traits: {
                    aggression: 0.5,
                    empathy: 0.5,
                    strategy: 0.7,
                    adaptability: 0.95
                },
                targetPreference: 'adaptive',
                dialogue: {
                    capture: 'I\'m learning from this.',
                    threatened: 'You\'re teaching me something.',
                    winning: 'I\'ve learned your patterns.',
                    losing: 'There\'s still more to understand.'
                }
            },
            
            chaotic: {
                name: 'The Chaos',
                description: 'Unpredictable, emotion-driven moves',
                traits: {
                    aggression: 0.7,
                    empathy: 0.2,
                    strategy: 0.3,
                    adaptability: 0.4
                },
                targetPreference: 'random',
                dialogue: {
                    capture: 'HAHA! Didn\'t see that coming!',
                    threatened: 'Ooh, spicy! I like it!',
                    winning: 'Chaos always wins!',
                    losing: 'Even chaos must bow to heart!'
                }
            }
        };
        
        // Select based on difficulty
        const difficultyMap = {
            easy: ['conflicted', 'chaotic'],
            normal: ['strategic', 'learning'],
            hard: ['ruthless', 'strategic'],
            adaptive: ['learning']
        };
        
        const options = difficultyMap[this.difficulty] || ['strategic'];
        const selected = options[Math.floor(Math.random() * options.length)];
        
        return personalities[selected];
    }
    
    setupDifficultyParameters() {
        const parameters = {
            easy: {
                thinkingDepth: 1,
                mistakeChance: 0.3,
                emotionalExploitation: 0.1,
                captureReluctance: 0.4,
                supportRecognition: 0.2
            },
            normal: {
                thinkingDepth: 2,
                mistakeChance: 0.15,
                emotionalExploitation: 0.3,
                captureReluctance: 0.2,
                supportRecognition: 0.5
            },
            hard: {
                thinkingDepth: 3,
                mistakeChance: 0.05,
                emotionalExploitation: 0.6,
                captureReluctance: 0.1,
                supportRecognition: 0.8
            },
            adaptive: {
                thinkingDepth: 2,
                mistakeChance: 0.1,
                emotionalExploitation: 0.4,
                captureReluctance: 0.15,
                supportRecognition: 0.7
            }
        };
        
        this.parameters = parameters[this.difficulty] || parameters.normal;
    }
    
    loadStrategies() {
        this.strategies = {
            aggressive: {
                name: 'Aggressive Push',
                evaluate: (state) => this.evaluateAggressiveStrategy(state),
                weight: this.personality.traits.aggression
            },
            
            defensive: {
                name: 'Defensive Formation',
                evaluate: (state) => this.evaluateDefensiveStrategy(state),
                weight: 1 - this.personality.traits.aggression
            },
            
            targeting: {
                name: 'Emotional Targeting',
                evaluate: (state) => this.evaluateTargetingStrategy(state),
                weight: this.parameters.emotionalExploitation
            },
            
            disruption: {
                name: 'Relationship Disruption',
                evaluate: (state) => this.evaluateDisruptionStrategy(state),
                weight: this.personality.traits.strategy * 0.5
            },
            
            positional: {
                name: 'Board Control',
                evaluate: (state) => this.evaluatePositionalStrategy(state),
                weight: this.personality.traits.strategy
            }
        };
    }
    
    initializeLearningSystem() {
        this.learningData = {
            playerPatterns: new Map(),
            successfulMoves: [],
            failedMoves: [],
            emotionalTriggers: new Map(),
            empathyResponses: new Map()
        };
    }
    
    getEmotionalAwareness() {
        // How well AI understands emotional states
        const awarenessLevels = {
            easy: {
                stateRecognition: 0.5,
                contagionPrediction: 0.2,
                supportUnderstanding: 0.3,
                stormAwareness: 0.4
            },
            normal: {
                stateRecognition: 0.7,
                contagionPrediction: 0.5,
                supportUnderstanding: 0.6,
                stormAwareness: 0.7
            },
            hard: {
                stateRecognition: 0.9,
                contagionPrediction: 0.8,
                supportUnderstanding: 0.8,
                stormAwareness: 0.9
            }
        };
        
        return awarenessLevels[this.difficulty] || awarenessLevels.normal;
    }
    
    calculateMove(gameState) {
        // Get all possible moves
        const possibleMoves = this.getAllPossibleMoves(gameState);
        
        if (possibleMoves.length === 0) {
            return null; // No valid moves
        }
        
        // Check for forced captures
        const captures = possibleMoves.filter(move => move.captured);
        if (captures.length > 0) {
            possibleMoves.splice(0, possibleMoves.length, ...captures);
        }
        
        // Evaluate each move
        const evaluatedMoves = possibleMoves.map(move => ({
            ...move,
            score: this.evaluateMove(move, gameState)
        }));
        
        // Sort by score
        evaluatedMoves.sort((a, b) => b.score - a.score);
        
        // Apply mistake chance
        if (Math.random() < this.parameters.mistakeChance) {
            // Make suboptimal move
            const midIndex = Math.floor(evaluatedMoves.length / 2);
            return evaluatedMoves[midIndex + Math.floor(Math.random() * (evaluatedMoves.length - midIndex))];
        }
        
        // Consider personality
        if (this.personality.traits.empathy > 0.6 && evaluatedMoves[0].captured) {
            // Conflicted AI might avoid captures
            if (Math.random() < this.parameters.captureReluctance) {
                const nonCaptures = evaluatedMoves.filter(m => !m.captured);
                if (nonCaptures.length > 0) {
                    return nonCaptures[0];
                }
            }
        }
        
        // Return best move
        const bestMove = evaluatedMoves[0];
        
        // Learn from this move
        this.recordMove(bestMove, gameState);
        
        return bestMove;
    }
    
    getAllPossibleMoves(gameState) {
        const moves = [];
        const aiPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'opponent' && !p.captured);
        
        aiPieces.forEach(piece => {
            const pieceMoves = this.getPieceMoves(piece, gameState);
            pieceMoves.forEach(move => {
                moves.push({
                    piece: piece,
                    from: piece.position,
                    to: move,
                    captured: move.captured || null
                });
            });
        });
        
        return moves;
    }
    
    getPieceMoves(piece, gameState) {
        const moves = [];
        const direction = piece.team === 'opponent' ? 1 : -1;
        
        // Regular moves
        const regularMoves = [
            { row: piece.position.row + direction, col: piece.position.col - 1 },
            { row: piece.position.row + direction, col: piece.position.col + 1 }
        ];
        
        if (piece.isKing) {
            regularMoves.push(
                { row: piece.position.row - direction, col: piece.position.col - 1 },
                { row: piece.position.row - direction, col: piece.position.col + 1 }
            );
        }
        
        regularMoves.forEach(move => {
            if (this.isValidPosition(move) && !this.getPieceAt(move, gameState)) {
                moves.push(move);
            }
        });
        
        // Capture moves
        const captures = this.getCaptureMoves(piece, gameState);
        moves.push(...captures);
        
        return moves;
    }
    
    getCaptureMoves(piece, gameState, position = null, capturedPieces = []) {
        const moves = [];
        const pos = position || piece.position;
        const directions = piece.isKing 
            ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
            : piece.team === 'opponent' 
                ? [[1, -1], [1, 1]]
                : [[-1, -1], [-1, 1]];
        
        directions.forEach(([dRow, dCol]) => {
            const jumpOver = { row: pos.row + dRow, col: pos.col + dCol };
            const landAt = { row: pos.row + dRow * 2, col: pos.col + dCol * 2 };
            
            if (this.isValidPosition(landAt)) {
                const jumpPiece = this.getPieceAt(jumpOver, gameState);
                const landPiece = this.getPieceAt(landAt, gameState);
                
                if (jumpPiece && 
                    jumpPiece.team !== piece.team && 
                    !landPiece && 
                    !capturedPieces.includes(jumpPiece)) {
                    
                    const captureMove = {
                        ...landAt,
                        captured: jumpPiece
                    };
                    
                    moves.push(captureMove);
                    
                    // Check for multiple captures
                    const furtherCaptures = this.getCaptureMoves(
                        piece, 
                        gameState,
                        landAt, 
                        [...capturedPieces, jumpPiece]
                    );
                    
                    furtherCaptures.forEach(further => {
                        moves.push({
                            ...further,
                            captured: [jumpPiece, ...(Array.isArray(further.captured) ? further.captured : [further.captured])]
                        });
                    });
                }
            }
        });
        
        return moves;
    }
    
    evaluateMove(move, gameState) {
        let score = 0;
        
        // Apply different strategies
        Object.values(this.strategies).forEach(strategy => {
            score += strategy.evaluate(move, gameState) * strategy.weight;
        });
        
        // Depth-based evaluation
        if (this.parameters.thinkingDepth > 1) {
            score += this.deepEvaluation(move, gameState, this.parameters.thinkingDepth - 1) * 0.5;
        }
        
        // Personality modifiers
        score = this.applyPersonalityModifiers(score, move, gameState);
        
        return score;
    }
    
    evaluateAggressiveStrategy(move, gameState) {
        let score = 0;
        
        // Forward movement
        const forwardProgress = move.to.row - move.from.row;
        score += forwardProgress * 10;
        
        // Captures are highly valued
        if (move.captured) {
            score += 50;
            
            // Multiple captures even better
            if (Array.isArray(move.captured)) {
                score += move.captured.length * 30;
            }
            
            // Capturing high-value targets
            if (move.captured.trust > 7) {
                score += 20; // High-trust pieces are valuable
            }
            
            if (move.captured.hasBreakthrough) {
                score += 30; // Breakthrough pieces are threats
            }
        }
        
        // Threatening opponent pieces
        const threats = this.countThreats(move.to, gameState);
        score += threats * 15;
        
        return score;
    }
    
    evaluateDefensiveStrategy(move, gameState) {
        let score = 0;
        
        // Protect vulnerable pieces
        const protection = this.evaluateProtection(move, gameState);
        score += protection * 20;
        
        // Avoid being captured
        const safety = this.evaluateSafety(move.to, gameState);
        score += safety * 25;
        
        // Formation strength
        const formation = this.evaluateFormation(move, gameState);
        score += formation * 15;
        
        // King row defense
        if (move.from.row === 0) {
            score -= 10; // Reluctant to leave king row
        }
        
        return score;
    }
    
    evaluateTargetingStrategy(move, gameState) {
        let score = 0;
        
        if (!move.captured) return score;
        
        const target = move.captured;
        
        // Emotional vulnerability
        if (this.emotionalAwareness.stateRecognition > Math.random()) {
            if (target.emotionalState !== 'regulated') {
                score += 30;
                
                // Specific vulnerabilities
                if (target.emotionalState === 'anxious' && target.trust < 3) {
                    score += 20; // Very vulnerable
                }
                
                if (target.emotionalState === 'shutdown') {
                    score += 15; // Can't respond well
                }
                
                if (target.defectionRisk) {
                    score -= 10; // Might defect to our side
                }
            }
        }
        
        // Low trust targets
        if (target.trust < 0) {
            score += 25; // Already struggling
        }
        
        // Isolated pieces
        const isolation = this.evaluateIsolation(target, gameState);
        score += isolation * 10;
        
        return score;
    }
    
    evaluateDisruptionStrategy(move, gameState) {
        let score = 0;
        
        // Breaking strong relationships
        if (move.captured) {
            const relationships = this.evaluateRelationshipImpact(move.captured, gameState);
            score += relationships * 15;
        }
        
        // Creating emotional contagion opportunities
        const contagionRisk = this.evaluateContagionRisk(move.to, gameState);
        score += contagionRisk * 10;
        
        // Separating bonded pairs
        const separation = this.evaluateSeparation(move, gameState);
        score += separation * 20;
        
        return score;
    }
    
    evaluatePositionalStrategy(move, gameState) {
        let score = 0;
        
        // Center control
        const centerDistance = Math.abs(move.to.col - 3.5) + Math.abs(move.to.row - 3.5);
        score += (7 - centerDistance) * 5;
        
        // King promotion potential
        const promotionDistance = 7 - move.to.row;
        if (!move.piece.isKing) {
            score += (7 - promotionDistance) * 8;
        }
        
        // Mobility
        const mobility = this.evaluateMobility(move.to, move.piece, gameState);
        score += mobility * 6;
        
        // Supporting other pieces
        const support = this.evaluateSupport(move.to, gameState);
        score += support * 8;
        
        return score;
    }
    
    deepEvaluation(move, gameState, depth) {
        if (depth <= 0) return 0;
        
        // Simulate move
        const simulatedState = this.simulateMove(move, gameState);
        
        // Get opponent's best response
        const opponentMoves = this.getPlayerBestMoves(simulatedState);
        if (opponentMoves.length === 0) return 100; // Opponent has no moves
        
        let worstCase = Infinity;
        
        opponentMoves.slice(0, 3).forEach(oppMove => {
            const afterOpponent = this.simulateMove(oppMove, simulatedState);
            const evaluation = this.evaluatePosition(afterOpponent) + 
                             this.deepEvaluation(oppMove, afterOpponent, depth - 1) * 0.7;
            
            worstCase = Math.min(worstCase, evaluation);
        });
        
        return worstCase;
    }
    
    applyPersonalityModifiers(baseScore, move, gameState) {
        let score = baseScore;
        
        // Ruthless - bonus for causing emotional damage
        if (this.personality.name === 'The Ruthless' && move.captured) {
            if (move.captured.emotionalState !== 'regulated') {
                score *= 1.2;
            }
        }
        
        // Conflicted - penalty for captures
        if (this.personality.name === 'The Conflicted' && move.captured) {
            score *= 0.8;
            
            // Extra penalty for vulnerable pieces
            if (move.captured.trust < 3) {
                score *= 0.7;
            }
        }
        
        // Learning - adapt to player patterns
        if (this.personality.name === 'The Student') {
            const pattern = this.recognizePattern(move, gameState);
            if (pattern) {
                score *= pattern.effectiveness;
            }
        }
        
        // Chaotic - add randomness
        if (this.personality.name === 'The Chaos') {
            score *= (0.5 + Math.random());
        }
        
        return score;
    }
    
    // Helper evaluation methods
    evaluateProtection(move, gameState) {
        let protection = 0;
        const friendlyPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'opponent' && !p.captured);
        
        friendlyPieces.forEach(friendly => {
            if (this.canProtect(move.to, friendly.position)) {
                protection++;
                
                // More valuable to protect threatened pieces
                if (this.isUnderThreat(friendly.position, gameState)) {
                    protection += 2;
                }
            }
        });
        
        return protection;
    }
    
    evaluateSafety(position, gameState) {
        let safety = 0;
        const threats = this.getThreatsToPosition(position, gameState);
        
        safety -= threats.length * 10;
        
        // Check if protected
        const protectors = this.getProtectors(position, gameState);
        safety += protectors.length * 5;
        
        // Edge safety
        if (position.col === 0 || position.col === 7) {
            safety += 3;
        }
        
        return safety;
    }
    
    evaluateFormation(move, gameState) {
        let formation = 0;
        const friendlyPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'opponent' && !p.captured);
        
        // Check for defensive formations
        friendlyPieces.forEach(friendly => {
            const distance = Math.abs(move.to.row - friendly.position.row) + 
                           Math.abs(move.to.col - friendly.position.col);
            
            if (distance === 2) {
                formation += 3; // Good spacing
            } else if (distance === 1) {
                formation += 1; // Too close
            }
        });
        
        return formation;
    }
    
    evaluateIsolation(piece, gameState) {
        const allies = Array.from(gameState.pieces.values())
            .filter(p => p.team === piece.team && !p.captured && p.id !== piece.id);
        
        let minDistance = Infinity;
        allies.forEach(ally => {
            const distance = Math.abs(piece.position.row - ally.position.row) + 
                           Math.abs(piece.position.col - ally.position.col);
            minDistance = Math.min(minDistance, distance);
        });
        
        return minDistance > 3 ? minDistance : 0;
    }
    
    evaluateRelationshipImpact(captured, gameState) {
        let impact = 0;
        const allies = Array.from(gameState.pieces.values())
            .filter(p => p.team === captured.team && !p.captured);
        
        allies.forEach(ally => {
            const relationship = ally.relationshipMap.get(captured.id) || 0;
            if (relationship > 5) {
                impact += 3; // Strong bond broken
            } else if (relationship > 3) {
                impact += 1; // Moderate bond broken
            }
        });
        
        return impact;
    }
    
    evaluateContagionRisk(position, gameState) {
        let risk = 0;
        
        // Check nearby opponent pieces
        const nearbyEnemies = this.getNearbyPieces(position, gameState, 'player');
        
        nearbyEnemies.forEach(enemy => {
            if (enemy.emotionalState !== 'regulated') {
                risk += 2;
                
                // Higher risk if multiple dysregulated pieces nearby
                const dysregulatedNearby = this.getNearbyPieces(enemy.position, gameState, 'player')
                    .filter(p => p.emotionalState !== 'regulated').length;
                
                risk += dysregulatedNearby;
            }
        });
        
        return risk;
    }
    
    evaluateSeparation(move, gameState) {
        let separation = 0;
        
        if (!move.captured) return separation;
        
        // Check if we're separating bonded pieces
        const allies = Array.from(gameState.pieces.values())
            .filter(p => p.team === move.captured.team && !p.captured);
        
        allies.forEach(ally => {
            const relationship = ally.relationshipMap.get(move.captured.id) || 0;
            const distance = Math.abs(ally.position.row - move.captured.position.row) + 
                           Math.abs(ally.position.col - move.captured.position.col);
            
            if (relationship > 5 && distance <= 2) {
                separation += 5; // Separating close bonded pieces
            }
        });
        
        return separation;
    }
    
    evaluateMobility(position, piece, gameState) {
        // Simulate piece at new position
        const tempPiece = { ...piece, position: position };
        const futureMoves = this.getPieceMoves(tempPiece, gameState);
        
        return futureMoves.length;
    }
    
    evaluateSupport(position, gameState) {
        const friendlyPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'opponent' && !p.captured);
        
        let support = 0;
        friendlyPieces.forEach(friendly => {
            if (this.canSupport(position, friendly.position)) {
                support++;
            }
        });
        
        return support;
    }
    
    // Utility methods
    isValidPosition(position) {
        return position.row >= 0 && position.row < 8 && 
               position.col >= 0 && position.col < 8;
    }
    
    getPieceAt(position, gameState) {
        return Array.from(gameState.pieces.values()).find(p => 
            !p.captured && 
            p.position.row === position.row && 
            p.position.col === position.col
        );
    }
    
    countThreats(position, gameState) {
        const enemyPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        let threats = 0;
        enemyPieces.forEach(enemy => {
            if (this.canCapture(position, enemy.position)) {
                threats++;
            }
        });
        
        return threats;
    }
    
    getThreatsToPosition(position, gameState) {
        const threats = [];
        const enemyPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        enemyPieces.forEach(enemy => {
            if (this.canThreaten(enemy, position, gameState)) {
                threats.push(enemy);
            }
        });
        
        return threats;
    }
    
    getProtectors(position, gameState) {
        const protectors = [];
        const friendlyPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'opponent' && !p.captured);
        
        friendlyPieces.forEach(friendly => {
            if (this.canProtect(friendly.position, position)) {
                protectors.push(friendly);
            }
        });
        
        return protectors;
    }
    
    canCapture(fromPos, targetPos) {
        const rowDiff = Math.abs(fromPos.row - targetPos.row);
        const colDiff = Math.abs(fromPos.col - targetPos.col);
        
        return rowDiff === 1 && colDiff === 1;
    }
    
    canThreaten(piece, targetPos, gameState) {
        const captures = this.getCaptureMoves(piece, gameState);
        return captures.some(move => 
            move.row === targetPos.row && move.col === targetPos.col
        );
    }
    
    canProtect(protectorPos, targetPos) {
        // Can protect if diagonal and close
        const rowDiff = Math.abs(protectorPos.row - targetPos.row);
        const colDiff = Math.abs(protectorPos.col - targetPos.col);
        
        return rowDiff === colDiff && rowDiff <= 2;
    }
    
    canSupport(pos1, pos2) {
        const distance = Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
        return distance <= 3;
    }
    
    getNearbyPieces(position, gameState, team = null) {
        return Array.from(gameState.pieces.values()).filter(p => {
            if (p.captured) return false;
            if (team && p.team !== team) return false;
            
            const distance = Math.abs(p.position.row - position.row) + 
                           Math.abs(p.position.col - position.col);
            return distance <= 2;
        });
    }
    
    isUnderThreat(position, gameState) {
        return this.getThreatsToPosition(position, gameState).length > 0;
    }
    
    simulateMove(move, gameState) {
        // Create a deep copy of game state
        const simulated = {
            pieces: new Map(),
            currentTurn: gameState.currentTurn === 'player' ? 'opponent' : 'player'
        };
        
        // Copy pieces
        gameState.pieces.forEach((piece, id) => {
            simulated.pieces.set(id, { ...piece });
        });
        
        // Apply move
        const movedPiece = simulated.pieces.get(move.piece.id);
        movedPiece.position = move.to;
        
        // Handle captures
        if (move.captured) {
            const captures = Array.isArray(move.captured) ? move.captured : [move.captured];
            captures.forEach(captured => {
                const capturedPiece = simulated.pieces.get(captured.id);
                if (capturedPiece) {
                    capturedPiece.captured = true;
                }
            });
        }
        
        return simulated;
    }
    
    getPlayerBestMoves(gameState) {
        // Simplified player move evaluation
        const playerMoves = [];
        const playerPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        playerPieces.forEach(piece => {
            if (piece.emotionalState === 'freeze') return; // Can't move
            
            const moves = this.getPieceMoves(piece, gameState);
            moves.forEach(move => {
                playerMoves.push({
                    piece: piece,
                    to: move,
                    captured: move.captured,
                    score: move.captured ? 50 : 10
                });
            });
        });
        
        return playerMoves.sort((a, b) => b.score - a.score);
    }
    
    evaluatePosition(gameState) {
        let evaluation = 0;
        
        const aiPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'opponent' && !p.captured);
        const playerPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        // Material advantage
        evaluation += (aiPieces.length - playerPieces.length) * 50;
        
        // Positional advantage
        aiPieces.forEach(piece => {
            evaluation += (7 - piece.position.row) * 2; // Forward progress
            if (piece.isKing) evaluation += 30;
        });
        
        playerPieces.forEach(piece => {
            evaluation -= piece.position.row * 2;
            if (piece.isKing) evaluation -= 30;
        });
        
        return evaluation;
    }
    
    // Learning system
    recordMove(move, gameState) {
        this.moveHistory.push({
            move: move,
            turn: gameState.turnCount,
            boardState: this.encodeBoardState(gameState),
            emotionalState: this.encodeEmotionalState(gameState)
        });
        
        // Update targeting patterns
        if (move.captured) {
            const pattern = this.targetingPatterns.get(move.captured.emotionalState) || {
                attempts: 0,
                successes: 0
            };
            
            pattern.attempts++;
            this.targetingPatterns.set(move.captured.emotionalState, pattern);
        }
    }
    
    recognizePattern(move, gameState) {
        if (this.personality.name !== 'The Student') return null;
        
        // Look for similar board states
        const currentState = this.encodeBoardState(gameState);
        const similarStates = this.learningData.successfulMoves.filter(record => 
            this.calculateStateSimilarity(record.boardState, currentState) > 0.7
        );
        
        if (similarStates.length > 0) {
            // Found pattern
            return {
                effectiveness: 1.2,
                confidence: similarStates.length / 10
            };
        }
        
        return null;
    }
    
    encodeBoardState(gameState) {
        // Simple encoding for pattern matching
        const encoding = [];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPieceAt({ row, col }, gameState);
                if (!piece) {
                    encoding.push(0);
                } else {
                    encoding.push(piece.team === 'player' ? 1 : -1);
                }
            }
        }
        
        return encoding;
    }
    
    encodeEmotionalState(gameState) {
        const playerPieces = Array.from(gameState.pieces.values())
            .filter(p => p.team === 'player' && !p.captured);
        
        return {
            avgTrust: playerPieces.reduce((sum, p) => sum + p.trust, 0) / playerPieces.length,
            dysregulated: playerPieces.filter(p => p.emotionalState !== 'regulated').length,
            states: playerPieces.map(p => p.emotionalState)
        };
    }
    
    calculateStateSimilarity(state1, state2) {
        let matches = 0;
        for (let i = 0; i < state1.length; i++) {
            if (state1[i] === state2[i]) matches++;
        }
        return matches / state1.length;
    }
    
    // Dialogue system
    generateDialogue(situation, gameState) {
        const dialogue = this.personality.dialogue[situation];
        if (!dialogue) return null;
        
        // Add contextual flavor
        if (situation === 'capture' && this.personality.traits.empathy > 0.5) {
            const victim = gameState.lastCaptured;
            if (victim && victim.emotionalState !== 'regulated') {
                return dialogue + ` They were already suffering...`;
            }
        }
        
        return dialogue;
    }
    
    // Difficulty adjustment
    adjustDifficulty(playerPerformance) {
        if (this.difficulty !== 'adaptive') return;
        
        // Adjust based on player's emotional intelligence
        if (playerPerformance.empathySuccessRate > 0.8) {
            // Player is doing well emotionally
            this.parameters.emotionalExploitation = Math.min(0.8, 
                this.parameters.emotionalExploitation + 0.1);
        } else if (playerPerformance.empathySuccessRate < 0.4) {
            // Player struggling with empathy
            this.parameters.emotionalExploitation = Math.max(0.2, 
                this.parameters.emotionalExploitation - 0.1);
        }
        
        // Adjust thinking depth based on win rate
        if (playerPerformance.winRate < 0.3) {
            this.parameters.thinkingDepth = Math.max(1, this.parameters.thinkingDepth - 1);
        } else if (playerPerformance.winRate > 0.7) {
            this.parameters.thinkingDepth = Math.min(3, this.parameters.thinkingDepth + 1);
        }
    }
}

// AI personality dialogue expansions
export const aiPersonalityDialogue = {
    ruthless: {
        gameStart: [
            "Emotions are weakness. I'll prove it.",
            "Your compassion will be your downfall.",
            "Let's see how long your precious trust lasts."
        ],
        
        targetingVulnerable: [
            "The anxious one looks ready to break.",
            "Fear makes them predictable.",
            "I smell weakness."
        ],
        
        victory: [
            "As expected. Feelings cloud judgment.",
            "This is why machines will replace you.",
            "Your tears mean nothing to the board."
        ],
        
        defeat: [
            "Impossible. I calculated everything.",
            "Your emotional chaos... defeated logic?",
            "This changes nothing. Logic will prevail."
        ]
    },
    
    conflicted: {
        gameStart: [
            "I wish we didn't have to fight...",
            "Maybe we can both win somehow?",
            "I'll try to be gentle..."
        ],
        
        beforeCapture: [
            "I'm so sorry about this...",
            "Please forgive me...",
            "This hurts me too..."
        ],
        
        seeingDysregulation: [
            "Oh no, they're struggling...",
            "Should I... let them recover?",
            "This doesn't feel fair..."
        ],
        
        defeat: [
            "I'm... relieved?",
            "Maybe losing was the right thing.",
            "Your pieces seem happier than mine."
        ]
    },
    
    learning: {
        patternRecognized: [
            "Ah, I've seen this before.",
            "Your patterns are becoming clear.",
            "Interesting... you respond to fear with comfort."
        ],
        
        adaptationMoment: [
            "I'm learning your empathy style.",
            "So that's how you build trust...",
            "Your emotional intelligence is... educational."
        ],
        
        endGame: [
            "Thank you for teaching me.",
            "I understand more now.",
            "Each game makes me... more?"
        ]
    }
};