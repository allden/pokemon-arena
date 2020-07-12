let {clientWidth, clientHeight} = document.body;
const newGame = new Game(clientWidth, clientHeight);
newGame.fetchPokemon();

window.addEventListener('resize', () => {
    clientWidth = document.body.clientWidth;
    clientHeight = document.body.clientHeight;
    newGame.init(clientWidth, clientHeight);
});