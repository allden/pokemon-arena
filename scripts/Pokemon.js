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
        this.initialX = x;
        this.initialY = y;
        this.loadImage();

        // sound
        this.hitSfx = document.getElementById('hit');
    };

    getFormattedName() {
        return formatText(this.name);
    };

    async loadImage(cb = () => {}) {
        return new Promise(resolve => {
            this.sprite = new Image();
            this.sprite.onload = () => {
                return resolve();
            };
            this.sprite.src = this.front ? this.sprites.front_default : this.sprites.back_default;
        })
        .then(cb);
    };

    drawImage = (x=this.x, y=this.y, width=this.width, height=this.height) => {
        this.ctx.drawImage(this.sprite, x, y, width, height);
    };

    flashImage = () => {
        this.ctx.globalAlpha = 0.5;
        this.drawImage();
        this.ctx.globalAlpha = 1;
    };
};

class PokemonBattleIcon extends Pokemon {
    constructor(identity, ...args) {
        super(...args);
        // This will be used to identify whether the sprite is the player or the enemy.
        this.identity = identity;
        this.maxHealth = this.statsObj.hp;
        this.health = this.statsObj.hp;
        this.damaged = false;
    };

    attackSelected(Target) {
        let {attack} = this.statsObj;
        let attackPower = Math.floor((attack / Target.statsObj.defense) * Math.floor(Math.random() * 200));
        Target.takeDamage(attackPower);
    };

    takeDamage(amount) {
        let result = this.health-amount;
        if(result < 0) this.health = 0;
        else this.health = result;
        this.healthBar.draw(this.health);
        if(amount !== 0) {
            this.blink();
        };
    };

    blink() {
        if(this.blinkInterval) clearInterval(this.blinkInterval);
        let blinkCounter = 0;
        this.blinkInterval  = setInterval(() => {
            blinkCounter++;
            if(blinkCounter % 2 === 0 && blinkCounter <= 3 * 2) {
                this.damaged = true;
            } else if(blinkCounter % 2 !== 0 && blinkCounter <= 3 * 2) {
                this.damaged = false;
            } else {
                this.damaged = false;
            };
        }, 100);
    };

    moveTo(x, y) {
        return new Promise(resolve => {
            this.ctx.clearRect(this.x, this.y, this.width, this.height);
            let xSpeed = 1 * -((this.x-x)/1000);
            let ySpeed = 1 * -((this.y-y)/1000);
            
            this.attackAnim = setInterval(() => {
                ySpeed = ySpeed + ySpeed * 0.02;
                xSpeed = xSpeed + xSpeed * 0.02;
                this.x+=xSpeed;
                this.y+=ySpeed;

                if((this.x <= x+this.width/4 && this.x >= x-this.width/4)) {
                    this.hitSfx.play();
                    // When the attacking pokemon reaches the target, reverse the speeds so it goes backwards.
                    ySpeed = -ySpeed;
                    xSpeed = -xSpeed;

                    setTimeout(() => {
                        this.x = this.initialX;
                        this.y = this.initialY;
                        clearInterval(this.attackAnim);
                        return resolve();
                    }, 200);
                };
            }, 1);
        });
    };
    
    stop() {
       clearInterval(this.attackAnim);
       clearInterval(this.blinkInterval);
    };

    displayHealth() {
        let healthBarWidth, healthBarHeight, healthBarX, healthBarY;
        healthBarWidth = this.width - this.width * 0.15;
        healthBarHeight = this.height * 0.20;
        healthBarX = this.initialX + (this.width-healthBarWidth)/2;
        if(this.identity.toLowerCase() === 'player') {
            healthBarY = this.initialY + this.height - healthBarHeight;
        } else {
            healthBarY = this.initialY;
        };

        // Need to make sure this doesn't point to the dynamically changing this.health, but rather to the MAX health of the pokemon.
        this.healthBar = new HealthBar(this.canvas, healthBarX, healthBarY, healthBarWidth, healthBarHeight, "#333", this.getFormattedName(), this.health, this.maxHealth);
        this.healthBar.draw(this.health);
    };

    heal() {
        this.health = this.maxHealth;
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