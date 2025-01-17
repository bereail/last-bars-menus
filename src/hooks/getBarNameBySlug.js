export const getBarNameBySlug = async (slug) => {
    // Lógica para obtener el nombre del bar usando el slug, por ejemplo:
    const response = await fetch(`/api/bars/${slug}`);
    const data = await response.json();
    return data.name; // Suponiendo que la API devuelve un objeto con un campo `name`
  };
  