const payload = {
  user: {
    email: 'max@mustermann.net',
    // brainet_tag: 'randomuser1234',
    plain_password: '1234',
  },
};

fetch('https://backmind.icinoxis.net/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
})
  .then((response) => response.json())
  .then((data) => console.log(data));

/*
{
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmRjYTk1ZjEzYTNjNGZmMTg3Y2M0NzQiLCJpYXQiOjE3MjU3Mzg1MTcsImV4cCI6MTcyNTgyNDkxN30.wo6mTQItZhJ4k_EuoK22dO1_0yRFVm1tuZgypTzFZSw'
}
*/
