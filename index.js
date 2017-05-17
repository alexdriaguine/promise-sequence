const appendError = ({ignoreErrors, res, err}) =>
  ignoreErrors ? res : [...res, err]

const appendValue = ({res, current}) => [...res, current]

function trainflow({
  fns,
  ignoreErrors = true,
  onResolveCurrent = val => {},
  onFinished = () => {}
}) {
  const max = fns.length
  let count = 0

  const run = (fn, res = []) => {
    const isDone = ++count === max
    const appendValue = (res, val) => [...res, val]
    const handleError = err =>
      isDone
        ? appendError({ignoreErrors, res, err})
        : run(
            fns[count],
            appendError({ignoreErrors, res, err})
          )

    const handleSuccess = current => {
      const all = appendValue({res, current})
      onResolveCurrent({current, all})
      return isDone ? all : run(fns[count], all)
    }

    return fn().then(handleSuccess).catch(handleError)
  }

  return run(fns[0])
}

module.exports = trainflow
