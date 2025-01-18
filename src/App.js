import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./GlobalStyle";
import Navbar from "./components/Header";
import MenuPage from "./components/Pages/MenuPages";
import styled from "styled-components";
import HomePages from "./components/Pages/HomePages/HomePages";
import Footer from "./components/Footer";
import Login from "./components/Login/Login";
import CrudPage from "./components/Pages/CrudPage";
import { AuthProvider } from "./components/Login/AuthContext";
import AuthenticatedLayout from '../src/components/Login/AuthenticatedLayout';
import GetAllSections from "./components/Section/GetAllSection";
import AddComponent from "./components/CrudComponent/AddComponent";
import DeleteComponent from "./components/CrudComponent/DeleteComponent";
import CreateCategory from "./components/Category/CreateCategory";

// Contenedor principal para ajustar el espacio
const MainContent = styled.div`
  padding-top: 60px; /* Asegura que el contenido no quede tapado por el navbar */
  min-height: calc(100vh - 60px); /* Altura mínima de la pantalla menos la altura del navbar */
  display: flex;
  flex-direction: column; /* Asegura que el contenido se alinee verticalmente */
`;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePages />} />
            <Route path="/:menuName" element={<MenuPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/test" element={<CreateCategory />} />

            {/* Protected Routes */}
            <Route element={<AuthenticatedLayout />}>
              <Route path="/crud" element={<CrudPage />} />
              <Route path="/addComponent" element={<AddComponent />} />
              <Route path="/deleteComponent" element={<DeleteComponent />} />
            </Route>
          </Routes>
        </MainContent>
        <Footer />
        <GlobalStyle />
      </Router>
    </AuthProvider>
  );
}

export default App;
