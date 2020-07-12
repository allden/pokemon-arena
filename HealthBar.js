class HealthBar extends Container {
    constructor(canvas, x, y, width, height, color, pkmnName, pkmnHp) {
        super(canvas, x, y, width, height, color);
        this.pkmnName = pkmnName;
        this.pkmnHp = pkmnHp;
        this.ctx = this.canvas.getContext('2d');
    };

    draw() {
        const {x, y, width, height} = this;
        this.ctx.clearRect(x, y, width, height);
        this.container = this.createContainer();
        this.drawName();
        this.drawHealthBar();
    };

    drawHealthBar() {
        // The HealthBar will always be in the container element.
        const {x, y, width, height} = this;
        let healthBarWidth = width - width/10;
        let healthBarHeight = height * 0.15;

        // center horizontally
        let healthBarX = x + (width - healthBarWidth) / 2;
        // center vertically
        let healthBarY = y + (height - this.textHeight)/2 + this.textHeight*1.25;

        this.healthBar = new Container(this.canvas, healthBarX, healthBarY, healthBarWidth, healthBarHeight, "green");
        this.healthBar.createContainer();
    };

    drawName() {
        const textOptions = {
            font: 'Arial',
            size: this.height / Math.ceil(this.width/this.height),
            color: '#ddd'
        };

        this.nameText = new Text(this.canvas, 0, 0, this.pkmnName, textOptions);
        this.textHeight = this.nameText.getHeight();
        let textWidth = this.nameText.getWidth();
        let textX = this.x + (this.width-textWidth)/2;
        let textY = this.y+(this.height-this.textHeight)/2;
        this.nameText.setPosition(textX, textY);
        this.nameText.draw();
    };
};