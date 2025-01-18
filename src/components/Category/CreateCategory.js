import React, { useState, useEffect } from "react";
import API from "../../API";

const CreateCategory = () => {
  const [sections, setSections] = useState([]); // Listado de secciones
  const [selectedSectionId, setSelectedSectionId] = useState(""); // Sección seleccionada por ID
  const [categoryName, setCategoryName] = useState(""); // Estado para el nombre de la categoría
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const [success, setSuccess] = useState(false); // Estado de éxito

  // Obtener las secciones al cargar el componente
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sections = await API.fetchSection(); // Llamada a la API para obtener las secciones
        console.log("Secciones obtenidas:", sections); // Verifica los datos recibidos de la API
        setSections(sections);
      } catch (error) {
        setError("Error al obtener las secciones.");
      }
    };

    fetchSections();
  }, []);

  // Manejador para el cambio del campo del nombre de la categoría
  const handleNameChange = (event) => {
    setCategoryName(event.target.value);
  };

  // Manejador para el cambio de la sección seleccionada
  const handleSectionChange = (event) => {
    setSelectedSectionId(event.target.value); // Asegúrate de que esto sea el ID de la sección
    console.log("Sección seleccionada:", event.target.value); // Verifica que el ID se actualiza correctamente
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita la recarga de la página

    if (!selectedSectionId) {
      setError("Debe seleccionar una sección.");
      return;
    }

    if (!categoryName) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Enviar el id de la sección y el nombre de la categoría
      const response = await API.createCategory(selectedSectionId, { name: categoryName });
      console.log("Datos enviados a la API:", { sectionId: selectedSectionId, name: categoryName });
      setSuccess(true);
      setCategoryName("");
    } catch (error) {
      setError("Error al crear la categoría.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Crear Nueva Categoría</h1>

      {/* Mostrar mensaje de éxito */}
      {success && <div>¡Categoría creada con éxito!</div>}

      {/* Mostrar error */}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Formulario de creación de categoría */}
      <form onSubmit={handleSubmit}>
        {/* Selección de la sección */}
        <div>
          <label htmlFor="section">Selecciona una Sección:</label>
          <select
            value={selectedSectionId} // Valor que guarda el ID seleccionado
            onChange={handleSectionChange} // Actualiza el ID seleccionado
          >
            <option value="" disabled>Selecciona una sección</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name} {/* Muestra el nombre de la sección */}
              </option>
            ))}
          </select>
        </div>

        {/* Campo para el nombre de la categoría */}
        <div>
          <label htmlFor="categoryName">Nombre de la categoría:</label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={handleNameChange}
            placeholder="Ingresa el nombre de la categoría"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Crear Categoría"}
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;
