class GameOver extends Canvas {
    constructor(width, height, message) {
        super(width, height);
        this.message = message;
    };

    setMessage(message) {
        this.message = message;
    };

    createGameOverScreen() {
        let containerWidth = this.width * 0.25;
        let containerHeight = this.height * 0.125;
        let containerX = (this.width - containerWidth)/2;
        let containerY = (this.height - containerHeight)/2;
        let containerColor = "#333";
        this.container = new Container(this.canvas, containerX, containerY, containerWidth, containerHeight, containerColor);
        this.container.createContainer();
        this.createGameOverText();
        this.createRestartBtn();
    };
    
    createRestartBtn() {
        let restartBtnWidth = this.container.width * 0.75;
        let restartBtnHeight = this.container.height * 0.33;
        let restartBtnX = this.container.x + (this.container.width - restartBtnWidth)/2;
        let restartBtnY = this.container.y + (this.container.height - this.container.height*0.33)-10;
        let restartBtnColor = "red";
        let restartBtnHoverColor = "rgba(32, 64, 128, 0.4)";
        this.restartBtn = new Button(this.canvas, restartBtnX, restartBtnY, restartBtnWidth, restartBtnHeight, restartBtnColor, restartBtnHoverColor, 'Play Again');
        this.restartBtn.drawBtn();
    };

    createGameOverText() {
        let gameOverTextContent = this.message;
        
        const titleOptions = {
            font: 'Arial',
            color: '#ddd',
            size: this.container.height * 0.25
        };
        
        this.gameOverText = new Text(this.canvas, 0, 0, gameOverTextContent, titleOptions);
        let gameOverTextWidth = this.gameOverText.getWidth();
        let gameOverTextX = this.container.x + (this.container.width-gameOverTextWidth)/2;
        let gameOverTextY = this.container.y + this.container.height * 0.33;
        this.gameOverText.setPosition(gameOverTextX, gameOverTextY);
        this.gameOverText.draw();
    };

    reinit(width=this.width, height=this.height, msg) {
        this.width=width;
        this.height=height;
        this.message=msg;
        this.createGameOverScreen();
    };

    start() {
        this.createGameOverScreen();
    };
};