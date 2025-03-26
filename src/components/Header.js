// src/components/Header.js
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import ThemeContext from "../context/ThemeContext";
import logo from "../assets/media/logo.webp";

function Header({ promocao }) {
  // Recebendo 'promocao' como prop
  const [expanded, setExpanded] = useState(false); // Controle do menu
  const { darkMode, toggleTheme } = useContext(ThemeContext); // Acessando o contexto de tema

  // Funções para controlar o menu
  const handleToggle = () => setExpanded((prev) => !prev);
  const handleLinkClick = () => setExpanded(false); // Fechar ao clicar em um link

  return (
    <div>
      <Container
        fluid
        className={`navTop d-flex justify-content-end align-items-center py-2 ${
          darkMode ? "borderDark" : "borderLight"
        }`}
      >
        <Nav>
          <Nav.Link
            href="https://wa.me/+553299482380"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Whatsapp"
          >
            <FaWhatsapp size={20} color="#fff" />
          </Nav.Link>
          <Nav.Link
            href="https://www.instagram.com/coralvivojf/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram size={20} color="#fff" />
          </Nav.Link>
          <Nav.Link
            href="https://www.facebook.com/coralvivomg/?locale=pt_BR"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook size={20} color="#fff" />
          </Nav.Link>
        </Nav>
      </Container>

      {/* Navbar principal */}
      <div className={`${darkMode ? "bg-dark" : "bg-light"}`}>
        <Container>
          <Navbar
            collapseOnSelect
            expand="md"
            expanded={expanded}
            className={`py-3 ${darkMode ? "navbar-dark" : "navbar-light"}`}
          >
            {/* Logo */}
            <Navbar.Brand as={Link} to="/">
              <img src={logo} alt="Coral Vivo Company Logo" />
            </Navbar.Brand>

            {/* Botão hamburguer para telas pequenas */}
            <Navbar.Toggle
              onClick={handleToggle}
              aria-controls="basic-navbar-nav"
            />

            {/* Links da navbar */}
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">

                <Nav.Link as={Link} to="/corais" onClick={handleLinkClick}>
                  Corais
                </Nav.Link>
                <Nav.Link as={Link} to="/peixes" onClick={handleLinkClick}>
                  Peixes
                </Nav.Link>
                <Nav.Link as={Link} to="/estoque" onClick={handleLinkClick}>
                  Estoque
                </Nav.Link>
                {promocao && ( // Condicionando a exibição do link de promoção
                  <Nav.Link as={Link} to="/promocao" onClick={handleLinkClick}>
                    Promoção
                  </Nav.Link>
                )}
                {/* <Nav.Link as={Link} to="/portifolio" onClick={handleLinkClick}>
                  Portfólio
                </Nav.Link> */}
                {/* <Nav.Link as={Link} to="/lps-corals" onClick={handleLinkClick}>
                  Corais LPS
                </Nav.Link>
                <Nav.Link as={Link} to="/sps-corals" onClick={handleLinkClick}>
                  Corais SPS
                </Nav.Link> */}
                {/* <Nav.Link as={Link} to="/loja" onClick={handleLinkClick}>
                  Nossa Loja
                </Nav.Link> */}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </div>
      <Container
        fluid
        className={`navBottom d-flex justify-content-end align-items-center py-2 ${
          darkMode ? "borderDark" : "borderLight"
        }`}
      >
        <Nav>
          <Button
            onClick={toggleTheme}
            aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            className={`${darkMode ? "darkButton" : "lightButton"}`}
          >
            {darkMode ? (
              <FaToggleOff className="me-2" /> // Ícone quando no modo escuro
            ) : (
              <FaToggleOn className="me-2" /> // Ícone quando no modo claro
            )}
            {darkMode ? "Modo Claro" : "Modo Escuro"}
          </Button>
        </Nav>
      </Container>
    </div>
  );
}

export default Header;
