// Main entry point for Chesstropia
import { GameState } from './game/GameState.js';
import { BoardRenderer } from './ui/BoardRenderer.js';
import { EmpathyInterface } from './ui/EmpathyInterface.js';
import { EmotionalHUD } from './ui/EmotionalHUD.js';
import { TurnManager } from './game/TurnManager.js';
import { CampaignManager } from './campaigns/CampaignManager.js';
import { SaveManager } from './game/SaveManager.js';
import { audioManager } from './utils/audioManager.js';
import { colorThemes } from './utils/colorThemes.js';

// Global game instance
let game = null;
let renderer = null;
let empathyUI = null;
let emotionalHUD = null;
let turnManager = null;
let campaignManager = null;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);

function init() {
    // Check if we're on the game page
    if (!document.getElementById('game-board')) {
        return; // We're on the landing page
    }

    // Load saved theme preference
    const savedTheme = localStorage.getItem('chesstropia_theme') || 'green';
    document.body.setAttribute('data-theme', savedTheme);
    updatePhosphorIndicator(savedTheme);

    // Check for existing save
    const existingSave = SaveManager.load();
    
    if (existingSave) {
        showContinuePrompt(existingSave);
    } else {
        showTeamSelection();
    }

    // Set up event listeners
    setupEventListeners();
}

function showContinuePrompt(saveData) {
    const modal = document.getElementById('event-modal');
    const text = document.getElementById('event-text');
    const options = document.getElementById('event-options');

    text.innerHTML = `
╔═══════════════════════════════════════════════════╗
║ SAVE_DETECTED.DAT                                 ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║ Found existing campaign:                          ║
║ Team: ${saveData.currentTeam}                    ║
║ Match: ${saveData.currentMatch}/10               ║
║ Last played: ${new Date(saveData.timestamp).toLocaleDateString()} ║
║                                                   ║
║ Continue where you left off?                      ║
║                                                   ║
╚═══════════════════════════════════════════════════╝`;

    options.innerHTML = `
        <button class="empathy-button" onclick="continueGame()">CONTINUE</button>
        <button class="empathy-button" onclick="newGame()">NEW GAME</button>
    `;

    modal.classList.remove('hidden');
}

function showTeamSelection() {
    const modal = document.getElementById('event-modal');
    const text = document.getElementById('event-text');
    const options = document.getElementById('event-options');

    text.innerHTML = `
╔═══════════════════════════════════════════════════╗
║ SELECT_YOUR_TEAM.EXE                             ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║ Choose your first team:                           ║
║                                                   ║
║ Each team has unique emotional needs.             ║
║ Listen. Learn. Lead with empathy.                 ║
║                                                   ║
╚═══════════════════════════════════════════════════╝`;

    options.innerHTML = `
        <button class="team-select-btn" data-team="donuts">
            <span class="team-icon">🍩</span>
            <span class="team-name">THE DONUTS</span>
            <span class="team-desc">Orphaned pastries seeking belonging</span>
        </button>
        <button class="team-select-btn" data-team="renaissance">
            <span class="team-icon">🐱</span>
            <span class="team-name">RENAISSANCE PETS</span>
            <span class="team-desc">Perfect facades hiding deep wounds</span>
        </button>
        <button class="team-select-btn" data-team="baseballerinas">
            <span class="team-icon">⚾</span>
            <span class="team-name">BASEBALLERINAS</span>
            <span class="team-desc">Athletes + artists = identity crisis</span>
        </button>
    `;

    // Add click handlers
    document.querySelectorAll('.team-select-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const team = e.currentTarget.getAttribute('data-team');
            startNewCampaign(team);
        });
    });

    modal.classList.remove('hidden');
}

async function startNewCampaign(teamId) {
    // Hide modal
    document.getElementById('event-modal').classList.add('hidden');

    // Initialize game systems
    game = new GameState();
    campaignManager = new CampaignManager(teamId);
    
    // Load first match
    const matchData = campaignManager.loadMatch(1);
    await game.initializeMatch(matchData);

    // Initialize renderers
    renderer = new BoardRenderer('game-board');
    empathyUI = new EmpathyInterface('command-options');
    emotionalHUD = new EmotionalHUD();
    
    // Initialize turn manager
    turnManager = new TurnManager(game, renderer, empathyUI);

    // Start tutorial if first time
    if (!localStorage.getItem('chesstropia_tutorial_complete')) {
        await showTutorial();
    }

    // Render initial state
    renderer.render(game.board);
    emotionalHUD.update(game);
    
    // Show opening narration
    showMatchIntro(matchData);
}

