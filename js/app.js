/**
 * @file app.js
 * The main application controller. It manages different views (MainMenu, Game, Options)
 * and orchestrates the overall application flow.
 */
import { EventEmitter } from './utils/EventEmitter.js';
import SaveManager from './utils/SaveManager.js';
import MainMenu from './ui/MainMenu.js';
import TeamSelector from './ui/TeamSelector.js';
import GameController from './game/GameController.js';
import BoardRenderer from './ui/BoardRenderer.js';
import EmotionalHUD from './ui/EmotionalHUD.js';
import EmpathyInterface from './ui/EmpathyInterface.js';
import StormAnnouncer from './ui/StormAnnouncer.js';
import CampaignManager from './campaigns/CampaignManager.js';
import DialogueSystem from './ui/DialogueSystem.js';

class App {
    constructor(container) {
        this.appContainer = container; // The main #app div
        this.eventEmitter = new EventEmitter();
        this.saveManager = new SaveManager();
        
        // UI Components
        this.mainMenu = new MainMenu(this.eventEmitter);
        this.teamSelector = new TeamSelector(this.eventEmitter);
        this.dialogueSystem = new DialogueSystem(this.eventEmitter);

        // Game Logic
        this.gameController = null;
        this.campaignManager = new CampaignManager(this.eventEmitter);
        this.isCampaignActive = false;

        this.bindEvents();
    }

    bindEvents() {
        this.eventEmitter.on('showMainMenu', this.showMainMenu.bind(this));
        this.eventEmitter.on('selectTeam', this.showTeamSelector.bind(this));
        this.eventEmitter.on('newGame', this.startNewGame.bind(this));
        this.eventEmitter.on('loadGame', this.handleLoadGame.bind(this));
        this.eventEmitter.on('saveGame', this.handleSaveGame.bind(this));
        this.eventEmitter.on('gameOver', this.handleGameOver.bind(this));
        this.eventEmitter.on('startCampaign', this.handleStartCampaign.bind(this));
        this.eventEmitter.on('startCampaignGame', this.startCampaignGame.bind(this));
        this.eventEmitter.on('showDialogue', this.handleShowDialogue.bind(this));
    }

    start() {
        console.log('ChessTropia application started.');
        this.showMainMenu();
    }

    clearContainer() {
        this.appContainer.innerHTML = '';
        // Always ensure the dialogue container is removed when clearing
        const oldDialogue = document.getElementById('dialogue-container');
        if (oldDialogue) oldDialogue.remove();
    }
    
    showMainMenu() {
        this.isCampaignActive = false;
        this.clearContainer();
        const hasSave = this.saveManager.hasSaveGame();
        // The main menu now renders directly into the app container
        this.mainMenu.render(this.appContainer, hasSave);
    }

    showTeamSelector() {
        this.clearContainer();
        this.teamSelector.render(this.appContainer);
    }
    
    showGameScreen() {
        this.clearContainer();
        this.appContainer.innerHTML = `
            <div class="game-screen">
                <div id="board-container"></div>
                <div id="side-panel">
                    <div id="hud-container"></div>
                    <div id="empathy-container"></div>
                    <div id="game-actions-container"></div>
                </div>
            </div>
        `;

        // Instantiate game-specific UI components
        const boardContainer = document.getElementById('board-container');
        const hudContainer = document.getElementById('hud-container');
        const empathyContainer = document.getElementById('empathy-container');
        const stormContainer = document.getElementById('storm-announcer-container');
        
        new BoardRenderer(boardContainer, this.eventEmitter);
        new EmotionalHUD(hudContainer, this.eventEmitter);
        new EmpathyInterface(empathyContainer, this.eventEmitter);
        new StormAnnouncer(stormContainer, this.eventEmitter);

        if (!this.isCampaignActive) {
            const gameActionsContainer = document.getElementById('game-actions-container');
            const saveButton = document.createElement('button');
            saveButton.id = 'save-game-btn';
            saveButton.className = 'menu-button';
            saveButton.textContent = 'Save & Quit';
            gameActionsContainer.appendChild(saveButton);
            saveButton.addEventListener('click', () => this.eventEmitter.emit('saveGame'));
        }
    }

    startNewGame(options = {}) {
        this.isCampaignActive = false;
        this.showGameScreen();
        
        this.gameController = new GameController(this.eventEmitter);
        this.gameController.startGame(options.playerTeamId, options.opponentTeamId, options.aiType);
    }
    
    startCampaignGame(gameConfig) {
        this.showGameScreen();
        
        this.gameController = new GameController(this.eventEmitter);
        this.gameController.startGame(gameConfig.playerTeamId, gameConfig.opponentTeamId, gameConfig.aiType);
    }
    
    handleStartCampaign() {
        this.isCampaignActive = true;
        this.campaignManager.startCampaign(); // This will emit a 'showDialogue' event
    }

    handleShowDialogue({ dialogue, onComplete }) {
        // Dialogue is now handled as an overlay on top of the #app container
        this.dialogueSystem.show(this.appContainer, dialogue, onComplete);
    }

    handleLoadGame() {
        const savedState = this.saveManager.loadGame();
        if (savedState) {
            this.isCampaignActive = false;
            this.showGameScreen();
            this.gameController = new GameController(this.eventEmitter);
            this.gameController.loadFromState(savedState);
        } else {
            this.showMainMenu();
        }
    }

    handleSaveGame() {
        if (this.gameController && !this.isCampaignActive) {
            const state = this.gameController.getSaveState();
            if (this.saveManager.saveGame(state)) {
                this.gameController = null;
                this.showMainMenu();
            }
        }
    }

    handleGameOver(result) {
        if (this.isCampaignActive && result.winner === 'player') {
            this.campaignManager.handleMissionComplete();
        } else if (this.isCampaignActive && result.winner !== 'player') {
            this.eventEmitter.emit('showDialogue', {
                dialogue: [{ character: 'Coach', text: 'That didn\'t go as planned. Let\'s try that again.' }],
                onComplete: () => this.handleStartCampaign()
            });
        } else {
            this.saveManager.deleteSave();
            setTimeout(() => {
                alert(`Game Over! The winner is: ${result.winner}`);
                this.showMainMenu();
            }, 100);
        }
    }
}

export default App;
