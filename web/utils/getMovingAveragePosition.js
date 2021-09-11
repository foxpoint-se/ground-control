const countPositions = 20

const getAverage = (positions) => {
  const lats = positions.map((p) => p.lat)
  const lons = positions.map((p) => p.lon)

  const latSum = lats.reduce((total, num) => total + num)
  const lonSum = lons.reduce((total, num) => total + num)

  const latAvg = latSum / positions.length
  const lonAvg = lonSum / positions.length

  const avg = {
    lat: latAvg,
    lon: lonAvg,
  }

  return avg
}

export const getMovingAveragePosition = (positions = []) => {
  if (positions.length === 0) {
    return null
  }
  if (positions.length === 1) {
    return positions[0]
  }
  if (positions.length < countPositions) {
    return getAverage(positions)
  }
  return getAverage(positions.slice(-countPositions))
}

export const getMovingAveragePositions = (positions = []) => {
  const avgs = positions.map((_, i) => {
    const positionsToThisPoint = positions.slice(0, i + 1)
    return getMovingAveragePosition(positionsToThisPoint)
  })
  return avgs
}
