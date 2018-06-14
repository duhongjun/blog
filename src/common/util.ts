export function diffTime(time1: number) {
  return (time2: number) => {
    let seconds = Math.abs(time1 - time2) / 1000
    const days = Math.floor(seconds / (3600 * 24))
    seconds = seconds - days * 3600 * 24

    const hours = Math.floor(seconds / 3600)
    seconds = seconds - hours * 3600

    const minutes = Math.floor(seconds / 60)
    seconds = seconds - minutes * 60

    return {
      days,
      hours,
      minutes,
      seconds: parseInt(String(seconds), 10)
    }
  }
}

const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

export function prettyBytes(num: number) {
  if (!Number.isFinite(num)) {
    throw new TypeError(`Expected a finite number, got ${typeof num}: ${num}`)
  }

  const neg = num < 0

  if (neg) {
    num = -num
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B'
  }

  const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), UNITS.length - 1)
  const numStr = Number((num / Math.pow(1000, exponent)).toPrecision(3))
  const unit = UNITS[exponent]

  return (neg ? '-' : '') + numStr + ' ' + unit
}
