// Product Component
import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";

const Product = ({ product, onUpdateProduct }) => {
  const [editing, setEditing] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: product.productName,
    price: product.productPrice,
    description: product.productDescription,
  });

  const handleSave = () => {
    onUpdateProduct(product.productId, updatedProduct);
    setEditing(false);
  };

  return (
    <li>
      {editing ? (
        <>
          <input
            type="text"
            value={updatedProduct.name}
            onChange={(e) =>
              setUpdatedProduct((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <input
            type="number"
            value={updatedProduct.price}
            onChange={(e) =>
              setUpdatedProduct((prev) => ({ ...prev, price: e.target.value }))
            }
          />
          <textarea
            value={updatedProduct.description}
            onChange={(e) =>
              setUpdatedProduct((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
          <button onClick={handleSave}>Guardar</button>
        </>
      ) : (
        <>
          <strong>{product.productName}</strong> - ${product.productPrice}
          <p>{product.productDescription}</p>
          <FaEdit
            style={{ cursor: "pointer" }}
            onClick={() => setEditing(true)}
          />
        </>
      )}
    </li>
  );
};

export default Product;