// Example starter JavaScript for disabling form submissions if there are invalid fields
;(function () {
    'use strict'
    window.addEventListener(
        'load',
        function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('needs-validation')
            var password = document.getElementById('form_password')
            var password__recheck = document.getElementById('form_password_recheck')

            function validatePassword() {
                if (password.value !== password__recheck.value) {
                    password__recheck.setCustomValidity('passwords do not match')
                } else {
                    password__recheck.setCustomValidity('')
                }
            }

            // Add password confirmation to signup form
            if (password && password__recheck) {
                password.addEventListener('input', validatePassword)
                password__recheck.addEventListener('input', validatePassword)
            }

            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener(
                    'submit',
                    function (event) {
                        if (form.checkValidity() === false) {
                            event.preventDefault()
                            event.stopPropagation()
                        }
                        form.classList.add('was-validated')
                    },
                    false
                )
            })
        },
        false
    )
})()
