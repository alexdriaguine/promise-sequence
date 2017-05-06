const promiseSequence = require('./index')

const getPromiseFnThatResolves = (val) =>
  () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(val)
      }, val * 1000)
    })

const getPromiseFnThatRejects = (val) =>
  () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('rejection')
      }, val * 100)
    })

const promiseFns = [
    getPromiseFnThatResolves(2),
    getPromiseFnThatResolves(4),
    getPromiseFnThatResolves(0),
    getPromiseFnThatResolves(1),
    getPromiseFnThatResolves(5),
    getPromiseFnThatResolves(3)
  ]

promiseSequence({promiseFns, onResolveCurrent: val => console.log(val), onFinished: () => console.log('done')})