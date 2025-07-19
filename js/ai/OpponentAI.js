// AI opponent with different coaching styles and emotional understanding
export class OpponentAI {
    constructor(gameState, style = 'learning') {
        this.gameState = gameState;
        this.style = style;
        this.memory = new Map(); // Remember piece behaviors
        this.empathyLevel = this.getStyleEmpathyLevel(style);
        this.moveHistory = [];
        
        this.setupStyleParameters();
    }

    getStyleEmpathyLevel(style) {
        const levels = {
            'harsh': 0.1,      // "Just move! Stop being weak!"
            'confused': 0.3,   // "I... don't understand feelings"
            'learning': 0.5,   // "I'm trying to understand"
            'supportive': 0.7, // "Tell me how you feel"
            'enlightened': 0.9 // "I see your pain"
        };
        return levels[style] || 0.5;
    }

    setupStyleParameters() {
        const styles = {
            harsh: {
                name: "Commander Steele",
                personality: "demanding",
                catchphrase: "Emotions are weakness!",
                preferredMoves: ['aggressive', 'sacrificial'],
                empathyResponses: {
                    anxious: ["Stop worrying!", "Just do it!", "No time for fear!"],
                    shutdown: ["Snap out of it!", "I need you to move!", "Wake up!"],
                    fight: ["Good! Use that anger!", "Finally some spirit!", "Attack!"]
                },
                trustModifier: -2
            },
            
            confused: {
                name: "Dr. Logic",
                personality: "analytical",
                catchphrase: "But... why do they feel?",
                preferredMoves: ['optimal', 'calculated'],
                empathyResponses: {
                    anxious: ["Computing... error?", "Why are you shaking?", "Is this... fear?"],
                    shutdown: ["Response timeout", "Are you broken?", "Reboot required?"],
                    fight: ["Aggression detected", "Fascinating reaction", "Emotional spike noted"]
                },
                trustModifier: -1
            },
            
            learning: {
                name: "Coach Pat",
                personality: "curious",
                catchphrase: "I'm learning with you",
                preferredMoves: ['balanced', 'adaptive'],
                empathyResponses: {
                    anxious: ["Take your time", "What scares you?", "We'll work through this"],
                    shutdown: ["I'm here when ready", "No pressure", "Rest if you need"],
                    fight: ["I hear your anger", "What hurt you?", "Let's channel this"]
                },
                trustModifier: 0
            },
            
            supportive: {
                name: "Mentor Grace",
                personality: "nurturing",
                catchphrase: "Your feelings matter",
                preferredMoves: ['protective', 'careful'],
                empathyResponses: {
                    anxious: ["Breathe with me", "You're safe here", "One step at a time"],
                    shutdown: ["I'll wait with you", "No rush", "You're not alone"],
                    fight: ["Your anger is valid", "I understand", "Let's talk about it"]
                },
                trustModifier: 1
            },
            
            enlightened: {
                name: "Sage Luna",
                personality: "transcendent",
                catchphrase: "All emotions are teachers",
                preferredMoves: ['harmonious', 'mindful'],
                empathyResponses: {
                    anxious: ["Fear teaches caution", "Honor this feeling", "Wisdom in worry"],
                    shutdown: ["Sacred silence", "Inward journey", "Rest is resistance"],
                    fight: ["Fire of transformation", "Anger as fuel", "Power in passion"]
                },
                trustModifier: 2
            }
        };
        
        this.styleData = styles[this.style] || styles.learning;
    }

