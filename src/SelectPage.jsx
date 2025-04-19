import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SelectPage.css';


const SelectPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.29.11:4000/search?q=${searchTerm}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    navigate(`/details/${item['NEW NO']}`, { state: { searchData: item } });
  };

  return (
    <div className="page">
      <input
        className="search-container"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter search term"
      />
      <button className="search-container-button" onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : <i className="fa fa-search"></i>}
      </button>
      {searchResult && (
        <div>
          <ul>
            {searchResult.map((item) => (
              <li key={item._id} onClick={() => handleSelect(item)}>
                <div><strong>NO:</strong> {item['NEW NO']}</div>
                <div><strong>OFFICE Name:</strong> {item['OFFICE NAME']}</div>
                <div><strong>NAME:</strong> {item['OWNER NAME']}</div>
                <div><strong>City and Taluka:</strong> {item['CITY AND TALUKA']}</div>
                <div><strong>Phone No:</strong> {item['PHONE NO']}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectPage;
