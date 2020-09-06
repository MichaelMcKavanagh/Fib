import {Fib} from '../../src/app/fib';
import {IFib} from '../../src/interfaces/fib-interface';
import {BigInt} from '../../src/types/types';

const expect = require('chai').expect;

describe('Fib', function () {

  let fib: IFib;

  beforeEach(async function () {
    fib = new Fib();
  });

  it('should exist', function () {
    expect(fib).to.be.ok;
  });

  it('should return true when checking for a valid fib number', function () {
    fib.populateFibList();
    const validFib: BigInt = '1';
    expect(fib.isFib(validFib)).to.be.true;
  });

  it('should return false when checking for an invalid fib number', function () {
    fib.populateFibList();
    const invalidFib: BigInt = '33';
    expect(fib.isFib(invalidFib)).to.be.false;
  });

});
