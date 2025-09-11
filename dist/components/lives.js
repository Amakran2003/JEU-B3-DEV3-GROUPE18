export class Lives {
    constructor(elementId, initialLives) {
        const el = document.getElementById(elementId);
        if (!el)
            throw new Error(`Element with ID ${elementId} not found.`);
        this.element = el;
        this.lives = initialLives;
        this.updateDisplay();
    }
    loseLife() {
        if (this.lives > 0) {
            this.lives -= 1;
            this.updateDisplay();
        }
    }
    gainLife() {
        this.lives += 1;
        this.updateDisplay();
    }
    getRemainingLives() {
        return this.lives;
    }
    updateDisplay() {
        this.element.textContent = `Vies : ${this.lives}`;
    }
}
