// interfaces
import {IFib} from '../interfaces/fib-interface';
import {ICache, IFibList} from '../interfaces/cache-interface';

// types
import {BigInt} from '../types/types';


const readline = require('readline');
const EventEmitter = require('events');
const bigInt = require('big-integer');

class FibEmitter extends EventEmitter {};

export class Fib implements IFib {

  private _interval: number = 15;
  private _timerId: NodeJS.Timeout;
  private _fibEmitter: any;
  private _cache: ICache = {};
  private _fibs: IFibList = {};
  private _rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  constructor() {
  }

  public configure() {
    this._fibEmitter = new FibEmitter();

    this._fibEmitter.addListener('stopTimer', () => {
      clearInterval(this._timerId);
      this._timerId = null;
      console.log('>> Timer halted');
    });

    this._fibEmitter.addListener('startTimer', () => {
      this.startTimer(this._interval);
      console.log('>> Timer started');
    });

    this._fibEmitter.addListener('quit', () => {
      this.displayResults();
      console.log('>> Thanks for playing.');
      this._rl.close();
      this._fibEmitter.removeAllListeners();
      process.exit();
    });

    this.populateFibList();
  }

  public populateFibList() {
    let fibPrev: BigInt = bigInt.zero;
    let fibCurr: BigInt = bigInt.one;

    this._fibs[fibPrev] = true;
    this._fibs[fibCurr] = true;

    for (let i: number = 0; i < 999; ++i) {
      let newFib: BigInt = bigInt(fibPrev).add(fibCurr);
      this._fibs[newFib] = true;
      fibPrev = fibCurr;
      fibCurr = newFib;
    }
  };

  public displayResults() {
    const _this = this;
    const keysSorted = Object.keys(this._cache).sort(function (a, b) {
      return _this._cache[b] - _this._cache[a];
    });

    let outputString: string = '>> ';
    for (let k of keysSorted) {
      outputString += `${k}:${this._cache[k]} `;
    }
    console.log(`\n${outputString}`);
  }

  public startTimer(intervalMS: number) {
    this._timerId = setInterval(() => this.displayResults(), intervalMS);
  }

  public isFib(bigNum: BigInt): boolean {
    if (this._fibs[bigNum]) {
      return true;
    }
    return false;
  }

  public processNumber(bigNum: BigInt) {
    if (!this.isNumeric(bigNum)) {
      console.log('>> NOT NUMERIC');
      return;
    }

    if (this.isFib(bigNum)) {
      console.log('>> FIB');
    }

    if (!this._cache[bigNum]) {
      this._cache[bigNum] = 0;
    }
    this._cache[bigNum]++;
  }

  public isNumeric(userInput: string) {
    let num: number;
    if (typeof userInput === 'string' && !Number.isNaN(Number(userInput))) {
      num = Number(userInput);
    }

    return !isNaN(num);
  }

  public requestInput(msg: string) {
    this._rl.question(msg, (userInput: string) => {
      if (userInput === 'halt') {
        this._fibEmitter.emit('stopTimer');
        this.requestInput('\n'); // recurse
      }
      if (userInput === 'resume') {
        this._fibEmitter.emit('startTimer');
        this.requestInput('\n'); // recurse
      }
      if (userInput === 'quit') {
        this._fibEmitter.emit('quit');
      }
      if (this.isNumeric(userInput)) {
        this.processNumber(userInput);
        this.requestInput('>> Please enter a number:\n'); // recurse
      }
    });
  }

  public start() {
    this.configure();
    console.log('*** WELCOME TO FIB ***\n\n');
    this._rl.question('\n>> Please input the number of time in seconds between emitting numbers and their frequency:\n', (delaySec: string) => {
      this._interval = parseInt(delaySec, 10) * 1000;
      this._fibEmitter.emit('startTimer');
      this.requestInput('>> Please enter a number:\n');
    });
  }
}
