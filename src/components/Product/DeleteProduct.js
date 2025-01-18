import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import PropTypes from "prop-types";
import API from "../../API";

const DeleteProduct = ({ productId, onDeleteSuccess }) => {
  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (!confirmDelete) return;

    try {
      const response = await API.deleteProductItem(productId);
      if (response.success) {
        alert("Producto eliminado exitosamente.");
        if (onDeleteSuccess) {
          onDeleteSuccess(productId); // Actualizar la lista en la página principal
        }
      } else {
        alert("Error al eliminar el producto: " + response.message);
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Hubo un error al intentar eliminar el producto.");
    }
  };

  return (
    <button className="delete-product-button" onClick={handleDelete}>
      <FaTrashAlt /> Eliminar
    </button>
  );
};

DeleteProduct.propTypes = {
  productId: PropTypes.number.isRequired,
  onDeleteSuccess: PropTypes.func, // Opcional, para actualizar la lista
};

export default DeleteProduct;
