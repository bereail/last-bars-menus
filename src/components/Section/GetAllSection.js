import React, { useEffect, useState } from "react";
import API from "../../API";

const GetAllSections = () => {
  const [sections, setSections] = useState([]); // Estado para almacenar las secciones
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  // UseEffect para llamar a la API y obtener las secciones
  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true); // Activamos el estado de carga
        const data = await API.fetchSection(); // Llamamos a la función que trae las secciones
        setSections(data); // Guardamos los datos de las secciones en el estado
      } catch (error) {
        setError("Error al cargar las secciones"); // En caso de error
      } finally {
        setLoading(false); // Terminamos el estado de carga
      }
    };

    fetchSections(); // Llamada a la API
  }, []); // Se ejecuta solo una vez al montar el componente

  if (loading) {
    return <div>Cargando secciones...</div>; // Mostrar mensaje de carga
  }

  if (error) {
    return <div>{error}</div>; // Mostrar mensaje de error
  }

  return (
    <div>
      <h1>Lista de Secciones</h1>
      <ul>
        {sections.map((section) => (
          <li key={section.id}>{section.name}</li> // Asumimos que cada sección tiene un id y un nombre
        ))}
      </ul>
    </div>
  );
};

export default GetAllSections;
