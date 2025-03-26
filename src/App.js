// React e hooks
import React from "react";

// Bibliotecas de terceiros
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// CSS e estilos globais
import "./App.css";

// Hooks personalizados
import useAnalytics from "./useAnalytics";

// Componentes principais
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import Maintenance from "./components/Maintenance";

// Views (páginas)
import Home from "./views/Home";
import LPSCorals from "./views/LPSCorals";
import SPSCorals from "./views/SPSCorals";
import Contact from "./views/Contact";
import Promo from "./views/Promo";

// Componentes adicionais
import CoralList from "./components/CoralList";
import FishList from "./components/FishList";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import CoralDetails from "./components/CoralDetails";
import FishDetails from "./components/FishDetails";
import Portifolio from "./components/Portifolio";
import NotFound from "./components/NotFound";

function App() {
  useAnalytics();

  // Variável para ativar/desativar a manutenção
  const isMaintenance = true;
  const promocao = true;

  if (isMaintenance) {
    return <Maintenance />; // Exibe a página de manutenção
  }

  return (
    <>
      <CookieConsent />
      <BrowserRouter>
        <Header promocao={promocao} />
        <Routes>
          <Route exact path="/" element={<Home promocao={promocao} />} />
          <Route exact path="/estoque" element={<ProductList />} />
          <Route exact path="/corais" element={<CoralList />} />
          <Route exact path="/peixes" element={<FishList />} />
          {promocao && <Route exact path="/promocao" element={<Promo />} />}
          <Route exact path="/portifolio" element={<Portifolio />} />
          <Route exact path="/lps-corals" element={<LPSCorals />} />
          <Route exact path="/sps-corals" element={<SPSCorals />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/coral/:id" element={<CoralDetails />} />
          <Route path="/peixe/:id" element={<FishDetails />} />
          <Route exact path="/loja" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
