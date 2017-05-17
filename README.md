# trainflow
A tool to make sure a promise in a sequence is resolved before moving on to the next one

## Usage

```bash
yarn add trainflow # or good ol npm
```

```javascript
const promiseSequence = require('./index')

const getPromiseFnThatResolves = (val) =>
  () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(val)
      }, val * 1000)
    })

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
  ignoreErrors: true, // optional
  onResolveCurrent: val => console.log(val) // optional
})

```

See tests for more usage