import React, { useState } from 'react';

const ProductCard = ({ product, addToCart }) => {
  const [quantity, setQuantity] = useState(0);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
    addToCart(product, 'increment');
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      addToCart(product, 'decrement');
    }
  };

  return (
    <div className="product-card">
      <h2>{product.name}</h2>
      <p>Price: RS{product.price}</p>
      <div>
        <button onClick={handleDecrement}>-</button>
        <span>{quantity}</span>
        <button onClick={handleIncrement}>+</button>
      </div>
    </div>
  );
};

export default ProductCard;
// ProductCard.jsx

// import React from 'react';

// const ProductCard = ({ product, addToCart, quantity }) => {
//   const handleIncrement = () => {
//     addToCart(product, 'increment');
//   };

//   const handleDecrement = () => {
//     addToCart(product, 'decrement');
//   };

//   return (
//     <div className="product-card">
//       <h2>{product.name}</h2>
//       <p>Price: RS {product.Price}</p>
//       <div>
//         <button onClick={handleDecrement}>-</button>
//         <span>{quantity}</span>
//         <button onClick={handleIncrement}>+</button>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

