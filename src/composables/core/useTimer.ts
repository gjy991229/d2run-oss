import { ref, type Ref } from 'vue';

export interface UseTimerReturn {
    isRunning: Ref<boolean>;
    isUserPaused: Ref<boolean>;
    startTime: Ref<number>;
    totalPausedTime: Ref<number>;
    pauseStartTime: Ref<number>;
    elapsedTime: Ref<number>;
    start: () => void;
    stop: () => void;
    startTicker: (checkPaused: () => boolean) => void;
}

export function useTimer(): UseTimerReturn {
    const isRunning = ref(false);
    const isUserPaused = ref(false);
    // Separate search pause state managed by consumer

    const startTime = ref(0);
    const totalPausedTime = ref(0);
    const pauseStartTime = ref(0);
    const elapsedTime = ref(0);
    const timerId = ref<number | null>(null);

    /** Start a new timer run */
    function start() {
        stop();
        isUserPaused.value = false;
        startTime.value = Date.now();
        totalPausedTime.value = 0;
        pauseStartTime.value = 0;
        elapsedTime.value = 0;
        isRunning.value = true;

        timerId.value = window.setInterval(() => {
            // Consumer handles checking "effective pause" state before updating
            // This composable just ticks
            // Logic moved to usage site or we pass `isPaused` in
        }, 50);
    }

    // Re-designing to accept external "isEffectivePaused" to make it pure?
    // Or just provide the primitives. 

    // Let's copy logic from runStore but clean up:

    function startTicker(checkPaused: () => boolean) {
        if (timerId.value) clearInterval(timerId.value);
        timerId.value = window.setInterval(() => {
            if (!checkPaused()) {
                elapsedTime.value = Date.now() - startTime.value - totalPausedTime.value;
            }
        }, 50);
    }

    function stop() {
        if (timerId.value) {
            clearInterval(timerId.value);
            timerId.value = null;
        }
        isRunning.value = false;
    }

    return {
        isRunning,
        isUserPaused,
        startTime,
        totalPausedTime,
        pauseStartTime,
        elapsedTime,
        start,
        stop,
        startTicker
    };
}
