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
        reject('rejection')
      }, val * 100)
    })
