class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.mousePos = {};
        this.fetchedPokemon = [];
        this.loop=false;
    };

    // This is located in Game so I don't have to make an API call each time I resize.
    async fetchPokemon() {
        return await fetch("https://pokeapi.co/api/v2/pokemon/?limit=8")
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

    config() {
        // Set canvas width and height
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.addEventListener('mousemove', this.getMousePos);
    };

    getMousePos = (e) => {
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
        // console.log(this.mousePos);
    };

    create() {
        this.SelectScreen = new SelectScreen(this.fetchedPokemon, this.canvas, 0, 0, this.width/2, this.height, "#ddd");
        this.SelectScreen.createSelectScreen();
        this.InfoScreen = new InfoScreen(null, this.canvas, this.width/2, 0, this.width/2, this.height, "#ddd");
    };

    // The update function which will run every second or so.
    update = () => {
        this.loop = requestAnimationFrame(this.update);
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.SelectScreen.refresh();
        this.InfoScreen.refresh();
        this.SelectScreen.checkIfWithinBoundaries(this.mousePos);
    };

    init = (width=this.width, height=this.height) => {
        if(this.loop) cancelAnimationFrame(this.loop);
        this.width = width;
        this.height = height;
        this.config();
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.create();
        this.update();
    };
};