$(document).ready(
    $('.search_date').on('change', () => {
        const date = $('.search_date').val()
        const dateSearchParam = `?date=${date}`
        const url = location.href

        let appURL = new URL(url)

        appURL.search = dateSearchParam
        location.href = appURL.href
    })
)
