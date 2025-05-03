import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import './SearchPage.css';
const apiUrl = process.env.REACT_APP_BACKENDURL;
const SearchPage = () => {
  const { result } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchResult, setSearchResult] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', group: '' });

  const handleBack = () => navigate('/');

  const DataSend = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before submitting.');
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber: result, cartItems })
      });
      if (!response.ok) throw new Error('Network response was not ok');
      navigate('/');
    } catch (error) {
      alert('Something went wrong while submitting data.');
      console.error(error);
    }
  };

  const addToCart = (product, action) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      const index = updatedItems.findIndex((item) => item.ProductId === product.ProductId);
      if (action === 'increment') {
        index !== -1 ? updatedItems[index].quantity++ : updatedItems.push({ ...product, quantity: 1 });
      } else if (action === 'decrement' && index !== -1) {
        updatedItems[index].quantity--;
        if (updatedItems[index].quantity <= 0) updatedItems.splice(index, 1);
      }
      return updatedItems;
    });
  };

  const fetchProductList = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/productlist`);
      const data = await response.json();
      setSearchResult(data);
      setOriginalData(data);
    } catch (error) {
      alert('Error fetching product list.');
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value) {
      setSearchResult(originalData);
      return;
    }
    const regex = new RegExp(value, 'i');
    setSearchResult(originalData.filter((p) => regex.test(p['Product Name']) || regex.test(p['Group'])));
  };

  const handleAddProduct = async () => {
    try {
      const updatedResponse = await fetch(`${apiUrl}/productlist`);
      const products = await updatedResponse.json(); // Only read once

      const response = await fetch(`${apiUrl}/addproduct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ProductId: products.length + 1,
          name: newProduct.name,
          price: newProduct.price,
          group: newProduct.group,
        }),
      });

      if (!response.ok) throw new Error('Failed to add product');

      // Reset form and close modal
      setShowModal(false);
      setNewProduct({ name: '', price: '', group: '' });

      // Refresh product list after adding
      fetchProductList();

    } catch (error) {
      console.error('Error adding product:', error);
      alert('Something went wrong while adding the product.');
    }
  };

  return (
    <div className="page">
      <div className="button-container">
        <button className="back-button" onClick={handleBack} disabled={loading}>← Back</button>
        <button className="submit-button" onClick={DataSend} disabled={loading}>Submit</button>
        <button className="add-button" onClick={() => setShowModal(true)}>Add New Product</button>
      </div>

      <p>Account Number: {result}</p>

      <input
        className='search-container'
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search product..."
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="product-list">
          {searchResult?.map((product, index) => (
            <ProductCard
              key={index}
              product={product}
              addToCart={addToCart}
              quantity={cartItems.find((item) => item.ProductId === product.ProductId)?.quantity || 0}
            />
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Product</h2>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Group"
              value={newProduct.group}
              onChange={(e) => setNewProduct({ ...newProduct, group: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <div className="modal-buttons">
              <button onClick={handleAddProduct}>Submit</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
