
//using load event listener while page loads 
window.addEventListener('load', function() {
    // calling the call signup API ,when New Register is clicked
    async function callsignUpAPI() {
        const location = "localhost";
        const data = {
            "name": document.getElementById('name').value,
            "contact": document.getElementById('contact').value,
            "email": document.getElementById('email').value,
            "username": document.getElementById('userName').value,
            "password": document.getElementById('password').value
        }
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        };
        try {
            const fetchResponse = await fetch(`http://${location}:4000/api/signup/`, settings);
            const data = await fetchResponse.json();
            sessionStorage.setItem('loginedUserName', data.user.name);
            document.location.href = "productdetails.html";

            return data;
        } catch (e) {
            
            return e;
        }
    };
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            // document.getElementById('invalid-credentials').style.display = 'none';
            let newUser = {};
            event.preventDefault();
            event.stopPropagation();
            // checking if form is valid
            if (form.checkValidity()) {
                callsignUpAPI();
            }
            form.classList.add('was-validated');
        }, false);
    });
}, false);
