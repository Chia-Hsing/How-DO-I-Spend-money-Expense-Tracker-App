$(document).ready(
    $('.operator').on('click', '.delete', e => {
        const ExpenseId = $('#delete').val()

        fetch(`/expense/delete/${ExpenseId}`, {
            method: 'delete',
        }).then(res => {
            console.log(res)
        })
    })
)
