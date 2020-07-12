class Battle extends Canvas {
    constructor(width, height, Player, Enemy) {
        super(width, height);
        // Player and enemy Objects respectively.
        this.Player = Player;
        this.Enemy = Enemy;

        // Stop the Game loop from updating since we're now in a new scene.
        newGame.stop();

        // This might not be an ideal solution, but I set the resizeFunction 
        // to this instance's init rather than the Game Object's init so I stay on the same screen.
        resizeFunc = this.init;

        this.ctx.clearRect(0, 0, this.width, this.height);
    };

    generateActors() {
        const {height} = this;

        // Player
        // I want the Player sprite to be a bit bigger so that it appears closer.
        this.playerIconWidth = height/1.5;
        this.playerIconHeight = this.playerIconWidth;
        console.log(this.playerIconWidth, this.playerIconHeight);
        
        this.playerX = 0;
        this.playerY = height - this.playerIconHeight;
        
        this.PlayerIcon = new PokemonBattleIcon('Player',
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
        
        this.EnemyIcon = new PokemonBattleIcon('Enemy', 
            this.canvas, 
            this.enemyX, 
            this.enemyY,
            this.Enemy.getFormattedName(),
            this.Enemy.statsObj,
            this.Enemy.sprites, 
            this.enemyIconWidth, 
            this.enemyIconHeight);
    };

    update = () => {
        requestAnimationFrame(this.update);
        this.PlayerIcon.displayHealth();
        this.EnemyIcon.displayHealth();
    };

    init = (width = this.width, height = this.height) => {
        this.resize(width, height);
        this.generateActors();
        this.update();
    };
};