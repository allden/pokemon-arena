class HealthBar extends Container {
    constructor(canvas, x, y, width, height, color, pkmnName, pkmnHp, pkmnMaxHp) {
        super(canvas, x, y, width, height, color);
        this.pkmnName = pkmnName;
        this.pkmnHp = pkmnHp;
        this.pkmnMaxHp = pkmnMaxHp;
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

        // Width of the healthbar decrements based on the value we get from dividing the current health by the total.
        let ratio = this.pkmnHp / this.pkmnMaxHp;
        let healthBarWidth = (width - width/10) * ratio > 0 ? (width - width/10) * ratio : 0;
        let healthBarHeight = height * 0.15;

        // center horizontally
        let healthBarX = x + (width - healthBarWidth) / 2;
        // center vertically
        let healthBarY = y + (height - this.textHeight)/2 + this.textHeight*1.25;

        // Order here is important. It should go from the lowest to the highest, otherwise it will not match the correct colors.
        this.healthBarColor = ratio <= 0.10 ? "#de5055" : ratio <= 0.50 ? "#deb95b" : "#95e365";
        this.healthBar = new Container(this.canvas, healthBarX, healthBarY, healthBarWidth, healthBarHeight, this.healthBarColor);
        this.healthBar.createContainer();
    };

    drawName() {
        const textOptions = {
            font: 'Arial',
            size: this.height / Math.ceil(this.width/this.height),
            color: '#ddd'
        };

        let content = `${this.pkmnName} ${this.pkmnHp}/${this.pkmnMaxHp}`;

        this.nameText = new Text(this.canvas, 0, 0, content, textOptions);
        this.textHeight = this.nameText.getHeight();
        let textWidth = this.nameText.getWidth();
        let textX = this.x + (this.width-textWidth)/2;
        let textY = this.y+(this.height-this.textHeight)/2;
        this.nameText.setPosition(textX, textY);
        this.nameText.draw();
    };
};