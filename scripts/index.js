let {clientWidth, clientHeight} = document.body;
const newGame = new Game(clientWidth, clientHeight);
let resizeFunc = newGame.init;
const newBattle = new Battle(clientWidth, clientHeight);
newGame.fetchPokemon();

window.addEventListener('resize', () => {
    clientWidth = document.body.clientWidth;
    clientHeight = document.body.clientHeight;
    resizeFunc(clientWidth, clientHeight);
});