    selectMove() {
        // Get all possible moves for AI pieces
        const aiPieces = Array.from(this.gameState.pieces.values())
            .filter(p => p.team === 'opponent' && !p.captured);
        
        const allMoves = [];
        
        aiPieces.forEach(piece => {
            const moves = this.gameState.board.getPossibleMoves(piece);
            moves.forEach(move => {
                allMoves.push({
                    piece: piece,
                    target: move.position,
                    moveData: move,
                    score: this.evaluateMove(piece, move)
                });
            });
        });
        
        if (allMoves.length === 0) return null;
        
        // Sort by score
        allMoves.sort((a, b) => b.score - a.score);
        
        // Add some randomness based on style
        const randomFactor = this.style === 'confused' ? 0.5 : 0.2;
        const selectedIndex = Math.floor(Math.random() * randomFactor * allMoves.length);
        const selectedMove = allMoves[selectedIndex];
        
        // Check if piece needs empathy
        let empathyUsed = null;
        if (selectedMove.piece.emotionalState === 'dysregulated') {
            empathyUsed = this.attemptEmpathy(selectedMove.piece);
        }
        
        // Record move in history
        this.moveHistory.push({
            turn: this.gameState.turn,
            piece: selectedMove.piece.id,
            move: selectedMove,
            empathyUsed: empathyUsed
        });
        
        return {
            piece: selectedMove.piece,
            target: selectedMove.target,
            empathyUsed: empathyUsed
        };
    }

    evaluateMove(piece, move) {
        let score = 0;
        
        // Base scoring
        if (move.type === 'capture' || move.type === 'multi_capture') {
            score += 10 * move.captures.length;
        }
        
        // Position scoring (prefer center and forward movement)
        const targetRow = move.position.row;
        const targetCol = move.position.col;
        const centerDistance = Math.abs(3.5 - targetRow) + Math.abs(3.5 - targetCol);
        score += (7 - centerDistance);
        
        // Forward progress
        if (piece.team === 'opponent' && targetRow < piece.position.row) {
            score += 3;
        }
        
        // Style-based modifiers
        score = this.applyStyleModifiers(piece, move, score);
        
        // Emotional state considerations
        score = this.applyEmotionalModifiers(piece, move, score);
        
        // Memory-based adjustments
        score = this.applyMemoryModifiers(piece, move, score);
        
        return score;
    }

    applyStyleModifiers(piece, move, baseScore) {
        let score = baseScore;
        
        switch(this.style) {
            case 'harsh':
                // Prioritize aggression
                if (move.type === 'capture') score *= 1.5;
                // Don't care about piece wellbeing
                if (piece.trust < 0) score *= 0.9; // Slight penalty for rebellion
                break;
                
            case 'confused':
                // Random preferences
                score *= (0.5 + Math.random());
                // Confused by emotional pieces
                if (piece.emotionalState !== 'regulated') score *= 0.7;
                break;
                
            case 'learning':
                // Balanced approach
                if (piece.trust > 5) score *= 1.2;
                // Avoid traumatizing pieces
                if (this.wouldCauseTrauma(piece, move)) score *= 0.5;
                break;
                
            case 'supportive':
                // Protective of pieces
                if (this.isSafeMove(piece, move)) score *= 1.3;
                // Avoid captures if piece is fragile
                if (piece.emotionalState === 'anxious' && move.type === 'capture') {
                    score *= 0.4;
                }
                break;
                
            case 'enlightened':
                // Harmony-focused
                if (this.createsBalance(move)) score *= 1.5;
                // Values emotional growth
                if (piece.memories.some(m => m.type === 'breakthrough')) {
                    score *= 1.4;
                }
                break;
        }
        
        return score;
    }

    applyEmotionalModifiers(piece, move, baseScore) {
        let score = baseScore;
        
        // Dysregulated pieces are less reliable
        if (piece.emotionalState === 'dysregulated') {
            switch(piece.dysregulationType) {
                case 'frozen':
                    score *= 0.1; // Almost can't move
                    break;
                case 'anxious':
                    score *= 0.6; // Hesitant
                    break;
                case 'fight':
                    if (move.type === 'capture') {
                        score *= 1.3; // More aggressive
                    }
                    break;
                case 'flight':
                    if (this.isRetreatMove(piece, move)) {
                        score *= 1.4; // Wants to flee
                    }
                    break;
                case 'fawn':
                    score *= 0.8; // Unpredictable
                    break;
            }
        }
        
        // High trust pieces perform better
        if (piece.trust >= 7) {
            score *= 1.3;
        } else if (piece.trust <= -3) {
            score *= 0.5; // Might not cooperate
        }
        
        return score;
    }

