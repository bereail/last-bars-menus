import { MENU_BASE_URL, API_URL } from './config';

const defaultConfig = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Configuration for your local API
/*const API_URL = 'https://localhost:7119/'; // Base URL for your local API

// Endpoints
const MENU_BASE_URL = `${API_URL}/with-menus`; // Endpoint for the "Menu" path*/


const API = {

    //https://localhost:7119/Menu
    //https://localhost:7119/Menu?page=${page}
  fetchBars: async (searchTerm, page) => {
    try {
      const endpoint = `${API_URL}Menu?page=${page}`; // Añade soporte para paginación si es necesario
      const data = await fetch(endpoint).then((res) => res.json());
      console.log("Datos recibidos desde la API:", data); // <-- Aquí
      console.log("Endpoint que se está llamando:", endpoint); // <-- Aquí
      const results = data.reduce((acc, menu) => {
        const existingBar = acc.find((bar) => bar.barId === menu.barId);
        if (existingBar) {
          existingBar.menus.push({ id: menu.id, name: menu.name });
        } else {
          acc.push({
            barId: menu.barId,
            menus: [{ id: menu.id, name: menu.name }],
          });
        }
        return acc;
      }, []);
  
      return {
        page,
        results,
        total_pages: 1, // Actualiza si tienes soporte para más páginas
        total_results: results.length,
      };
    } catch (error) {
      console.error("Error fetching bars:", error);
      throw new Error("Failed to fetch bars");
    }
  },
  

    //https://localhost:7119/with-menus
  fetchMenu: async () => {
    const endpoint = `${MENU_BASE_URL}`;
    return await (await fetch(endpoint, { method: 'GET' })).json();
  },


   ///https://localhost:7119/Menu/{menuId}/details
  // Example: Fetch a specific menu item by ID
  fetchMenuItem: async (menuId) => {
    const endpoint = `${API_URL}Menu/${menuId}/details`;
    const data = await fetch(endpoint).then((res) => res.json());
    console.log("Datos recibidos desde la API:", data); // <-- Aquí
    console.log("Endpoint que se está llamando:", endpoint); // <-- Aquí
    try {
      const response = await fetch(endpoint, { method: 'GET' });
      if (!response.ok) {
        throw new Error("Error fetching menu details");
      }
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
  
  // Example: Create a new menu item
  //https://localhost:7119//with-menus
  createMenuItem: async (menuItemData) => {
    const endpoint = `${MENU_BASE_URL}`;
    const response = await (
      await fetch(endpoint, {
        ...defaultConfig,
        body: JSON.stringify(menuItemData),
      })
    ).json();
    return response;
  },

  //Editar una categoria
  //https://localhost:7119/Category/1
   updateCategoryItem : async (categoryId, updatedData) => {
    const endpoint = `${API_URL}Category/${categoryId}`;
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
  
    if (!response.ok) {
      throw new Error(`Failed to update category. Status: ${response.status}`);
    }
  
    return response.json();
  },
  


  //Editar un producto
  ////https://localhost:7119//with-menus/{menuId}
  updateProductItem: async (menuId, updatedData) => {
    const endpoint = `${API_URL}Product/${menuId}`;
    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en el servidor: ${errorText}`);
      }
  
      return await response.json(); // Devuelve el producto actualizado
    } catch (error) {
      console.error("Error al actualizar el producto:", error.message);
      throw error;
    }
  },
  


  //https://localhost:7119//with-menus/{menuId}
  // Example: Delete a menu item
  deleteMenuItem: async (menuId) => {
    const endpoint = `${MENU_BASE_URL}/${menuId}`;
    const response = await (
      await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
    return response;
  },
};

export default API;
