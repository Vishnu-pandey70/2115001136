const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 8008;

const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIwNzc3MDA5LCJpYXQiOjE3MjA3NzY3MDksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImVlZThkNmZlLWI2ZGYtNGQxOS1hYjM4LTQzNzkzNDFiMTZiMCIsInN1YiI6InZpc2hudXBhbmRleTkyNTgwQGdtYWlsLmNvbSJ9LCJjb21wYW55TmFtZSI6ImdvTWFydCIsImNsaWVudElEIjoiZWVlOGQ2ZmUtYjZkZi00ZDE5LWFiMzgtNDM3OTM0MWIxNmIwIiwiY2xpZW50U2VjcmV0IjoiUFJKVE9Ia1hTZG1qeWxaUyIsIm93bmVyTmFtZSI6IlZpc2hudSBQYW5kZXkiLCJvd25lckVtYWlsIjoidmlzaG51cGFuZGV5OTI1ODBAZ21haWwuY29tIiwicm9sbE5vIjoiMjExNTAwMTEzNiJ9.EtbCygxzodGGd8X5kcyWInzexcQZqgOVvORYRF586WI";

app.use(cors());

app.get('/numbers', async (req, res) => {
  try {
    let { url } = req.query;

    if (!Array.isArray(url)) {
      url = [
        "http://20.244.56.144/test/primes",
        "http://20.244.56.144/test/fibo",
        "http://20.244.56.144/test/rand",
        "http://20.244.56.144/test/even"
      ];
    }

    const numbers = [];

    const requests = url.map(async (url) => {
      try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${BEARER_TOKEN}`
          }
        });
        if (response.status === 200) {
          const { numbers: urlNumbers } = response.data;
          numbers.push(...urlNumbers);
        } else {
          console.error(`Error retrieving numbers from ${url}: ${response.statusText}`);
        }
      } catch (error) {
        if (error.response) {
          console.error(`Error retrieving numbers from ${url}: ${error.response.status} ${error.response.statusText}`);
        } else if (error.request) {
                    console.error(`Error retrieving numbers from ${url}: No response received`);
        } else {
          console.error(`Error retrieving numbers from ${url}: ${error.message}`);
        }
      }
    });

    await Promise.all(requests);
    const mergedNumbers = Array.from(new Set(numbers)).sort((a, b) => a - b);

    res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error(`Error processing request: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
