import { FaEdit } from "react-icons/fa"; // Importa un ícono para la edición
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { MenuContainer } from "../../Themes/MenuContainer";
import { themes } from "../../Themes/themes";
import API from "../../../API";
import Button from "../../Button";
import DeleteProduct from "../../Product/DeleteProduct";

const MenuPage = () => {
  const { menuName } = useParams();
  const theme = themes[menuName] || themes.default;
  const [menuDetails, setMenuDetails] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null); // Estado para manejar la edición
  const [newCategoryName, setNewCategoryName] = useState(""); // Nuevo nombre de la categoría
  const [editingProduct, setEditingProduct] = useState(null); // Estado para manejar la edición de productos
  const [updatedProduct, setUpdatedProduct] = useState({}); // Nuevo estado del producto
  const menuId = localStorage.getItem("selectedMenuId");

  useEffect(() => {
    document.title = menuName;

    const fetchMenuDetails = async () => {
      try {
        if (!menuId) {
          throw new Error("No menu ID found");
        }

        const data = await API.fetchMenuItem(menuId);
        setMenuDetails(data);
      } catch (error) {
        console.error("Error fetching menu details:", error);
      }
    };

    fetchMenuDetails();
  }, [menuName, menuId]);

  const handleUpdateCategory = async (categoryId, updatedData) => {
    console.log("Updating category:", categoryId, updatedData); // Debug log
    try {
      const updatedCategory = await API.updateCategoryItem(categoryId, updatedData);
      console.log("Updated category response:", updatedCategory); // Debug log
  
      setMenuDetails((prevDetails) => ({
        ...prevDetails,
        products: prevDetails.products.map((product) =>
          product.category.categoryId === categoryId
            ? {
                ...product,
                category: { ...product.category, categoryName: updatedCategory.name },
              }
            : product
        ),
      }));
    } catch (error) {
      console.error("Error updating category:", error.message);
    }
  };

  const handleEditClick = (categoryId, currentName) => {
    setEditingCategory(categoryId);
    setNewCategoryName(currentName);
  };

  const handleSaveCategory = async (categoryId) => {
    try {
      await handleUpdateCategory(categoryId, { name: newCategoryName });
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };


  const handleEditProduct = (product) => {
    setEditingProduct(product.productId);
    setUpdatedProduct({
      name: product.productName,
      price: product.productPrice,
      description: product.productDescription,
    });
  };

  const handleSaveProduct = async (productId) => {
    try {
      const updatedData = {
        name: updatedProduct.name,
        price: updatedProduct.price,
        description: updatedProduct.description,
      };

      const updatedProductData = await API.updateProductItem(productId, updatedData);

      setMenuDetails((prevDetails) => ({
        ...prevDetails,
        products: prevDetails.products.map((product) =>
          product.productId === productId
            ? { ...product, ...updatedProductData } // Actualiza solo el producto modificado
            : product
        ),
      }));
      
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  if (!menuDetails) return <div>Cargando...</div>;

  const filteredProducts = selectedSection
    ? menuDetails.products.filter(
        (product) => product.category.section.sectionId === selectedSection
      )
    : [];

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const categoryName = product.category.categoryName;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {});

  return (
    <ThemeProvider theme={theme}>
      <MenuContainer>
        <h1>{menuDetails.menuName}</h1>

        {!selectedSection && (
          <div>
            <button onClick={() => setSelectedSection(2)}>Para Tomar</button>
            <button onClick={() => setSelectedSection(3)}>Para Comer</button>
          </div>
        )}

        {selectedSection && (
          <div>
            <Button onClick={() => setSelectedSection(null)} label="Volver" />
            {Object.keys(groupedProducts).length > 0 ? (
              Object.keys(groupedProducts).map((categoryName) => {
                const categoryProducts = groupedProducts[categoryName];
                const categoryId =
                  categoryProducts[0].category.categoryId;

                return (
                  <div key={categoryId}>
                    <h2>
                      {editingCategory === categoryId ? (
                        <>
                          <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                          />
                          <button onClick={() => handleSaveCategory(categoryId)}>
                            Guardar
                          </button>
                        </>
                      ) : (
                        <>
                          {categoryName}{" "}
                          <FaEdit
                            style={{ cursor: "pointer" }}
                            onClick={() => handleEditClick(categoryId, categoryName)}
                          />
                        </>
                      )}
                    </h2>
                    <ul>
  {categoryProducts.map((product) => (
    <li key={product.productId}>
      {editingProduct === product.productId ? (
        <>
          <input
            type="text"
            value={updatedProduct.name}
            onChange={(e) =>
              setUpdatedProduct((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
          <input
            type="number"
            value={updatedProduct.price}
            onChange={(e) =>
              setUpdatedProduct((prev) => ({
                ...prev,
                price: e.target.value,
              }))
            }
          />
          <input
            type="text"
            value={updatedProduct.description}
            onChange={(e) =>
              setUpdatedProduct((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
          <button onClick={() => handleSaveProduct(product.productId)}>
            Guardar
          </button>
        </>
      ) : (
        <>
          <strong>{product.productName}</strong> - ${product.productPrice}
          <p>{product.productDescription}</p>
          <FaEdit
            style={{ cursor: "pointer" }}
            onClick={() => handleEditProduct(product)}
          />
          {/* Agregar el botón de eliminar */}
          <DeleteProduct
            productId={product.productId}
            onDeleteSuccess={(deletedProductId) => {
              setMenuDetails((prevDetails) => ({
                ...prevDetails,
                products: prevDetails.products.filter(
                  (p) => p.productId !== deletedProductId
                ),
              }));
            }}
          />
        </>
      )}
    </li>
  ))}
</ul>

                  </div>
                );
              })
            ) : (
              <p>No hay productos disponibles en esta sección.</p>
            )}
          </div>
        )}
      </MenuContainer>
    </ThemeProvider>
  );
};

export default MenuPage;