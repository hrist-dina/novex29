export class Parallax {
    constructor(boxerContainer, selector, ratio = 12) {
        this.boxerContainer = document.querySelector(boxerContainer);
        if (!this.boxerContainer) {
            return;
        }
        this.element = this.boxerContainer.querySelector(selector);
        this.ratio = ratio;

        this.maxMove = this.boxerContainer.offsetWidth / 30;
        this.boxerCenterX = this.element.offsetLeft + (this.element.offsetWidth / 2);
        this.boxerCenterY = this.element.offsetTop + (this.element.offsetHeight / 2);
        this.fluidboxer = window.matchMedia("(min-width: 726px)");

        this.init();
    }

    init() {
        this.mousemove();
    }

    getMousePos(xRef, yRef) {
        let panelRect = this.boxerContainer.getBoundingClientRect();
        return {
            x: Math.floor(xRef - panelRect.left) / (panelRect.right - panelRect.left) * this.boxerContainer.offsetWidth,
            y: Math.floor(yRef - panelRect.top) / (panelRect.bottom - panelRect.top) * this.boxerContainer.offsetHeight
        };
    }

    mousemove() {
        const self = this;
        this.boxerContainer.addEventListener("mousemove", function (e) {
            let mousePos = self.getMousePos(e.clientX, e.clientY),
                distX = mousePos.x - self.boxerCenterX,
                distY = mousePos.y - self.boxerCenterY;
            if (self.fluidboxer.matches) {
                self.element.style.transform = "translate(" + (-1 * distX) /  self.ratio + "px," + (-1 * distY) /  self.ratio + "px)";
                // self.boxerContainer.style.backgroundPosition = `calc(50% + ${distX / 50}px) calc(50% + ${distY / 50}px)`;
            }
        });
    }
}


