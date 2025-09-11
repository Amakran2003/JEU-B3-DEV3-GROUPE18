export class HealthBar {
    private element: HTMLElement;
    private fillElement: HTMLElement;
    private maxHealth: number;
    private currentHealth: number;

    constructor(elementId: string, maxHealth: number) {
        const el = document.getElementById(elementId);
        if (!el) throw new Error(`Element with ID ${elementId} not found.`);
        const fill = el.querySelector('.health-fill') as HTMLElement;
        if (!fill) throw new Error(`Health fill element not found in ${elementId}.`);

        this.element = el;
        this.fillElement = fill;
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
    }

    setHealth(health: number) {
        this.currentHealth = Math.max(0, Math.min(this.maxHealth, health));
        const percentage = (this.currentHealth / this.maxHealth) * 100;
        this.fillElement.style.width = `${percentage}%`;
    }

    getHealth() {
        return this.currentHealth;
    }
}
