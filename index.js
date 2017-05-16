function promiseSequence({
  promiseFns, 
  ignoreErrors = true, 
  onResolveCurrent = (val) => {}, 
  onFinished = () => {}
}) {
  let count = 0

  const runPromiseFunc = (promiseFn, results = []) => (
    count++,
    promiseFn()
      .then(val => (onResolveCurrent({current: val, all: [...results, val]}),
        count === promiseFns.length 
          ? (onFinished(), [...results, val]) 
          : runPromiseFunc(promiseFns[count], [...results, val])
        )
      )
      .catch(err => count === promiseFns.length
        ? (onFinished(), (ignoreErrors ? results : [...results, err])) 
        : runPromiseFunc(promiseFns[count], (ignoreErrors ? results : [...results, err]))
      )
  )
  return runPromiseFunc(promiseFns[0])
}

module.exports = promiseSequence