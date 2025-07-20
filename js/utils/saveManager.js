/**
 * @file saveManager.js
 * Handles saving and loading game progress to and from the browser's localStorage.
 * This keeps all save/load logic encapsulated in one place.
 */

// A unique key to identify the saved game in localStorage.
const SAVE_KEY = 'chesstropia_savegame';

class SaveManager {
    /**
     * Saves the current game state to localStorage.
     * The game state is converted to a JSON string for storage.
     * @param {object} gameState - A serializable object representing the entire game state.
     * @returns {boolean} True if the save was successful, false otherwise.
     */
    saveGame(gameState) {
        try {
            const jsonState = JSON.stringify(gameState);
            localStorage.setItem(SAVE_KEY, jsonState);
            console.log('Game saved successfully.');
            return true;
        } catch (error) {
            console.error('Error saving game:', error);
            // This can happen if localStorage is full or disabled.
            return false;
        }
    }

    /**
     * Loads the game state from localStorage.
     * The JSON string is parsed back into an object.
     * @returns {object|null} The saved game state object, or null if no save exists or if there's an error.
     */
    loadGame() {
        try {
            const jsonState = localStorage.getItem(SAVE_KEY);
            if (jsonState === null) {
                console.log('No save game found.');
                return null;
            }
            const gameState = JSON.parse(jsonState);
            console.log('Game loaded successfully.', gameState);
            return gameState;
        } catch (error) {
            console.error('Error loading game:', error);
            // This can happen if the saved data is corrupted.
            return null;
        }
    }

    /**
     * Checks if a saved game exists in localStorage.
     * @returns {boolean} True if a save game is found.
     */
    hasSaveGame() {
        return localStorage.getItem(SAVE_KEY) !== null;
    }

    /**
     * Deletes the saved game from localStorage.
     * This is useful for starting a fresh game or clearing corrupted data.
     */
    deleteSave() {
        localStorage.removeItem(SAVE_KEY);
        console.log('Save game deleted.');
    }
}

export default SaveManager;
