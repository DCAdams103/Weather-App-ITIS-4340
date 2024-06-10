import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState('');

  const fetchData = (value) => {
    fetch(`https://api.api-ninjas.com/v1/city?name=${value}`, {
      headers: {
        'X-Api-Key': 'tOVH0xmjF27hlAMEosn73Q==g7TpEO2b4VvVyIsE'
      }
    })
      .then((response) => response.json())
      .then((json) => {
        
        setResults(json);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Search for a city or location"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};