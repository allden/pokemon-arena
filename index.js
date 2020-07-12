let {clientWidth, clientHeight} = document.body;
const newGame = new Game(clientWidth, clientHeight);
newGame.fetchPokemon();
let resizeFunc = newGame.init;

window.addEventListener('resize', () => {
    clientWidth = document.body.clientWidth;
    clientHeight = document.body.clientHeight;
    resizeFunc(clientWidth, clientHeight);
});