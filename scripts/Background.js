class Background extends Canvas {
    constructor(width, height, src) {
        super(width, height);
        this.src = src;
        this.load();
    };

    load() {
        this.img = new Image();
        this.img.addEventListener('load', () => {
            this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
        });
        this.img.src = this.src;
    };

    draw() {
        this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
    };
};