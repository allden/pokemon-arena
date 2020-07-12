class Container {
    constructor(canvas, x, y, width, height, color) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    };
    
    createContainer = () => {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.fill();
    };
};
