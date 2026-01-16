/**
 * Scenario/Scene management composable
 *
 * Handles scene selection, terror zone toggle, and scene localization.
 */

import { ref, type Ref } from 'vue';
import type { Scene } from '../../shared/types';
import { SCENES } from '../../shared/data';

/** Scenario composable return interface */
export interface UseScenarioReturn {
    /** Currently selected scene */
    currentScene: Ref<Scene | null>;
    /** Whether terror zone is active */
    isTerrorZone: Ref<boolean>;
    /** Get scene by name */
    getScene: (sceneName: string) => Scene | undefined;
    /** Get localized scene name */
    getSceneName: (scene: Scene | string, lang: 'CN' | 'EN') => string;
    /** Get localized scene label */
    getSceneLabel: (scene: Scene | string, lang: 'CN' | 'EN') => string;
    /** Select a scene by name */
    selectSceneByName: (sceneName: string) => Scene | undefined;
    /** Toggle terror zone state */
    toggleTerrorZone: () => void;
    /** Reset scene state for new session */
    resetScenario: () => void;
}

/**
 * Create scenario composable instance
 */
export function useScenario(): UseScenarioReturn {
    const currentScene = ref<Scene | null>(null);
    const isTerrorZone = ref(false);

    /**
     * Get scene by name
     */
    function getScene(sceneName: string): Scene | undefined {
        return SCENES.find(s => s.name === sceneName);
    }

    /**
     * Get localized scene name
     */
    function getSceneName(scene: Scene | string, lang: 'CN' | 'EN'): string {
        const s = typeof scene === 'string' ? SCENES.find(x => x.name === scene) : scene;
        if (!s) return typeof scene === 'string' ? scene : '';
        return lang === 'CN' ? s.name : (s.name_en || s.name);
    }

    /**
     * Get localized scene label
     */
    function getSceneLabel(scene: Scene | string, lang: 'CN' | 'EN'): string {
        const s = typeof scene === 'string' ? SCENES.find(x => x.name === scene) : scene;
        if (!s) return typeof scene === 'string' ? scene : '';
        return lang === 'CN' ? s.label : (s.label_en || s.label);
    }

    /**
     * Select a scene by name and return it
     */
    function selectSceneByName(sceneName: string): Scene | undefined {
        const scene = getScene(sceneName);
        if (scene) {
            currentScene.value = scene;
            if (scene.name === '恐怖地带') {
                isTerrorZone.value = true;
            }
        }
        return scene;
    }

    /**
     * Toggle terror zone state
     */
    function toggleTerrorZone(): void {
        isTerrorZone.value = !isTerrorZone.value;
    }

    /**
     * Reset scenario state for new session
     */
    function resetScenario(): void {
        isTerrorZone.value = false;
    }

    return {
        currentScene,
        isTerrorZone,
        getScene,
        getSceneName,
        getSceneLabel,
        selectSceneByName,
        toggleTerrorZone,
        resetScenario
    };
}
