import { Routes, Route } from "react-router-dom";
import React,{ Suspense, useEffect } from "react";

// Importación perezosa (lazy load)
const InicioDeSesion = React.lazy(() => import("./pages/IniciarSesion"));
const Inicio = React.lazy(() => import("./pages/Inicio"));
const Teams = React.lazy(() => import("./pages/Teams"));
const Configuracion = React.lazy(() => import("./pages/Configuracion"));
const Alumnos = React.lazy(() => import("./pages/Alumnos"));
const AuthHandler = React.lazy(() => import("./pages/auth/AuthHandler"));

function App() {

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        <Route path="/" element={<InicioDeSesion />} />
        <Route path="/Inicio" element={<Inicio />} />
        <Route path="Teams" element={<Teams />} />
        <Route path="/Configuracion" element={<Configuracion />} />
        <Route path="/Alumnos" element={<Alumnos />} />
        <Route path="/auth-handler" element={<AuthHandler />} />
      </Routes>
    </Suspense>
  );
}

export default App;
