function calculateLoseDeal (TLprice, Cprice,  trend) {
  if (TLprice > Cprice && trend === 'high') {
    const diff = (+TLprice - 0.99 * Cprice) / (Math.random() * (20 - 12) + 12)
    return +TLprice - diff
  }
  if (TLprice > Cprice && trend === 'low') {
    if (trend === 'low') {
      const diff = (+TLprice - 0.97 * Cprice) / (Math.random() * (20 - 12) + 12)
      return +TLprice + diff
    }
  }
  return TLprice

}

module.exports = calculateLoseDeal;