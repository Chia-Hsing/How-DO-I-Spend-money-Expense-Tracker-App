$(document).ready(
    $('.operator').on('click', '.delete', e => {
        const ExpenseId = $('#delete').val()
        const url = new URL(location.href)
        const params = url.searchParams
        let date
        for (let i of params.entries()) {
            date = i[1]
        }
        fetch(`/expense/delete/${ExpenseId}`, {
            method: 'delete',
        }).then(res => {
            console.log(res)
            fetch(`/expense?date=${date}`)
        })
    })
)
