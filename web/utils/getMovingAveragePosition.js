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

  // const avg = positions.reduce(
  //   (prev, curr, index, list) => {
  //     const latAvg = (prev.lat + curr.lat) / 2
  //     const lonAvg = (prev.lon + curr.lon) / 2
  //     return { lat: latAvg, lon: lonAvg }
  //   },
  //   { lat: 0, lon: 0 },
  // )

  return avg
}

const getMovingAveragePosition = (positions = []) => {
  // if (positions.length > 0) {
  //   return positions[positions.length - 1]
  // }
  // return null
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

module.exports = {
  getMovingAveragePosition,
}
