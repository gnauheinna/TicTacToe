const initialValue = {
  moves: [],
};

export default class Store {
  //private variable to store move arrays
  #state = initialValue;

  constructor(players) {
    this.players = players;
  }

  get game() {
    const state = this.#getState();

    const currentPlayer = this.players[state.moves.length % 2];

    return {
      moves: state.moves,
      currentPlayer,
    };
  }

  playerMove(squareId) {
    const state = this.#getState();

    const stateClone = structuredClone(state);
    // updates our state for us
    stateClone.moves.push({
      squareId,
      player: this.game.currentPlayer,
    });

    this.#saveState(stateClone);
  }

  #getState() {
    return this.#state;
  }

  #saveState(stateOrFn) {
    // a raw object state or a call function for previous value can be passed in
    const prevState = this.#getState();
    let newState;

    switch (typeof stateOrFn) {
      case "function":
        newState = stateOrFn(prevState);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:
        throw new Error("Invalid argument passed to saveState");
    }

    this.#state = newState;
  }
}
