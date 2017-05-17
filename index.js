function trainflow({
  promiseFns,
  ignoreErrors = true,
  onResolveCurrent = val => {},
}) {
  const max = promiseFns.length
  let count = 0

  const run = (fn, res = []) => {
    const isDone = ++count === max
    const appendValue = (res, val) => [...res, val]
    const appendError = (res, err) => (ignoreErrors ? res : [...res, err])

    const handleError = err =>
      isDone ? appendError(res, err) : run(promiseFns[count], appendError(res, err))
      
    const handleSuccess = current => {
      const all = appendValue(res, current)
      onResolveCurrent({current, all})
      return isDone ? all : run(promiseFns[count], all)
    }

    return fn().then(handleSuccess).catch(handleError)
  }

  return run(promiseFns[0])
}

module.exports = trainflow
