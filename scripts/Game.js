class Game extends Canvas {
    constructor(width, height) {
        super(width, height);
        this.mousePos = {};
        this.fetchedPokemon = [];
        this.mainLoop=false;
    };

    // This is located in Game so I don't have to make an API call each time I resize.
    async fetchPokemon() {
        return await fetch("https://pokeapi.co/api/v2/pokemon/?limit=30")
        .then(res => res.json())
        .then(data => {
            // Get all specific pokemon URLs
            this.pokemonUrlList = data.results.map(item => item.url);
            
            // Use those URLs to fetch specific data about each pokemon
            return Promise.all(this.pokemonUrlList.map(url => {
                return fetch(url)
                .then(res => res.json());
            }))
            .then(data => {
                this.fetchedPokemon = data;
                this.init();
            });
        });
    };

    getMousePos = (e) => {
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
    };

    create() {
        this.SelectScreen = new SelectScreen(this.fetchedPokemon, this.canvas, 0, 0, this.width/2, this.height, "#ddd");
        this.SelectScreen.createSelectScreen();
        this.InfoScreen = new InfoScreen(null, this.canvas, this.width/2, 0, this.width/2, this.height, "#333");

        // Event listeners
        this.canvas.addEventListener('mousemove', this.getMousePos);
        this.canvas.addEventListener('click', this.battleStart);
    };

    battleStart = (e) => {
        this.SelectScreen.startBattle(e);
    }

    // The update function which will run every second or so.
    update = () => {
        this.mainLoop = requestAnimationFrame(this.update);
        // this.ctx.clearRect(0, 0, this.width, this.height);
        this.SelectScreen.refresh();
        this.InfoScreen.refresh();
        this.SelectScreen.checkIfWithinBoundaries(this.mousePos);
    };

    init = (width=this.width, height=this.height) => {
        this.resize(width, height);
        // Remove event listeners if previously set. This should only occur when resizing.
        this.stop();
        this.create();
        this.update();
        resizeFunc = this.init;
    };

    stop() {
        if(this.mainLoop) cancelAnimationFrame(this.mainLoop);
        this.canvas.removeEventListener('mousemove', this.getMousePos);
        this.canvas.removeEventListener('click', this.battleStart);
    };
};