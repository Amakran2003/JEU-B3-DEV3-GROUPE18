export class Timer {
    constructor(elementId, durationInSeconds = 180) {
        this.intervalId = null;
        this.onTimeUp = null;
        const el = document.getElementById(elementId);
        if (!el)
            throw new Error(`Element with ID ${elementId} not found.`);
        this.element = el;
        this.totalDurationInSeconds = durationInSeconds;
        this.endTime = Date.now() + durationInSeconds * 1000;
    }
    start() {
        this.endTime = Date.now() + this.totalDurationInSeconds * 1000;
        this.updateDisplay();
        this.intervalId = setInterval(() => {
            const remaining = this.getRemainingTime();
            if (remaining <= 0) {
                this.stop();
                if (this.onTimeUp) {
                    this.onTimeUp();
                }
            }
            this.updateDisplay();
        }, 1000);
    }
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    reset(durationInSeconds) {
        if (durationInSeconds !== undefined) {
            this.totalDurationInSeconds = durationInSeconds;
        }
        this.stop();
        this.endTime = Date.now() + this.totalDurationInSeconds * 1000;
        this.updateDisplay();
    }
    // Définir une fonction callback à appeler quand le temps est écoulé
    setOnTimeUp(callback) {
        this.onTimeUp = callback;
    }
    // Obtenir le temps restant en secondes
    getRemainingTime() {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((this.endTime - now) / 1000));
        return remaining;
    }
    updateDisplay() {
        const remainingSeconds = this.getRemainingTime();
        const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
        const seconds = String(remainingSeconds % 60).padStart(2, '0');
        this.element.textContent = `Temps : ${minutes}:${seconds}`;
        // Supprimer les classes existantes
        this.element.classList.remove('warning', 'danger');
        // Ajouter les classes appropriées en fonction du temps restant
        if (remainingSeconds <= 10) {
            this.element.classList.add('danger');
        }
        else if (remainingSeconds <= 30) {
            this.element.classList.add('warning');
        }
    }
    // Vérifier si le timer est en cours d'exécution
    isRunning() {
        return this.intervalId !== null;
    }
}
