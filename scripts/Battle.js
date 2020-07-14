class Battle extends Canvas {
    constructor(width, height) {
        super(width, height);
        this.mainLoop = false;
        this.turn = 0;

        // sound
        this.theme = document.getElementById('battle-theme');
        this.theme.volume = 0.5;

        // bg
        this.battleBg = 'assets/bg.jpeg';
        this.bgObj = new Background(this.width, this.height, this.battleBg);

        // event listeners
        this.mousePos = {};
        this.result = '';
        this.gameOver = new GameOver(this.width, this.height, this.result);
        this.withinBoundaries = false;
    };

    getMousePos = (e) => {
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
    };

    restartGame = () => {
        if(this.withinBoundaries) {
            newBattle.stop();
            newGame.init(this.width, this.height);
        };
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
            this.enemyIconHeight
        );

        // Determines who goes first.
        if(this.BattlingPlayer.statsObj.speed > this.BattlingEnemy.statsObj.speed) {
            this.firstToAttack = this.BattlingPlayer;
            this.secondToAttack = this.BattlingEnemy;
        } else {
            this.firstToAttack = this.BattlingEnemy;
            this.secondToAttack = this.BattlingPlayer;
        };

        return this.BattlingPlayer.loadImage(this.BattlingPlayer.drawImage)
        .then(() => this.BattlingPlayer.displayHealth());
    };

    drawParticipants() {
        if(this.BattlingEnemy.damaged) this.BattlingEnemy.flashImage();
        else this.BattlingEnemy.drawImage();

        if(this.BattlingPlayer.damaged) this.BattlingPlayer.flashImage();
        else this.BattlingPlayer.drawImage();

        this.BattlingEnemy.displayHealth();
        this.BattlingPlayer.displayHealth();
    };

    battle = async () => {
        if(this.BattlingPlayer.health <= 0) {
            this.result='You lost.';
        } else if(this.BattlingEnemy.health <= 0) {
            this.result='You won!';
        } else {
            if(this.turn % 2 == 0) {
                let secondToAttackX = this.secondToAttack.x;
                let secondToAttackY = this.secondToAttack.y;
                // Wait for the animation to finish and THEN end the turn.
                await this.firstToAttack.moveTo(secondToAttackX, secondToAttackY);
                this.firstToAttack.attackSelected(this.secondToAttack);
            } else {
                let firstToAttackX = this.firstToAttack.x;
                let firstToAttackY = this.firstToAttack.y;
                await this.secondToAttack.moveTo(firstToAttackX, firstToAttackY);
                this.secondToAttack.attackSelected(this.firstToAttack);
            };
            setTimeout(this.endTurn,1000);
        };
    };

    update = () => {
        this.clear();
        this.mainLoop = requestAnimationFrame(this.update);
        this.bgObj.draw();
        this.drawParticipants();
        if(this.result) {
            this.gameOver.setMessage(this.result);
            this.gameOver.createGameOverScreen();
            this.withinBoundaries = this.gameOver.restartBtn.checkBtnBoundaries(this.mousePos);
            if(this.withinBoundaries) this.gameOver.restartBtn.btnHover();
        };
    };

    endTurn = () => {
        this.turn++;
        this.drawParticipants();
        this.battle();
    };

    init = async (width = this.width, height = this.height) => {
        this.bgObj.resize(width, height);
        this.resize(width, height);
        this.generateActors();
        this.drawParticipants();
        this.gameOver.reinit(width, height);
    };

    stop() {
        this.theme.pause();
        this.canvas.removeEventListener('mousemove', this.getMousePos);
        this.canvas.removeEventListener('click', this.restartGame);
        // if(this.mainLoop) cancelAnimationFrame(this.mainLoop);
        if(this.BattlingPlayer && this.BattlingEnemy) {
            this.BattlingPlayer.stop();
            this.BattlingEnemy.stop();
        };
    };

    async start(width=this.width, height=this.height, Player, Enemy) {
        this.theme.currentTime = 0;
        this.canvas.addEventListener('mousemove', this.getMousePos);
        this.canvas.addEventListener('click', this.restartGame);
        this.result='';
        this.turn=0;
        newGame.stop();
        this.theme.play();
        // Player and enemy Objects respectively.
        this.Player = Player;
        this.Enemy = Enemy;
        
        await this.generateActors();
        this.init(width, height);
        this.update();
        // init needs to be after the Player and Enemy objects are rendered to fetch the data and create BattlingPlayer and EnemyIcons for Battle.

        // This might not be an ideal solution, but I set the resizeFunction 
        // to this instance's init rather than the Game Object's init so I stay on the same screen.
        resizeFunc = this.init;
        this.drawParticipants();
        this.battle();
    };
};