async function showTutorial() {
    const steps = [
        {
            text: "Welcome to Chesstropia.\nYour pieces aren't just game tokens.\nThey have feelings, fears, and dreams.",
            highlight: null
        },
        {
            text: "See that '●!' symbol?\nThat's Sprinkles. She's anxious.\nShe might not move unless you help her.",
            highlight: 'piece-anxious'
        },
        {
            text: "When selecting a dysregulated piece,\nyou'll see empathy options.\nChoose wisely - they remember.",
            highlight: 'empathy-commands'
        },
        {
            text: "Wrong responses damage trust.\nLose too much trust?\nPieces might walk off the board.",
            highlight: 'morale-bar'
        },
        {
            text: "This isn't about winning.\nIt's about understanding.\nGood luck, coach.",
            highlight: null
        }
    ];

    for (const step of steps) {
        await showTutorialStep(step);
    }

    localStorage.setItem('chesstropia_tutorial_complete', 'true');
}

function showTutorialStep(step) {
    return new Promise((resolve) => {
        const modal = document.getElementById('event-modal');
        const text = document.getElementById('event-text');
        const options = document.getElementById('event-options');

        text.textContent = step.text;
        options.innerHTML = '<button class="empathy-button" onclick="resolve()">CONTINUE</button>';

        if (step.highlight) {
            document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
            document.querySelector(`.${step.highlight}`)?.classList.add('highlight');
        }

        modal.classList.remove('hidden');
        
        // Store resolve function globally for button onclick
        window.resolve = () => {
            modal.classList.add('hidden');
            resolve();
        };
    });
}

function showMatchIntro(matchData) {
    const modal = document.getElementById('event-modal');
    const text = document.getElementById('event-text');
    const options = document.getElementById('event-options');

    text.innerHTML = `
╔═══════════════════════════════════════════════════╗
║ MATCH ${matchData.match}: ${matchData.title}     ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║ ${matchData.description || 'Your pieces need you.'}
║                                                   ║
║ Dysregulated pieces: ${matchData.dysregulatedCount}
║ Objective: ${matchData.objective}              
║                                                   ║
╚═══════════════════════════════════════════════════╝`;

    options.innerHTML = '<button class="empathy-button" onclick="startMatch()">BEGIN</button>';
    modal.classList.remove('hidden');
}

function startMatch() {
    document.getElementById('event-modal').classList.add('hidden');
    turnManager.startPlayerTurn();
}

function setupEventListeners() {
    // Board clicks
    document.getElementById('game-board')?.addEventListener('click', handleBoardClick);
    
    // Save game on page unload
    window.addEventListener('beforeunload', () => {
        if (game && campaignManager) {
            SaveManager.save({
                currentTeam: campaignManager.team,
                currentMatch: campaignManager.currentMatch,
                gameState: game.serialize(),
                campaignProgress: campaignManager.serialize()
            });
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('event-modal').classList.add('hidden');
        }
    });
}

function handleBoardClick(e) {
    if (!turnManager || !turnManager.isPlayerTurn) return;

    // Get clicked position from ASCII board
    const position = renderer.getPositionFromClick(e);
    if (!position) return;

    // Handle click based on current state
    turnManager.handleSquareClick(position);
}

function updatePhosphorIndicator(theme) {
    const indicator = document.getElementById('current-phosphor');
    if (indicator) {
        indicator.textContent = theme.toUpperCase();
    }
}

// Global functions for button onclick handlers
window.continueGame = async function() {
    const saveData = SaveManager.load();
    game = new GameState();
    await game.deserialize(saveData.gameState);
    
    campaignManager = new CampaignManager(saveData.currentTeam);
    campaignManager.deserialize(saveData.campaignProgress);
    
    // Initialize UI
    renderer = new BoardRenderer('game-board');
    empathyUI = new EmpathyInterface('command-options');
    emotionalHUD = new EmotionalHUD();
    turnManager = new TurnManager(game, renderer, empathyUI);
    
    // Hide modal and start
    document.getElementById('event-modal').classList.add('hidden');
    renderer.render(game.board);
    emotionalHUD.update(game);
    turnManager.startPlayerTurn();
};

window.newGame = function() {
    SaveManager.clear();
    showTeamSelection();
};

window.startMatch = startMatch;

// Export for debugging
window.chesstropia = {
    game,
    renderer,
    turnManager,
    campaignManager
};