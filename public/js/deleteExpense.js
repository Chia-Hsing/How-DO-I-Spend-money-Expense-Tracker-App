$(document).ready(
    $('.operator').on('click', '.delete', e => {
        const ExpenseId = $(e.currentTarget).siblings('#id').val()
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

        console.log(token)

        fetch(`/expense/delete/${ExpenseId}`, {
            credentials: 'same-origin',
            // attach the csrf token in header
            headers: {
                'CSRF-Token': token,
            },
            method: 'delete',
            redirect: 'follow',
        }).then(res => {
            const amount_value = $(e.currentTarget).parents('.operator').siblings('#amount').text().replace('$ ', '')
            const sum_value = $('.sum').text().replace('$ ', '')
            if (res.ok) {
                $(e.target)
                    .closest('.item')
                    .fadeOut(500, function () {
                        $(this).remove()
                    })
                $('.sum').text(`$ ${+sum_value - +amount_value}`)
                $('.sum').text() === '$ 0'
                    ? $('.items').append(
                          `<div class='item_empty'>
                            <span>You did not spend any money yet!</span>
                        </div>`
                      )
                    : ''
            }
        })
    })
)
