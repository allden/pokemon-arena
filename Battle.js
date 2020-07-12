class Battle extends Canvas {
    constructor(width, height) {
        super(width, height);
        this.mainLoop = false;
    };

    generateActors() {
        const {height} = this;

        // Player
        // I want the Player sprite to be a bit bigger so that it appears closer.
        this.playerIconWidth = height/1.5;
        this.playerIconHeight = this.playerIconWidth;
        
        this.playerX = 0;
        this.playerY = height - this.playerIconHeight;
        
        this.BattlingPlayer = new PokemonBattleIcon('Player',
            this.canvas,
            this.playerX, 
            this.playerY, 
            this.Player.getFormattedName(),
            this.Player.statsObj,
            this.Player.sprites, 
            this.playerIconWidth, 
            this.playerIconHeight, 
            false);
        
        // Enemy
        this.enemyIconWidth = height/2;
        this.enemyIconHeight = this.enemyIconWidth;
        
        this.enemyX = this.canvas.width - this.enemyIconWidth;
        this.enemyY = 0;
        
        this.BattlingEnemy = new PokemonBattleIcon('Enemy', 
            this.canvas, 
            this.enemyX, 
            this.enemyY,
            this.Enemy.getFormattedName(),
            this.Enemy.statsObj,
            this.Enemy.sprites, 
            this.enemyIconWidth, 
            this.enemyIconHeight);

        // Determines who goes first.
        if(this.BattlingPlayer.statsObj.speed > this.BattlingEnemy.statsObj.speed) {
            this.firstToAttack = this.BattlingPlayer;
            this.secondToAttack = this.BattlingEnemy;
        } else {
            this.firstToAttack = this.BattlingEnemy;
            this.secondToAttack = this.BattlingPlayer;
        };
    };

    update = () => {
        this.mainLoop = requestAnimationFrame(this.update);
        this.clear();
        this.BattlingPlayer.drawImage();
        this.BattlingEnemy.drawImage();
        this.BattlingPlayer.displayHealth();
        this.BattlingEnemy.displayHealth();
    };

    battle = () => {
        if(this.turn % 2 == 0) {
            this.firstToAttack.attackSelected(this.secondToAttack);
        } else {
            this.secondToAttack.attackSelected(this.firstToAttack);
        };
        this.turn++;

        if(this.BattlingPlayer.health <= 0) {
            clearInterval(this.battleInterval);
            console.log('You lost!');
        } else if(this.BattlingEnemy.health <= 0) {
            clearInterval(this.battleInterval);
            console.log('You won!');
        };
    };

    init = (width = this.width, height = this.height) => {
        this.stop();
        this.resize(width, height);
        this.generateActors();
        this.BattlingPlayer.heal();
        this.BattlingEnemy.heal();

        this.battleInterval = setInterval(this.battle, 1000);
        this.update();
    };

    stop() {
        if(this.mainLoop) cancelAnimationFrame(this.mainLoop);
        if(this.battleInterval) clearInterval(this.battleInterval);
    };

    start(Player, Enemy) {
        // Player and enemy Objects respectively.
        this.Player = Player;
        this.Enemy = Enemy;
        this.turn = 0;
        
        // init needs to be after the Player and Enemy objects are rendered to fetch the data and create BattlingPlayer and EnemyIcons for Battle.
        this.init();

        // Stop the Game loop from updating since we're now in a new scene.
        newGame.stop();

        // This might not be an ideal solution, but I set the resizeFunction 
        // to this instance's init rather than the Game Object's init so I stay on the same screen.
        resizeFunc = this.init;

        this.ctx.clearRect(0, 0, this.width, this.height);
        // Start it.
        this.battleInterval = setInterval(this.battle, 1000);
    };
};