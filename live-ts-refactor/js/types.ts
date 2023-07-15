export type Player = {
  id: number;
  name: string;
  iconClass: string;
  colorClass: string;
};

export type Move = {
  squareId: number;
  player: Player;
};

export type GameStatus = {
  isComplete: boolean;
  winner: Player;
};

export type Game = {
  moves: Move[];
  status: GameStatus;
};

export type GameState = {
  currentGameMoves: Move[];
  history: {
    currentRoundGames: Game[];
    allGames: Game[];
  };
};

/**
 *  Table Types
 *
 */

export interface IColumn {
  id:
    | "Student ID"
    | "Student Name"
    | "Class ID"
    | "Class Name"
    | "Semester"
    | "Final Grade";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}
