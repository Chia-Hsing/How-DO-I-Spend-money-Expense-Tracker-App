$(document).ready(
    $('.operator').on('click', '.edit', e => {
        const ExpenseId = $(e.currentTarget).siblings('#id').val()

        fetch(`/expense/edit/${ExpenseId}`, {
            method: 'patch',
        })
    })
)
