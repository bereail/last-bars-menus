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


   ///https://localhost:7119/Menu/menu-details/{menuId}
  // Example: Fetch a specific menu item by ID
  fetchMenuItem: async (menuId) => {
    const endpoint = `${API_URL}Menu/menu-details/${menuId}`;
    console.log("Endpoint que se está llamando:", endpoint);
  
    try {
      const response = await fetch(endpoint, { method: "GET" });
      if (!response.ok) {
        throw new Error(`Error fetching menu details: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Datos recibidos desde la APIs:", data);
      return data;
    } catch (error) {
      console.error("API Error:", error.message);
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


// Create a new category
//https://localhost:7119/Category/{sectionId}
createCategory: async (sectionId, categoryData) => {
  const endpoint = `${API_URL}Category/${sectionId}`;
  
  // Agrega un console.log aquí para ver el JSON que estás enviando
  console.log("Datos enviados a la API:", {
    sectionId, 
    ...categoryData
  });

  const response = await (
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sectionId, // Enviar también el sectionId si se requiere
        ...categoryData, // Incluir los datos de la categoría (como el nombre)
      }),
    })
  ).json();
  
  return response;
},


// Get All Section
//https://localhost:7119/Section
fetchSection: async () => {
  const endpoint = `${API_URL}Section`;
  return await (await fetch(endpoint, { method: 'GET' })).json();
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
  //https://localhost:7119/Product/{productId}
  updateProductItem: async (productId, updatedData) => {
    const endpoint = `${API_URL}Product/${productId}`;
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
  


    //https://localhost:7119/Product/{productId}
  // Example: Delete Product

  deleteProductItem: async (productId) => {
    try {
      const response = await fetch(`${API_URL}Product/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // Verifica si la respuesta contiene un cuerpo antes de intentar convertirla a JSON
      const responseBody = await response.text(); // Primero leer como texto

      // Si la respuesta tiene contenido, parseamos como JSON
      return responseBody ? JSON.parse(responseBody) : { success: true }; // Asumimos éxito si no hay cuerpo
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
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
