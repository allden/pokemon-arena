class Canvas {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.addEventListener('mousemove', this.getMousePos);
    };

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    };

    config() {
        // Set canvas width and height
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    };

    // This will get called on each resize.
    resize(width=this.width, height=this.height) {
        this.width = width;
        this.height = height;
        this.config();
    };
};