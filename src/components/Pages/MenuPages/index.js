import { FaEdit } from "react-icons/fa"; // Ícono para la edición
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { MenuContainer } from "../../Themes/MenuContainer";
import { themes } from "../../Themes/themes";
import API from "../../../API";
import Button from "../../Button";
import DeleteProduct from "../../Product/DeleteProduct";


//endpoint al que se llma    ///https://localhost:7119/Menu/menu-details/{menuId}
  // Example: Fetch a specific menu item by ID

  
const MenuPage = () => {
  const { menuName } = useParams();
  const theme = themes[menuName] || themes.default;
  const [menuDetails, setMenuDetails] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});
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

  const handleUpdateCategory = async (categoryName, updatedData) => {
    try {
      // Aquí puedes agregar lógica para actualizar el nombre de la categoría (si es necesario en tu backend)
      setMenuDetails((prevDetails) => ({
        ...prevDetails,
        sections: prevDetails.sections.map((section) => ({
          ...section,
          products: section.products.map((product) =>
            product.categoryName === categoryName
              ? { ...product, categoryName: updatedData.name }
              : product
          ),
        })),
      }));
    } catch (error) {
      console.error("Error updating category:", error);
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
        sections: prevDetails.sections.map((section) => ({
          ...section,
          products: section.products.map((product) =>
            product.id === productId
              ? { ...product, ...updatedProductData }
              : product
          ),
        })),
      }));

      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  if (!menuDetails) return <div>Cargando...</div>;

  const groupedProducts = selectedSection
  ? menuDetails.sections
      .filter((section) => section.id === selectedSection)
      .flatMap((section) => section.products)
      .reduce((acc, product) => {
        const categoryName = product.categoryName || "Sin categoria";  // Default to "Unknown" if category is undefined
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(product);
        console.log("Product category:", product.category);

        return acc;
      }, {})
  : {};


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
          {Object.keys(groupedProducts).map((categoryName) => {
  const categoryProducts = groupedProducts[categoryName];

  return (
    <div key={categoryName}>
      <h2>
        {editingCategory === categoryName ? (
          <>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button onClick={() => handleSaveCategory(categoryName)}>Guardar</button>
          </>
        ) : (
          <>
            {categoryName}{" "}
            <FaEdit
              style={{ cursor: "pointer" }}
              onClick={() => handleEditClick(categoryName, categoryName)}
            />
          </>
        )}
      </h2>
      <ul>
        {categoryProducts.map((product) => (
          <li key={product.id}>
            {editingProduct === product.id ? (
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
                <button onClick={() => handleSaveProduct(product.id)}>Guardar</button>
              </>
            ) : (
              <>
                <strong>{product.name}</strong> - ${product.price}
                <p>{product.description}</p>
                <FaEdit
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEditProduct(product)}
                />
                <DeleteProduct
                  productId={product.id}
                  onDeleteSuccess={(deletedProductId) => {
                    setMenuDetails((prevDetails) => ({
                      ...prevDetails,
                      sections: prevDetails.sections.map((section) => ({
                        ...section,
                        products: section.products.filter(
                          (p) => p.id !== deletedProductId
                        ),
                      })),
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
})}
          </div>
        )}
      </MenuContainer>
    </ThemeProvider>
  );
};

export default MenuPage;
/*  {selectedSection && (
          <div>
            <Button onClick={() => setSelectedSection(null)} label="Volver" />
            {Object.keys(groupedProducts).length > 0 ? (
              Object.keys(groupedProducts).map((categoryName) => {
                const categoryProducts = groupedProducts[categoryName];
                const categoryId = categoryProducts[0].category ? categoryProducts[0].category.id : "Unknown";


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
                              <DeleteProduct
                                productId={product.productId}
                                onDeleteSuccess={(deletedProductId) => {
                                  setMenuDetails((prevDetails) => ({
                                    ...prevDetails,
                                    sections: prevDetails.sections.map((section) => ({
                                      ...section,
                                      products: section.products.filter(
                                        (p) => p.productId !== deletedProductId
                                      ),
                                    })),
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
        )}*/