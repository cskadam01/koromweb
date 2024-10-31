import React, { useState } from 'react';


function Login(){
    const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/api/add-name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
          setName('');  // Törli az input mezőt sikeres mentés után
        } else {
          setMessage('Error adding name');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('Error adding name');
      });
  };

  return (
    <div>
      <h2>Add a Name</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name"
        />
        <button type="submit">Add Name</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}




export default Login