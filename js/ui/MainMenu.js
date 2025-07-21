/**
 * @file MainMenu.js
 * Renders the main menu of the game and handles user interaction.
 * This version is corrected to align with the application's architecture.
 */
class MainMenu {
    /**
     * Initializes the MainMenu.
     * @param {EventEmitter} eventEmitter - The central event bus.
     */
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
        this.container = null;
    }

    /**
     * Renders the main menu into the given container.
     * @param {HTMLElement} container - The DOM element to render into.
     * @param {boolean} hasSaveGame - Whether a saved game exists.
     */
    render(container, hasSaveGame = false) {
        this.container = container;
        
        const continueButtonHTML = hasSaveGame ? 
            `<button id="continue-game" class="menu-button">Continue Skirmish</button>` : '';

        this.container.innerHTML = `
            <div class="main-menu-container">
                <header class="ascii-header">
                    <pre class="logo">
╔═══════════════════════════════════════════════════════════╗
║   _____ _               _               _                 ║ 
║  / ____| |             | |             (_)                ║
║ | |    | |__   ___  ___| |_ _ __ ___  _ __  _  ___  _ __   ║
║ | |    | '_ \\ / _ \\/ __/ __| '__/ _ \\| '_ \\| |/ _ \\| '_ \\  ║
║ | |____| | | |  __/\\__ \\__ \\ | | (_) | |_) | | (_) | | | | ║
║  \\_____|_| |_|\\___||___/___/\__|_|  \\___/| .__/|_|\\___/|_| |_| ║
║                                         | |                  ║
║  Where Every Piece Has Feelings         |_|                  ║
╚═══════════════════════════════════════════════════════════╝
                    </pre>
                </header>
                <nav class="menu-nav">
                    <button id="start-campaign" class="menu-button">Story Mode</button>
                    ${continueButtonHTML}
                    <button id="start-new-game" class="menu-button">Skirmish</button>
                    <button id="options" class="menu-button" disabled>Options</button>
                </nav>
            </div>
        `;

        this.addEventListeners(hasSaveGame);
    }

    /**
     * Adds event listeners to the menu buttons.
     * @param {boolean} hasSaveGame - Determines if the continue button listener is needed.
     */
    addEventListeners(hasSaveGame) {
        document.getElementById('start-campaign').addEventListener('click', (e) => {
            e.preventDefault();
            this.eventEmitter.emit('startCampaign');
        });

        if (hasSaveGame) {
            document.getElementById('continue-game').addEventListener('click', (e) => {
                e.preventDefault();
                this.eventEmitter.emit('loadGame');
            });
        }

        document.getElementById('start-new-game').addEventListener('click', (e) => {
            e.preventDefault();
            this.eventEmitter.emit('selectTeam');
        });
    }
}

// This makes it the default export, which app.js is expecting.
export default MainMenu;