    applyMemoryModifiers(piece, move, baseScore) {
        let score = baseScore;
        
        // Check piece memories
        const pieceMemory = this.memory.get(piece.id) || { failures: 0, successes: 0 };
        
        // Learn from past
        if (pieceMemory.failures > 2) {
            // This piece has struggled, be more careful
            if (this.empathyLevel > 0.5) {
                score *= 0.8;
            }
        }
        
        if (pieceMemory.successes > 3) {
            // This piece is reliable
            score *= 1.2;
        }
        
        return score;
    }

    attemptEmpathy(piece) {
        // AI attempts empathy based on style
        const responses = this.styleData.empathyResponses[piece.dysregulationType];
        if (!responses) return 'confused';
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        // Calculate success based on empathy level
        const successChance = this.empathyLevel;
        const isSuccessful = Math.random() < successChance;
        
        // Apply trust changes
        if (isSuccessful) {
            piece.modifyTrust(1 + this.styleData.trustModifier);
            
            // Might regulate piece
            if (Math.random() < this.empathyLevel * 0.5) {
                piece.setEmotionalState('regulated');
            }
        } else {
            piece.modifyTrust(-1 + this.styleData.trustModifier);
            
            // Might worsen state
            if (this.style === 'harsh' && Math.random() < 0.3) {
                this.worsenEmotionalState(piece);
            }
        }
        
        // Update memory
        const memory = this.memory.get(piece.id) || { failures: 0, successes: 0 };
        if (isSuccessful) {
            memory.successes++;
        } else {
            memory.failures++;
        }
        this.memory.set(piece.id, memory);
        
        return this.style; // Return style for UI display
    }

    wouldCauseTrauma(piece, move) {
        if (move.type !== 'capture') return false;
        
        // Check if capturing a friend
        const targets = move.captures;
        for (const target of targets) {
            const relationship = piece.getRelationship(target.id);
            if (relationship > 3) return true; // Friend
        }
        
        // Check if piece is pacifist
        if (piece.personality.pacifist) return true;
        
        return false;
    }

    isSafeMove(piece, move) {
        const targetPos = move.position;
        
        // Check if moving into danger
        const enemyPieces = this.gameState.board.getAdjacentPieces(targetPos)
            .filter(p => p.team !== piece.team);
        
        if (enemyPieces.length > 1) return false;
        
        // Check if position is emotionally safe
        if (this.gameState.board.isSquareSanctuary(targetPos)) {
            return true;
        }
        
        return enemyPieces.length === 0;
    }

    isRetreatMove(piece, move) {
        const currentRow = piece.position.row;
        const targetRow = move.position.row;
        
        // Retreating means moving backward
        return piece.team === 'opponent' ? 
            targetRow > currentRow : 
            targetRow < currentRow;
    }

    createsBalance(move) {
        // Enlightened AI seeks board balance
        const targetPos = move.position;
        
        // Center positions create balance
        const centerDistance = Math.abs(3.5 - targetPos.row) + Math.abs(3.5 - targetPos.col);
        if (centerDistance < 3) return true;
        
        // Moving dysregulated pieces to safe spaces
        if (move.piece.emotionalState === 'dysregulated' && 
            this.gameState.board.isSquareSanctuary(targetPos)) {
            return true;
        }
        
        return false;
    }

    worsenEmotionalState(piece) {
        const worseStates = {
            'anxious': 'frozen',
            'shutdown': 'frozen',
            'fight': 'shutdown',
            'fawn': 'anxious'
        };
        
        const newState = worseStates[piece.dysregulationType];
        if (newState) {
            piece.setEmotionalState('dysregulated', newState);
        }
    }

