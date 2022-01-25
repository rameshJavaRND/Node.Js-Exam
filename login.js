
//using load event listener while page loads 
window.addEventListener('load', function() {
    // calling the call login API ,when login button is clicked
    async function callLoginAPI() {
        const location = "localhost";
        const data = {
            "username": document.getElementById('userName').value,
            "password": document.getElementById('password').value
        }
        //Request object for login page has method as post and json format 
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            //used stringfy to change the data
            body: JSON.stringify(data)
        };
         // await till fetch the response from the url
        try {
            const fetchResponse = await fetch(`http://${location}:4000/api/signin/`, settings);
            const data = await fetchResponse.json();
            sessionStorage.setItem('loginedUserName', data.user.name);
            document.location.href = "productdetails.html";

            return data;
        } // return error if invalid credential were provided 
        catch (e) {
            document.getElementById('invalid-credentials').style.display = 'block';

            return e;
        }
    };
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            document.getElementById('invalid-credentials').style.display = 'none';
            let newUser = {};
            event.preventDefault();
            event.stopPropagation();
            // checking if form is valid and call the loginAPI 
            if (form.checkValidity()) {
                callLoginAPI();
            }
            form.classList.add('was-validated');
        }, false);
    });
}, false);
