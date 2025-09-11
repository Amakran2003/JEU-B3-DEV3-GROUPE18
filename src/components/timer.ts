export class Timer {
    private element: HTMLElement;
    private endTime: number;
    private intervalId: number | null = null;
    private totalDurationInSeconds: number;
    private onTimeUp: (() => void) | null = null;

    constructor(elementId: string, durationInSeconds: number = 180) { // 3 minutes par défaut
        const el = document.getElementById(elementId);
        if (!el) throw new Error(`Element with ID ${elementId} not found.`);
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

    reset(durationInSeconds?: number) {
        if (durationInSeconds !== undefined) {
            this.totalDurationInSeconds = durationInSeconds;
        }
        this.stop();
        this.endTime = Date.now() + this.totalDurationInSeconds * 1000;
        this.updateDisplay();
    }

    // Définir une fonction callback à appeler quand le temps est écoulé
    setOnTimeUp(callback: () => void) {
        this.onTimeUp = callback;
    }

    // Obtenir le temps restant en secondes
    getRemainingTime(): number {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((this.endTime - now) / 1000));
        return remaining;
    }

    private updateDisplay() {
        const remainingSeconds = this.getRemainingTime();
        const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
        const seconds = String(remainingSeconds % 60).padStart(2, '0');
        this.element.textContent = `Temps : ${minutes}:${seconds}`;

        // Supprimer les classes existantes
        this.element.classList.remove('warning', 'danger');
        
        // Ajouter les classes appropriées en fonction du temps restant
        if (remainingSeconds <= 10) {
            this.element.classList.add('danger');
        } else if (remainingSeconds <= 30) {
            this.element.classList.add('warning');
        }
    }

    // Vérifier si le timer est en cours d'exécution
    isRunning(): boolean {
        return this.intervalId !== null;
    }
}
