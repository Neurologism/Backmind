const payload = {
  user: {
    email: 'max@mustermann.net',
    brainet_tag: 'randomuser1234',
    plain_password: '1234',
  },
};

fetch('https://backmind.icinoxis.net/api/auth/register', {
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
  message: 'User registered successfully',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmRjYTk1ZjEzYTNjNGZmMTg3Y2M0NzQiLCJpYXQiOjE3MjU3MzczMTEsImV4cCI6MTcyNTgyMzcxMX0.fNfi1yZuVa_XHljGPcOXktbsBAzT3ahRSktLvolRQns'
}
*/
