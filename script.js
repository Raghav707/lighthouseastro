document.getElementById('appointment-form').addEventListener('submit', function (e) {
    e.preventDefault();  // Prevent form from submitting immediately

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let date = document.getElementById('date').value;
    let time = document.getElementById('time').value;

    if (name === '' || email === '' || date === '' || time === '') {
        alert('Please fill all the fields!');
    } else {
        alert(`Thank you ${name}! Your appointment is booked for ${date} at ${time}.`);
    }
});
