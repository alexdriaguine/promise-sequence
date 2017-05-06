function promiseSequence({
  promiseFns, 
  ignoreErrors = true, 
  onResolveCurrent = (val) => {}, 
  onFinished = () => {}
}) {
  let max = promiseFns.length
  let count = 0

  function runPromiseFunc(promiseFn, results = []) {
    count++
    return promiseFn()
      .then(val => { 
        onResolveCurrent({current: val, all: [...results, val]})
        return count === max 
          ? (onFinished(), [...results, val]) 
          : runPromiseFunc(promiseFns[count], [...results, val])
      })
      .catch(err => {
        if (ignoreErrors) return runPromiseFunc(promiseFns[count], results)
        count === max
          ? (onFinished(), [...results, err])
          : runPromiseFunc(promiseFns[count], [...results, err])
      })
  }

  return runPromiseFunc(promiseFns[0])
}

module.exports = promiseSequence
