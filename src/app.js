import { initializeUI } from './ui.js';
import { initializeSettings } from './settings.js';
import { findPath } from './pathfinder.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    initializeSettings();
});