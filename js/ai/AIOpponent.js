/**
 * @file AIOpponent.js
 * Manages the AI's decision-making process. It analyzes the board state
 * and chooses the best move based on its designated personality type.
 */
class AIOpponent {
    /**
     * Initializes the AI Opponent.
     * @param {string} aiType - The personality of the AI (e.g., 'TheStrategist', 'TheRuthless').
     * @param {EventEmitter} eventEmitter - The central event bus.
     */
    constructor(aiType, eventEmitter) {
        this.aiType = aiType;
        this.eventEmitter = eventEmitter;
    }

    /**
     * The main AI decision-making function. It evaluates the board and chooses a move.
     * @param {Board} board - The current game board instance.
     * @param {object} team - The AI's team data.
     * @returns {{piece: Piece, move: object}|null} The chosen move, or null if no moves are possible.
     */
    chooseMove(board, team) {
        // The GameController should pass the actual board object for the AI to analyze.
        // This allows the AI to use the board's own methods for move calculation.

        let allPossibleMoves = [];
        const myPieces = board.getPlayerPieces('opponent');

        // Gather all valid moves for every one of the AI's pieces.
        for (const piece of myPieces) {
            // The getValidMoves method correctly handles forced captures.
            const moves = board.getValidMoves(piece);
            for (const move of moves) {
                allPossibleMoves.push({ piece, move });
            }
        }

        if (allPossibleMoves.length === 0) {
            return null; // No moves available, the game should end.
        }

        // The getValidMoves function already prioritizes captures, so we don't need to
        // check for captures separately here. If a capture is available, it will be the ONLY
        // type of move returned by getValidMoves.

        // For the basic "Strategist" AI, we'll just pick a random valid move from the list.
        // More complex AI types would have more sophisticated selection logic here.
        const chosenMove = allPossibleMoves[Math.floor(Math.random() * allPossibleMoves.length)];

        console.log(`AI (${this.aiType}) chose to move ${chosenMove.piece.name} from`,
            chosenMove.move.from, 'to', chosenMove.move.to
        );

        return chosenMove;
    }

    // --- Future AI Strategy Implementations ---

    /**
     * A strategy for "TheRuthless" AI, which would prioritize moves that
     * target the player's emotionally vulnerable pieces. (Not yet implemented)
     */
    chooseMoveRuthless(board, team) {
        // 1. Find all valid moves.
        // 2. Score each move based on a "ruthlessness" metric:
        //    - High score for capturing a piece.
        //    - Higher score for capturing a piece with low trust or a dysregulated state.
        //    - Score for moving into a position that threatens multiple pieces.
        // 3. Choose the highest-scoring move.
    }

    /**
     * A strategy for "TheConflicted" AI, which might avoid making captures
     * if possible, reflecting a reluctance to cause harm. (Not yet implemented)
     */
    chooseMoveConflicted(board, team) {
        // 1. Find all valid moves.
        // 2. If there are non-capture moves, strongly prefer one of them.
        // 3. If a capture is forced, choose the one that captures the "strongest"
        //    (e.g., highest trust) player piece, as a form of "mercy".
    }
}

export default AIOpponent;
