// Simple event bus for cross-component communication
class AppEvents {
    constructor() {
        this.events = {};
    }

    // Subscribe to an event
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);

        // Return unsubscribe function
        return () => {
            this.events[event] = this.events[event].filter((cb) => cb !== callback);
        };
    }

    // Emit an event
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach((callback) => callback(data));
        }
    }
}

// Create a singleton instance
export const appEvents = new AppEvents();

// Define event constants
export const APP_EVENTS = {
    OPEN_PROFILE_MODAL: "open-profile-modal",
    OPEN_CHANGE_PASSWORD_MODAL: "open-change-password-modal",
    // Add more events as needed
};
