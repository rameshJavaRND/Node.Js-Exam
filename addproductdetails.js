
//using load event listener while page loads 
window.addEventListener('load', function() {
    let name = sessionStorage.getItem('loginedUserName');
    document.getElementById('logined-user-name').innerText = name;
    
    //when save button is clicked the callsaveproductAPI is called and the product details are collected based on the id.
    async function callsaveproductAPI() {
        const location = "localhost";
        const data = {
            "productName": document.getElementById('productName').value,
            "price": document.getElementById('price').value,
            "quantity": document.getElementById('quantity').value,
            "vendor": document.getElementById('vendor').value,
            "warranty": document.getElementById('warranty').value
        }
        //request uses the post method
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        };
        try {
            const fetchResponse = await fetch(`http://${location}:4000/api/productManagement/saveProduct/`, settings);
            const data = await fetchResponse.json();
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
            event.preventDefault();
            event.stopPropagation();
            // checking if form is valid
            if (form.checkValidity()) {
                callsaveproductAPI();
            }
            form.classList.add('was-validated');
        }, false);
    });
});