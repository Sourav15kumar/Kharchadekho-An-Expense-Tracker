
// document.getElementById('loginForm').addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const formData = new FormData(e.target);
//   const data = Object.fromEntries(formData.entries());

//   const res = await fetch('/login', {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify(data)
//   });

//   const result = await res.json();
//   if (result.success) window.location.href = '/dashboard.html';
//   else alert('Login failed');
// });

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = this.username.value;
  const password = this.password.value;

  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    console.log(data); 

    if (data.success) {
      window.location.href = '/dashboard.html';
    } else {
      alert('Login failed');
    }
  })
  .catch(err => {
    console.error('Error:', err);
    alert('Something went wrong');
  });
});
