/**
 * @file StormAnnouncer.js
 * Displays prominent, temporary announcements for the start, progression, and end of Emotional Storms.
 */
class StormAnnouncer {
    /**
     * Initializes the StormAnnouncer.
     * @param {HTMLElement} container - The DOM element to render announcements into.
     * @param {EventEmitter} eventEmitter - The central event bus.
     */
    constructor(container, eventEmitter) {
        if (!container) {
            console.error("StormAnnouncer: The provided container element does not exist in the DOM.");
            return;
        }
        this.container = container;
        this.eventEmitter = eventEmitter;

        this.bindEvents();
    }

    /**
     * Binds to storm-related events from the event emitter.
     */
    bindEvents() {
        this.eventEmitter.on('stormStarted', this.handleStormStarted.bind(this));
        this.eventEmitter.on('stormEnded', this.handleStormEnded.bind(this));
    }

    /**
     * Displays an announcement when a storm starts.
     * @param {object} data - Event data: { stormType, duration }.
     */
    handleStormStarted({ stormType, duration }) {
        const message = `A STORM OF ${stormType.toUpperCase()} HAS STARTED!
                       <br>
                       <small>It will last for ${duration} rounds.</small>`;
        this.displayAnnouncement(message, 'storm-start', 5000); // Display for 5 seconds
    }

    /**
     * Displays an announcement when a storm ends.
     * @param {object} data - Event data: { stormType }.
     */
    handleStormEnded({ stormType }) {
        const message = `The Storm of ${stormType} has ended.`;
        this.displayAnnouncement(message, 'storm-end', 4000); // Display for 4 seconds
    }

    /**
     * Creates, displays, and automatically removes a temporary announcement message.
     * @param {string} message - The HTML message to display.
     * @param {string} typeClass - A CSS class for styling ('storm-start', 'storm-end').
     * @param {number} duration - How long to display the message in milliseconds.
     */
    displayAnnouncement(message, typeClass, duration) {
        const announcementElement = document.createElement('div');
        announcementElement.className = `storm-announcement ${typeClass}`;
        announcementElement.innerHTML = message;

        this.container.appendChild(announcementElement);

        // Use a short timeout to allow the element to be in the DOM before adding the class
        // that triggers the CSS transition for fading in.
        setTimeout(() => {
            announcementElement.classList.add('visible');
        }, 10);

        // Set a timer to fade out and then remove the element.
        setTimeout(() => {
            announcementElement.classList.remove('visible');
            
            // Wait for the fade-out transition to complete before removing from the DOM.
            setTimeout(() => {
                if (announcementElement.parentNode) {
                    this.container.removeChild(announcementElement);
                }
            }, 500); // This duration should match the transition time in your CSS.
        }, duration);
    }
}

export default StormAnnouncer;
