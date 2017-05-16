function trainflow({
  promiseFns,
  ignoreErrors = true,
  onResolveCurrent = val => {},
  onFinished = () => {}
}) {
  const max = promiseFns.length
  let count = 0

  const appendError = (results, err) =>
    ignoreErrors ? results : [...results, err]
  const appendValue = (results, val) => [...results, val]
  const runPromiseFunc = (promiseFn, results = []) => {
    const isDone = ++count === max
    return promiseFn()
      .then(current => {
        const all = appendValue(results, current)
        onResolveCurrent({current, all})
        return isDone ? all : runPromiseFunc(promiseFns[count], all)
      })
      .catch(
        err =>
          isDone
            ? appendError(results, err)
            : runPromiseFunc(promiseFns[count], appendError(results, err))
      )
  }

  return runPromiseFunc(promiseFns[0])
}

module.exports = trainflow
