import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNumbers = async (url) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:8008/numbers', {
        params: { url: [url] }
      });
      setNumbers(response.data.numbers);
    } catch (error) {
      setError('Error fetching numbers');
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Merged Numbers</h1>
      <button onClick={() => fetchNumbers("http://20.244.56.144/test/primes")}>Fetch Prime Numbers</button>
      <button onClick={() => fetchNumbers("http://20.244.56.144/test/fibo")}>Fetch Fibonacci Numbers</button>
      <button onClick={() => fetchNumbers("http://20.244.56.144/test/rand")}>Fetch Random Numbers</button>
      <button onClick={() => fetchNumbers("http://20.244.56.144/test/even")}>Fetch Even Numbers</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <ul>
          {numbers.length > 0 ? (
            numbers.map((number, index) => (
              <li key={index}>{number}</li>
            ))
          ) : (
            <p>No numbers found.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default App;
