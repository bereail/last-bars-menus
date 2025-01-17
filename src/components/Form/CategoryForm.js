import React, { useState } from "react";
import Button from "../../Button";

const CategoryForm = ({ category, onSubmit }) => {
    const [name, setName] = useState(category?.name || "");
    const [sectionId, setSectionId] = useState(category?.sectionId || "");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ id: category.id, name, sectionId });
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Sección ID:
          <input
            type="number"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
          />
        </label>
        <Button type="submit" label="Guardar" />
      </form>
    );
  };
  
  export default CategoryForm;