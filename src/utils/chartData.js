const getChartData = data => {
    let categories = {
        food: 0,
        entertaining: 0,
        clothes: 0,
        knowledge: 0,
        transportation: 0,
        home_supplies: 0,
        healthcare: 0,
        housing: 0,
    }
    data.forEach(item => {
        categories[item.category] += item.amount
    })

    return Object.values(categories)
}

module.exports = getChartData
