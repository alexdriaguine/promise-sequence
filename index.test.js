// @ts-nocheck
const promiseSequence = require('./index')

test('returns an array with the right order', done => {
  const expected = [2, 4, 0, 1, 5, 3]
  const promiseFns = getPromiseFns(expected)

  return promiseSequence({promiseFns})
    .then(actual => expect(JSON.stringify(actual)).toBe(JSON.stringify(expected)))
    .then(() => done())
})

test('actually waits for a promise to resolve before moving on', done => {
  const expected = [2, 4, 0, 1, 5, 3]
  const promiseFns = getPromiseFns(expected)

  function onResolveCurrent({current, all}) {
    const allExpected = expected.slice(0, expected.indexOf(current) + 1)
    expect(JSON.stringify(all)).toBe(JSON.stringify(allExpected))
  }

  promiseSequence({promiseFns, onResolveCurrent})
    .then(actual => expect(JSON.stringify(actual)).toBe(JSON.stringify(expected)))
    .then(() => done())
})

test('ignores rejections when ignoreErrors is true', done => {
  const expected = [2, 4, 0, 5, 3]
  const promiseFns = [
    getPromiseFnThatResolves(2),
    getPromiseFnThatResolves(4),
    getPromiseFnThatResolves(0),
    getPromiseFnThatRejects(1),
    getPromiseFnThatResolves(5),
    getPromiseFnThatResolves(3)
  ]

  return promiseSequence({promiseFns, ignoreErrors: true})
    .then(actual => expect(JSON.stringify(actual)).toBe(JSON.stringify(expected)))
    .then(() => done())
})

test('has an error obj when ignoreErrors is false', done => {
  const expected = [2, 4, 0, {error: 'rejected'},  5, 3]
  const promiseFns = [
    getPromiseFnThatResolves(2),
    getPromiseFnThatResolves(4),
    getPromiseFnThatResolves(0),
    getPromiseFnThatRejects(1),
    getPromiseFnThatResolves(5),
    getPromiseFnThatResolves(3)
  ]

  return promiseSequence({promiseFns, ignoreErrors: false})
    .then(actual => expect(JSON.stringify(actual)).toBe(JSON.stringify(expected)))
    .then(() => done())
})


/**
 * Helpers
 */

const getPromiseFns = (values) => values.map(value =>
  getPromiseFnThatResolves(value)
)


const getPromiseFnThatResolves = (val) =>
  () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(val)
      }, val * 100)
    })

const getPromiseFnThatRejects = (val) =>
  () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject({error: 'rejected'})
      }, val * 100)
    })
