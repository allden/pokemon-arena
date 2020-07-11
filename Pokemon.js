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
            this.drawImage();
        };
        this.sprite.src = this.front ? this.sprites.front_default : this.sprites.back_default;
    };

    drawImage() {
        this.ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
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
        let name = `Name: ${formatText(this.name)}`;
        let ability = `Ability: ${formatText(this.ability)}`;
        let statStr = this.getStatInfo();
        let moveStr = this.getMoveInfo();
    };

    hover() {
        this.ctx.fillStyle = "rgba(64, 128, 32, 0.4)";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.fill();
    };

    getStatInfo() {
        let textData = '';
        for(let key in this.statsObj) {
            textData+=`${formatText(key)}: ${this.statsObj[key]}\n`;
        };
        return textData;
    };

    getMoveInfo() {
        let textData = '';
        this.movesArr.forEach((move, index) => {
            textData+=`Move ${index}: ${formatText(move)}\n`; 
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