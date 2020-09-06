import {BigInt} from '../types/types';

export interface IFib {
  configure(): void;
  populateFibList(): void;
  displayResults(): void;
  startTimer(intervalMS: number): void;
  isFib(bigNum: BigInt): boolean;
  processNumber(bigNum: BigInt): void;
  isNumeric(userInput: string): boolean;
  requestInput(msg: string): void;
  start(): void;
}
