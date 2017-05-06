# sequential-promise
A tool to make sure a promise in a sequence is resolved before moving on to the next one

## Usage

```javascript
const promiseSequence = require('./index')

// Wrap the promise in a highter order function,
// to make sure it is not trying to resolve until we want
const getPromiseFnThatResolves = (val) =>
  () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(val)
      }, val * 1000)
    })

// Our array with higher order functions containing the promises
const promiseFns = [
    getPromiseFnThatResolves(2),
    getPromiseFnThatResolves(4),
    getPromiseFnThatResolves(0),
    getPromiseFnThatResolves(1),
    getPromiseFnThatResolves(5),
    getPromiseFnThatResolves(3)
  ]

promiseSequence({
  promiseFns, 
  ignoreErrors: // optional
  onResolveCurrent: ({current, all}) => console.log({current, all}), // optional
})
.then(result => console.log(result)) // [2, 4, 0, 1, 5, 3]

```