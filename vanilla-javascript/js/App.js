// Actions a user can take in my app
//  1. new round
// 2. game move
// 3. reset current game
// 4. toggle meni
import View from "./view.js";
import Store from "./store.js";

const App = {
  // all of our selected HTML elements
  $: {
    menu: document.querySelector('[data-id="menu"]'),
    menuItems: document.querySelector('[data-id="menu-items"]'),
    resetBtn: document.querySelector('[data-id="reset-btn"]'),
    newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
    squares: document.querySelectorAll('[data-id="square"]'),
    modal: document.querySelector('[data-id="modal"]'),
    modalText: document.querySelector('[data-id="modal-text"]'),
    modalBtn: document.querySelector('[data-id="modal-btn"]'),
    turn: document.querySelector('[data-id="turn"]'),
  },

  state: {
    moves: [],
  },

  getGameStatus(moves) {
    const p1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.squareId);
    const p2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.squareId);

    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;

    winningPatterns.forEach((pattern) => {
      const p1Wins = pattern.every((v) => p1Moves.includes(v));
      const p2Wins = pattern.every((v) => p2Moves.includes(v));

      if (p1Wins) winner = 1;
      if (p2Wins) winner = 2;
    });

    return {
      status: moves.length === 9 || winner != null ? "complete" : "in-progress", // in-progress | complete
      winner: winner, // 1 | 2 | null
    };
  },

  // where we add our event listeners to the application
  init() {
    App.registerEventListeners();
  },
  registerEventListeners() {
    //menu toggling
    App.$.menu.addEventListener("click", (event) => {
      App.$.menuItems.classList.toggle("hidden");
    });

    //select reset button
    App.$.resetBtn.addEventListener("click", (event) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren());
    });

    //select new round
    App.$.newRoundBtn.addEventListener("click", (event) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren());
    });

    App.$.modalBtn.addEventListener("click", (event) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren());
      App.$.modal.classList.add("hidden");
    });

    //select squares
    App.$.squares.forEach((square) => {
      //iterates through each square on the board
      square.addEventListener("click", (event) => {
        // checks whether selected square is  valid
        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };
        if (hasMove(+square.id)) {
          return;
        }

        // Determine which player icon to add to the square
        const lastMove = App.state.moves.at(-1);
        const getNextPlayer = (playerId) => (playerId === 1 ? 2 : 1);
        const currentPlayer =
          App.state.moves.length === 0 ? 1 : getNextPlayer(lastMove.playerId);
        const nextPlayer = getNextPlayer(currentPlayer);

        const squareIcon = document.createElement("i");
        const turnIcon = document.createElement("i");
        const turnLabel = document.createElement("p");
        turnLabel.innerText = `Player ${nextPlayer}, you are up!`;

        if (currentPlayer === 1) {
          squareIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnLabel.classList = "turquoise";
        } else {
          squareIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnLabel.classList = "yellow";
        }

        App.$.turn.replaceChildren(turnIcon, turnLabel);

        //pushes move to the state
        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        // Marks correct icon on the board
        square.replaceChildren(squareIcon);

        // check if there is a winner or tie game
        const game = App.getGameStatus(App.state.moves);

        if (game.status == "complete") {
          App.$.modal.classList.remove("hidden");
          let message = "";
          if (game.winner) {
            message = `Player ${game.winner} wins!`;
          } else {
            message = "Tie game!";
          }
          App.$.modalText.textContent = message;
        }
      });
    });
  },
};

//confiquration array of the two players
const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];

// whenever the website loads it initializes
function init() {
  const view = new View();
  const store = new Store("live-t3-storage-key", players);

  function initView() {
    view.closeAll();
    view.clearMoves();
    view.setTurnIndicator(store.game.currentPlayer);
    view.updateScoreboard(
      store.stats.playerWithStats[0].wins,
      store.stats.playerWithStats[1].wins,
      store.stats.ties
    );
    view.initializeMoves(store.game.moves);
  }

  window.addEventListener("storage", () => {
    console.log("State changed from another tab");
    initView();
  });

  initView();

  // Resets the game
  view.bindGameResetEvent((event) => {
    //resets the game
    store.reset();
    initView();
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();
    initView();
  });

  view.bindPlayerMoveEvent((square) => {
    // check if the move is valid
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );
    if (existingMove) {
      return;
    }

    // place an icno of the current player in a square
    view.handlePlayerMove(square, store.game.currentPlayer);

    // advance to the next state by pushing a move to the moves array
    store.playerMove(+square.id);

    //check if there's a winner
    if (store.game.status.isComplete) {
      view.openModal(
        store.game.status.winner
          ? `${store.game.status.winner.name} wins!`
          : "Tie!"
      );
      return;
    }

    // set the next player's turn indicator
    view.setTurnIndicator(store.game.currentPlayer);
  });
}

window.addEventListener("load", init);
