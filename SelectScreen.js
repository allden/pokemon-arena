class SelectScreen extends Container {
    constructor(...args) {
        super(...args);
        this.fetchedPokemon = [];
        this.pokemonList = [];
        this.fetchPokemon();
    };

    async createSelectScreen() {
        // Matrix controls
        let row = 0;
        let col = 0;
        this.fetchedPokemon.forEach((pokemon) => {
            const name = pokemon.name;
            // Filter only for the ability with the required attribute and return the first instance of it
            const nonHiddenAbility = pokemon.abilities.filter(ability => ability.is_hidden === false)[0].ability.name;

            // Reduce the stats into stat : value pairs
            const statsInitial = {};
            const stats = pokemon.stats.reduce((prev, current) => {
                return {...prev, [current.stat.name]:current.base_stat}
            }, statsInitial);

            // Get an array only with the move names
            const moves = pokemon.moves.map(current => current.move.name).slice(0,4);
            const {sprites} = pokemon;
            
            // Define position and dimensions
            let matrixDimensions = 5;
            let pkmnWidth = this.width / matrixDimensions;
            let pkmnHeight = pkmnWidth;
            let x = col * pkmnWidth;
            col++;

            // If the value of x is the same as the width of the container, it is going to exceed it. Therefore, we want to move to a new row and reset the columns.
            if((this.width / x) === 1) {
                row++
                col = 0;
                x = col * pkmnWidth;
                col++;
            };
            let y = row * pkmnHeight;
            let totalRows = this.fetchedPokemon.length/matrixDimensions;

            this.pokemonList.push(new PokemonSelectIcon(this.canvas, x, 
                (this.height/2 - (pkmnHeight*totalRows)/2) + y,
                 name, nonHiddenAbility, moves, stats, sprites, pkmnWidth, pkmnHeight, true));
        });
    };

    async fetchPokemon() {
        this.pokemon = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=20")
            .then(res => res.json())
            .then(data => data.results);

        // Get all specific pokemon URLs
        this.pokemonUrlList = this.pokemon.map(item => item.url);
        
        // Use those URLs to fetch specific data about each pokemon
        return Promise.all(this.pokemonUrlList.map(url => {
            return fetch(url)
            .then(res => res.json());
        }))
        .then(data => {
            this.fetchedPokemon = data;
            this.createSelectScreen();
        });
    };

    checkIfWithinBoundaries(mousePos) {
        // Pokemon is capitalized because it refers to every class instance in the pokemonList array.
        // This checks if the current mouse position is within the boundaries of a Pokemon
        this.pokemonList.forEach(Pokemon => {
            if((mousePos.x < Pokemon.x + Pokemon.width && mousePos.x > Pokemon.x) &&
            (mousePos.y < Pokemon.y + Pokemon.height && mousePos.y > Pokemon.y)) {
                Pokemon.createInfoCard();
                Pokemon.hover();
            };
        });
    };

    refresh() {
        this.createContainer();
        this.pokemonList.forEach(async Pokemon => {
            Pokemon.drawImage();
        });
    };
};