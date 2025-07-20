/**
 * @file app.js
 * The main application controller. It manages different views (MainMenu, Game, Options)
 * and orchestrates the overall application flow.
 */
import EventEmitter from './utils/EventEmitter.js';
import SaveManager from './utils/SaveManager.js';
import MainMenu from './ui/MainMenu.js';
import TeamSelector from './ui/TeamSelector.js';
import GameController from './game/GameController.js';
import BoardRenderer from './ui/BoardRenderer.js';
import EmotionalHUD from './ui/EmotionalHUD.js';
import EmpathyInterface from './ui/EmpathyInterface.js';
import StormAnnouncer from './ui/StormAnnouncer.js';

class App {
    /**
     * Initializes the main application.
     * @param {HTMLElement} container - The main container element to render content into.
     */
    constructor(container) {
        this.container = container;
        this.eventEmitter = new EventEmitter();
        this.saveManager = new SaveManager();
        
        // UI Components
        this.mainMenu = new MainMenu(this.eventEmitter);
        this.teamSelector = null;
        this.boardRenderer = null;
        this.emotionalHUD = null;
        this.empathyInterface = null;
        this.stormAnnouncer = null;

        // Game Logic
        this.gameController = null;

        this.bindEvents();
    }

    /**
     * Binds to custom events to orchestrate the application flow.
     */
    bindEvents() {
        this.eventEmitter.on('selectTeam', this.showTeamSelector.bind(this));
        this.eventEmitter.on('newGame', this.startNewGame.bind(this));
        this.eventEmitter.on('loadGame', this.handleLoadGame.bind(this));
        this.eventEmitter.on('saveGame', this.handleSaveGame.bind(this));
        this.eventEmitter.on('gameOver', this.handleGameOver.bind(this));
    }

    /**
     * Kicks off the entire application by showing the main menu.
     */
    start() {
        console.log('ChessTropia application started.');
        this.showMainMenu();
    }

    /**
     * Clears the container and renders the main menu.
     */
    showMainMenu() {
        this.container.innerHTML = '';
        const hasSave = this.saveManager.hasSaveGame();
        this.mainMenu.render(this.container, hasSave);
    }

    /**
     * Renders the team selection screen.
     */
    showTeamSelector() {
        this.container.innerHTML = '';
        this.teamSelector = new TeamSelector(this.eventEmitter);
        this.teamSelector.render(this.container);
    }

    /**
     * Sets up the shared UI components for any game session (new or loaded).
     */
    setupGameUI() {
        this.container.innerHTML = ''; // Clear the container for the game view

        const gameScreen = document.createElement('div');
        gameScreen.className = 'game-screen';

        const boardContainer = document.createElement('div');
        boardContainer.id = 'board-container';

        const sidePanel = document.createElement('div');
        sidePanel.id = 'side-panel';

        const hudContainer = document.createElement('div');
        hudContainer.id = 'hud-container';

        const empathyContainer = document.createElement('div');
        empathyContainer.id = 'empathy-container';

        // Add a container for in-game buttons like Save
        const gameActionsContainer = document.createElement('div');
        gameActionsContainer.id = 'game-actions-container';
        
        sidePanel.appendChild(hudContainer);
        sidePanel.appendChild(empathyContainer);
        sidePanel.appendChild(gameActionsContainer); // Add actions container
        gameScreen.appendChild(boardContainer);
        gameScreen.appendChild(sidePanel);
        this.container.appendChild(gameScreen);

        // Instantiate UI components
        this.boardRenderer = new BoardRenderer(boardContainer, this.eventEmitter);
        this.emotionalHUD = new EmotionalHUD(hudContainer, this.eventEmitter);
        this.empathyInterface = new EmpathyInterface(empathyContainer, this.eventEmitter);
        
        const stormContainer = document.getElementById('storm-announcer-container');
        this.stormAnnouncer = new StormAnnouncer(stormContainer, this.eventEmitter);

        // Add a Save Game button
        const saveButton = document.createElement('button');
        saveButton.id = 'save-game-btn';
        saveButton.className = 'menu-button';
        saveButton.textContent = 'Save & Quit';
        gameActionsContainer.appendChild(saveButton);
        saveButton.addEventListener('click', () => this.eventEmitter.emit('saveGame'));
    }

    /**
     * Starts a new game session from the team selector.
     */
    startNewGame(options = {}) {
        console.log('Setting up new game with options:', options);
        this.setupGameUI();
        
        this.gameController = new GameController(this.eventEmitter);
        
        const playerTeam = options.playerTeamId || 'donuts';
        const opponentTeam = options.opponentTeamId || 'renaissance_pets';
        const aiType = options.aiType || 'TheStrategist';

        this.gameController.startGame(playerTeam, opponentTeam, aiType);
    }

    /**
     * Loads a game from a saved state.
     */
    handleLoadGame() {
        const savedState = this.saveManager.loadGame();
        if (savedState) {
            console.log('Loading game from save file...');
            this.setupGameUI();
            this.gameController = new GameController(this.eventEmitter);
            this.gameController.loadFromState(savedState);
        } else {
            console.error("Could not load game, no save file found.");
            this.showMainMenu();
        }
    }

    /**
     * Saves the current game state and returns to the main menu.
     */
    handleSaveGame() {
        if (this.gameController) {
            const state = this.gameController.getSaveState();
            if (this.saveManager.saveGame(state)) {
                alert("Game Saved!"); // Replace with a better notification later
                this.gameController = null; // End the current game session
                this.showMainMenu();
            } else {
                alert("Failed to save game. Storage might be full.");
            }
        }
    }

    /**
     * Handles the end of a game.
     */
    handleGameOver(result) {
        console.log(`Game Over! Winner: ${result.winner}`);
        this.saveManager.deleteSave(); // Clear the save file on game over
        setTimeout(() => {
            alert(`Game Over! The winner is: ${result.winner}`);
            this.showMainMenu();
        }, 100);
    }
}

export default App;
