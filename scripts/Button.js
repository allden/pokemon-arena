class Button extends Container {
    constructor(canvas, x, y, width, height, color, hoverColor, content) {
        super(canvas, x, y, width, height, color);
        this.hoverColor = hoverColor;
        this.content = content;
    };

    createBtnContainer() {
        let btnX = this.x
        let btnY = this.y;
        let btnWidth = this.width;
        let btnHeight = this.height;
        let btnColor = "#ddd";
        this.btnContainer = new Container(this.canvas, btnX, btnY, btnWidth, btnHeight, btnColor);
        this.btnContainer.createContainer();
    };

    createBtnText() {
        let textOpts = {
            font: 'Arial',
            size: this.height/2,
            color: '#333'
        };
        this.btnText = new Text(this.canvas, 0, 0, this.content, textOpts);
        let btnTextHeight = this.btnText.getHeight();
        let btnTextWidth = this.btnText.getWidth();
        let btnTextX = this.btnContainer.x + (this.btnContainer.width-btnTextWidth)/2;
        let btnTextY = this.btnContainer.y + (this.btnContainer.height+btnTextHeight)/2;
        this.btnText.setPosition(btnTextX,btnTextY);
        this.btnText.draw();
    };

    checkBtnBoundaries(mousePos) {
        const {x, y} = mousePos;
        if((x > this.x && x < this.x + this.width) && (y > this.y && y < this.y + this.height)) {
            return true;
        };
    };

    drawBtn() {
        this.createBtnContainer();
        this.createBtnText();
    };

    btnHover() {
        let hoverX = this.x;
        let hoverY = this.y;
        let hoverWidth = this.width;
        let hoverHeight = this.height;
        let hoverColor = this.hoverColor;
        this.hoverEffect = new Container(this.canvas, hoverX, hoverY, hoverWidth, hoverHeight, hoverColor);
        this.hoverEffect.createContainer();
    };
};