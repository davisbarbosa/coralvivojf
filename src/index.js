import React from "react";
import ReactDOM from "react-dom/client"; // Importando de 'react-dom/client'
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";


// Obtendo o elemento root
const rootElement = document.getElementById("root");

// Criando a raiz usando createRoot
const root = ReactDOM.createRoot(rootElement);

// Renderizando o App dentro do ThemeProvider
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);