    // Special behaviors for story moments
    handleEmotionalStorm() {
        // Different styles react differently to storms
        switch(this.style) {
            case 'harsh':
                // Pushes pieces harder
                return "Push through it! No excuses!";
                
            case 'confused':
                // Doesn't understand
                return "Error... emotional overflow detected?";
                
            case 'learning':
                // Tries to help
                return "Everyone stay calm, we'll weather this together";
                
            case 'supportive':
                // Protective mode
                return "Find your safe spaces, I'm here";
                
            case 'enlightened':
                // Sees opportunity
                return "The storm brings transformation";
        }
    }

    getPersonalityDialogue(situation) {
        const dialogues = {
            match_start: {
                harsh: "Feelings make you weak. Prove me wrong.",
                confused: "I've been studying emotions. Still don't compute.",
                learning: "Let's learn together today.",
                supportive: "How is everyone feeling? We'll go at your pace.",
                enlightened: "Every emotion holds wisdom. Show me yours."
            },
            
            piece_dysregulated: {
                harsh: "Stop wasting time with feelings!",
                confused: "Is it malfunctioning? Should we restart?",
                learning: "I see you're struggling. What do you need?",
                supportive: "Take all the time you need, dear.",
                enlightened: "This suffering is a teacher. Listen."
            },
            
            player_empathy_success: {
                harsh: "Coddling them won't win games.",
                confused: "Interesting... kindness affected performance.",
                learning: "That was beautiful. I'm taking notes.",
                supportive: "Yes! That's how we help each other.",
                enlightened: "You speak the language of the heart."
            },
            
            match_end_win: {
                harsh: "You won despite your softness. Interesting.",
                confused: "Victory achieved. Emotional parameters... helpful?",
                learning: "We both learned something today.",
                supportive: "You led with love. That's the real victory.",
                enlightened: "The board is just practice. You won their trust."
            },
            
            match_end_loss: {
                harsh: "Emotions made you lose. As expected.",
                confused: "Loss recorded. Correlation with empathy unclear.",
                learning: "Losing teaches too. Your pieces still trust you.",
                supportive: "You chose compassion over victory. I respect that.",
                enlightened: "There are no losses when hearts connect."
            }
        };
        
        return dialogues[situation]?.[this.style] || "...";
    }

    // Learning system
    learn(outcome) {
        // AI learns from match outcomes
        if (this.style !== 'learning') return;
        
        // Analyze what worked
        const successfulMoves = this.moveHistory.filter(m => {
            const piece = this.gameState.pieces.get(m.piece);
            return piece && piece.trust > m.initialTrust;
        });
        
        // Adjust empathy level based on success
        if (successfulMoves.length > this.moveHistory.length / 2) {
            this.empathyLevel = Math.min(0.9, this.empathyLevel + 0.1);
        }
        
        // Store learning for next match
        const learning = {
            matchOutcome: outcome,
            empathySuccess: successfulMoves.length / this.moveHistory.length,
            averageTrust: this.calculateAverageTrust(),
            lessonsLearned: this.extractLessons()
        };
        
        return learning;
    }

    calculateAverageTrust() {
        const aiPieces = Array.from(this.gameState.pieces.values())
            .filter(p => p.team === 'opponent');
        
        const totalTrust = aiPieces.reduce((sum, p) => sum + p.trust, 0);
        return totalTrust / aiPieces.length;
    }

    extractLessons() {
        const lessons = [];
        
        // Check for patterns in failed empathy
        const failedEmpathy = this.moveHistory.filter(m => 
            m.empathyUsed && this.memory.get(m.piece)?.failures > 0
        );
        
        if (failedEmpathy.length > 3) {
            lessons.push("Need to better understand dysregulation");
        }
        
        // Check for successful patterns
        const successPatterns = this.moveHistory.filter(m =>
            m.empathyUsed && this.memory.get(m.piece)?.successes > 2
        );
        
        if (successPatterns.length > 0) {
            lessons.push("Consistency in empathy builds trust");
        }
        
        return lessons;
    }
}