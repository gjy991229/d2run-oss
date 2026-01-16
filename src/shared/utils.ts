/**
 * Utility functions for the D2Run application.
 *
 * This module contains reusable helper functions for color manipulation,
 * input validation, and time formatting.
 */

import { MAX_INPUT_LENGTH } from './constants';

/**
 * Apply opacity to a color string (rgba, rgb, or hex format).
 *
 * @param color - The color string to modify
 * @param opacityPercent - Opacity percentage (0-100)
 * @returns Modified color string with new opacity
 *
 * @example
 * applyOpacityToColor('rgba(255, 0, 0, 1)', 50) // 'rgba(255, 0, 0, 0.5)'
 * applyOpacityToColor('#ff0000', 50) // 'rgba(255, 0, 0, 0.5)'
 */
export function applyOpacityToColor(color: string, opacityPercent: number): string {
    const opacity = opacityPercent / 100;

    // Handle rgba format
    if (color.startsWith('rgba')) {
        return color.replace(/rgba\(([^)]+),\s*[\d.]+\)/, `rgba($1, ${opacity})`);
    }

    // Handle rgb format
    if (color.startsWith('rgb(')) {
        const match = color.match(/rgb\(([^)]+)\)/);
        if (match) {
            return `rgba(${match[1]}, ${opacity})`;
        }
    }

    // Handle hex format
    if (color.startsWith('#')) {
        const hex = color.slice(1);
        let r, g, b;
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else {
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    return color;
}

/**
 * Sanitize user input by removing HTML tags and limiting length.
 *
 * @param str - Raw input string
 * @returns Sanitized string safe for storage/display
 */
export function sanitizeInput(str: string): string {
    if (!str) return '';
    return str
        .replace(/<[^>]*>/g, '')
        .slice(0, MAX_INPUT_LENGTH)
        .trim();
}

/**
 * Format milliseconds into a human-readable time string.
 *
 * @param ms - Duration in milliseconds
 * @returns Formatted time string (MM:SS.d)
 *
 * @example
 * formatTime(65100) // '01:05.1'
 * formatTime(0) // '--:--'
 * formatTime(Infinity) // '--:--'
 */
export function formatTime(ms: number): string {
    if (ms < 0) return '00:00.0';
    if (ms === Infinity || ms === 0 || isNaN(ms)) return '--:--';
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60)
        .toString()
        .padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    const dec = Math.floor((ms % 1000) / 100);
    return `${m}:${s}.${dec}`;
}
