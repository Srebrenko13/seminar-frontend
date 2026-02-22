export enum GamePhase {
  COUNTDOWN = 'COUNTDOWN',
  QUESTION = 'QUESTION',
  ROUND_RESULT = 'ROUND_RESULT',
  GAME_END = 'GAME_END',
}

export interface Answer {
  answerId: number;
  content: string;
}

export interface QuestionData {
  index: number;
  type: string;
  question: string;
  answers: Answer[];
  activationTime: number;
  activationDelay: number;
  duration: number;
}

export interface ResultData {
  playerOne: string;
  playerTwo: string;
  scoreOne: number;
  scoreTwo: number;
  correctAnswerId: number;
}
