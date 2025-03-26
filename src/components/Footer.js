import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import logo from "../assets/media/logo.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className="text-light py-4">
      <Container>
        <Row>
          {/* Coluna da logo */}
          <Col md={4} className="text-center">
            <div className="logo-holder">
              <img src={logo} alt="Coral Vivo JF - Logo" height="80" />
            </div>
          </Col>

          {/* Coluna de informações de contato */}
          <Col md={4} className="text-center">
            <h3>Contato</h3>
            <p>R. Salvador Notaroberto, 65 - loja 9 - Industrial</p>
            <p>Juiz de Fora - Minas Gerais</p>
            <p>coralvivojf@gmail.com</p>
            <p>+55(32)9948-2380</p>
          </Col>

          {/* Coluna do mapa do site */}
          <Col md={4} className="text-center">
            <h3>Mapa do Site</h3>
            <ul className="list-unstyled">
              <li>
                <a
                  href="/"
                  className="text-light"
                  aria-label="Ir para a página inicial"
                >
                  Início
                </a>
              </li>
              <li>
                <a
                  href="/estoque"
                  className="text-light"
                  aria-label="Ver nosso estoque"
                >
                  Nosso Estoque
                </a>
              </li>
              <li>
                <a
                  href="/portifolio"
                  className="text-light"
                  aria-label="Ver o portfólio"
                >
                  Portfólio
                </a>
              </li>
              <li>
                <a
                  href="/loja"
                  className="text-light"
                  aria-label="Ver o portfólio"
                >
                  Nossa Loja
                </a>
              </li>
            </ul>
            {/* Social Media Links */}
            <div className="text-center mt-2">
              <h3>Siga-nos</h3>
              <a
                href="https://www.facebook.com/coralvivomg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light mx-2"
                aria-label="Visite nossa página no Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a
                href="https://www.instagram.com/coralvivojf/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light mx-2"
                aria-label="Visite nossa página no Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
            </div>
          </Col>
        </Row>

        {/* Copyright Notice */}
        <div className="text-center mt-3">
          <small>
            &copy; {new Date().getFullYear()} Coral Vivo JF. Todos os direitos
            reservados.
          </small>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
