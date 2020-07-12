class SelectScreen extends Container {
    constructor(fetchedPokemon, ...args) {
        super(...args);
        this.fetchedPokemon = fetchedPokemon;
        // pokemonList is the Pokemon Class array
        this.pokemonList = [];
    };

    createSelectScreen() {
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
            // fetchedPokemon = 25
            // 1920 / 1920 = 1 * sqrt(25) = 5;
            let matrixDimensions = Math.ceil((this.width/this.height) * Math.sqrt(this.fetchedPokemon.length));
            let pkmnWidth = this.width / matrixDimensions;
            let pkmnHeight = pkmnWidth;
            let x = col * pkmnWidth;
            col++;

            // If the value of x is the same as the width of the container, it is going to exceed it. Therefore, I want to move to a new row and reset the columns.
            if((this.width / x) === 1) {
                row++
                col = 0;
                x = col * pkmnWidth;
                col++;
            };
            
            // This is necessary for me to be able to center the Pokemon image matrix.
            let totalRows = Math.ceil(this.fetchedPokemon.length/matrixDimensions);
            let y = (this.height/2 - (pkmnHeight*totalRows)/2) + row * pkmnHeight;

            this.pokemonList.push(new PokemonSelectIcon(nonHiddenAbility, moves, this.canvas, x, y,
                                                        name, stats, sprites, pkmnWidth, pkmnHeight, true));
        });
    };

    checkIfWithinBoundaries(mousePos) {
        // Pokemon is capitalized because it refers to every class instance in the pokemonList array.
        // This checks if the current mouse position is within the boundaries of a Pokemon
        this.pokemonList.forEach(Pokemon => {
            if((mousePos.x < Pokemon.x + Pokemon.width && mousePos.x > Pokemon.x) &&
            (mousePos.y < Pokemon.y + Pokemon.height && mousePos.y > Pokemon.y)) {
                Pokemon.createInfoCard();
                Pokemon.hoverEffect();
            };
        });
    };

    refresh() {
        this.createContainer();
        this.pokemonList.forEach(async Pokemon => {
            Pokemon.drawImage(Pokemon.x, Pokemon.y, Pokemon.width, Pokemon.height);
        });
    };


    // The click event for the Pokemon icons.
    startBattle(e) {
        const {clientX, clientY} = e;
        this.pokemonList.forEach(Pokemon => {
            if((clientX < Pokemon.x + Pokemon.width && clientX > Pokemon.x) &&
            (clientY < Pokemon.y + Pokemon.height && clientY > Pokemon.y)) {
                let randNum = Math.floor(Math.random() * this.pokemonList.length);
                let Player = Pokemon;
                let Enemy = this.pokemonList[randNum];
                newBattle.start(Player, Enemy);
            };
        })
    };
};