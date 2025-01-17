import React, { useState } from "react";

const EditComponent = ({ categoryId, categoryName, onUpdate }) => {
  const [newCategoryName, setNewCategoryName] = useState(categoryName);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await onUpdate(categoryId, { name: newCategoryName });
      alert("Categoría actualizada con éxito");
    } catch (error) {
      console.error("Error actualizando la categoría:", error);
      alert("Hubo un error al actualizar la categoría.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        placeholder="Nuevo nombre de la categoría"
      />
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? "Actualizando..." : "Actualizar"}
      </button>
    </div>
  );
};

export default EditComponent;
