
// Category Component
import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import Product from "../Product/Product";

const Category = ({ categoryName, categoryId, onUpdateCategory, products }) => {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(categoryName);

  const handleSave = () => {
    onUpdateCategory(categoryId, { name: newName });
    setEditing(false);
  };

  return (
    <div>
      <h2>
        {editing ? (
          <>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button onClick={handleSave}>Guardar</button>
          </>
        ) : (
          <>
            {categoryName} <FaEdit style={{ cursor: "pointer" }} onClick={() => setEditing(true)} />
          </>
        )}
      </h2>
      <ul>
        {products.map((product) => (
          <Product
            key={product.productId}
            product={product}
            onUpdateProduct={(productId, updatedData) =>
              onUpdateCategory(categoryId, {
                ...updatedData,
                products: products.map((prod) =>
                  prod.productId === productId ? { ...prod, ...updatedData } : prod
                ),
              })
            }
          />
        ))}
      </ul>
    </div>
  );
};

export default Category;
