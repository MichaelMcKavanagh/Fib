import {Fib} from './fib';

async function start() {
  const fib = new Fib();
  await fib.start();
}

start();
