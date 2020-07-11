class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.mousePos = {};
    };

    config() {
        // Set canvas width and height
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.addEventListener('mousemove', this.getMousePos);
    };

    getMousePos = (e) => {
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
        // console.log(this.mousePos);
    };

    create() {
        this.SelectScreen = new SelectScreen(this.canvas, 0, 0, this.width/2, this.height, "#333333");
    };

    // The update function which will run every second or so.
    update = () => {
        requestAnimationFrame(this.update);
        this.ctx.clearRect(this.x, this.y, this.width, this.height);
        this.SelectScreen.refresh();
        this.SelectScreen.checkIfWithinBoundaries(this.mousePos);
    };

    init() {
        this.config();
        this.create();
        this.update();
    };
};