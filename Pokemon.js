class Pokemon {
    constructor(canvas, x, y, name, statsObj, sprites, width, height, front=true) {
        // Pokemon dimensions and stats
        this.name = name;
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

    getFormattedName() {
        return formatText(this.name);
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

class PokemonBattleIcon extends Pokemon {
    constructor(identity, ...args) {
        super(...args);
        // This will be used to identify whether the sprite is the player or the enemy.
        this.identity = identity;
        this.health = this.statsObj.hp;
    };

    attackSelected(Target) {
        let {attack} = this.statsObj;
        let attackPower = (attack / Target.statsObj.defense) * Math.floor(Math.random() * 200);
        Target.statsObj.hp -= attackPower;

        if(Target.statsObj.hp <= 0) console.log('END!');
    };

    displayHealth() {
        const {health} = this;
        let healthBarWidth, healthBarHeight, healthBarX, healthBarY;
        healthBarWidth = this.width - this.width * 0.15;
        healthBarHeight = this.height * 0.20;
        healthBarX = this.x + (this.width-healthBarWidth)/2;
        if(this.identity.toLowerCase() === 'player') {
            healthBarY = this.y + this.height - healthBarHeight;
        } else {
            healthBarY = this.y;
        };

        this.healthBar = new HealthBar(this.canvas, healthBarX, healthBarY, healthBarWidth, healthBarHeight, "#333", this.getFormattedName(), health);
        this.healthBar.draw();
    };
};

class PokemonSelectIcon extends Pokemon {
    constructor(ability, movesArr, ...args) {
        super(...args);
        this.ability = ability;
        this.movesArr = movesArr;
    };

    createInfoCard() {
        this.InfoScreen = new InfoScreen(this, this.canvas, this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height, "#333");
        this.InfoScreen.createInfoScreen();
    };

    hoverEffect() {
        // As long as your mouse is over an image of a pokemon, the loop will create a transparent rectangle
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