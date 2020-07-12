class Pokemon {
    constructor(canvas, x, y, name, ability, movesArr, statsObj, sprites, width, height, front=true) {
        // Pokemon dimensions and stats
        this.name = name;
        this.ability = ability;
        this.movesArr = movesArr;
        this.statsObj = statsObj;
        this.sprites = sprites;
        this.width = width;
        this.height = height;
        this.front = front;

        // Getting the whole canvas element so that I have access to the height and the width
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.x = x;
        this.y = y;
        this.loadImage();
    };

    loadImage() {
        this.sprite = new Image();
        this.sprite.onload = () => {
            this.drawImage(this.x, this.y, this.width, this.height);
        };
        this.sprite.src = this.front ? this.sprites.front_default : this.sprites.back_default;
    };

    drawImage(x, y, width, height) {
        this.ctx.drawImage(this.sprite, x, y, width, height);
    };
};

class PokemonBattle extends Pokemon {
    constructor() {
        super();
    };
};

class PokemonSelectIcon extends Pokemon {
    constructor(...args) {
        super(...args);
    };

    createInfoCard() {
        this.InfoScreen = new InfoScreen(this, this.canvas, this.width/2, 0, this.width/2, this.height, "#ddd");
        this.InfoScreen.createInfoScreen();
    };

    hoverEffect() {
        this.ctx.fillStyle = "rgba(32, 64, 128, 0.4)";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.fill();
    };

    getStatInfo() {
        let textData = [];
        for(let key in this.statsObj) {
            textData.push(`${formatText(key)}: ${this.statsObj[key]}`);
        };
        return textData;
    };

    getMoveInfo() {
        let textData = [];
        this.movesArr.forEach((move, index) => {
            textData.push(`Move ${index}: ${formatText(move)}`); 
        });
        return textData;
    };
};

function formatText(str) {
    let strArr = str.split('-');
    // Removes hyphens and capitalizes the first letter
    let formatted = strArr.map(item => item[0].toUpperCase() + item.substring(1));
    
    return formatted.join(' ');
};