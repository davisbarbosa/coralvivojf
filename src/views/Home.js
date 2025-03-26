// src/pages/Home.js
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Card,
} from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import Papa from "papaparse";
import ThemeContext from "../context/ThemeContext";
import "./Home.css";
import { Helmet } from "react-helmet";

const Home = ({ promocao }) => {
  const { darkMode } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const csvPath = process.env.PUBLIC_URL + "/data/corals2.csv";

    fetch(csvPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: Falha ao carregar o CSV.`);
        }
        return response.text();
      })
      .then((csvString) => {
        Papa.parse(csvString, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const filteredProducts = results.data.filter(
              (product) => product.sale === "true"
            );
            setProducts(filteredProducts.slice(0, 4));
            setLoading(false);
          },
          error: (err) => {
            setError(err.message);
            setLoading(false);
          },
        });
      })
      .catch((error) => {
        setError("Erro ao carregar os produtos: " + error.message);
        setLoading(false);
      });
  }, []);

  const themeClass = darkMode ? "dark-mode" : "light-mode";

  return (
    <>
      <Helmet>
        <title>Coral Vivo JF | Loja especializada em aquários marinhos</title>
        <meta
          name="description"
          content="Explore nossa loja e descubra a beleza dos oceanos em sua casa. Coral Vivo JF oferece corais, peixes marinhos e ornamentais, equipamentos, montagens e manutenção. Confira nosso nosso estoque e portfólio!"
        />
      </Helmet>

      <div className={themeClass}>
        {/* Banner */}
        <section className="banner-section">
          <Container
            fluid
            className="d-flex justify-content-center align-items-center banner-content"
          >
            <Row>
              <Col className="text-center">
                <h1 className="text-white">
                  Loja especializada em aquários marinhos
                </h1>
                <h2 className="text-white lead">
                  Descubra as maravilhas do oceano em seu lar.
                </h2>
                <Link to="/Portifolio">
                  <Button variant="primary" size="lg">
                    Veja Nosso Portfólio
                  </Button>
                </Link>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Sessão de Promoção */}
        {promocao && (
          <section className="promotion-section py-5">
            <Container>
              <h2 className="text-center mb-4" style={{color: "#fff"}}>Promoção Imperdível!</h2>
              <Row className="justify-content-center">
                <Col xs={12} md={8}>
                  <Card className="text-center promotion-card shadow-sm">
                    <Card.Body>
                      <h3 className="mb-3">Comprando 4 Corais</h3>
                      <h4 className="mb-3">
                        O de menor valor sai totalmente <strong>GRÁTIS</strong>!
                      </h4>
                      <Row className="text-center">
                        <Col xs={6} md={3} className="promoCol">
                          <img
                            src={`${process.env.PUBLIC_URL}/image/coral-sps-hammer-lemon.webp`}
                            alt="Coral 1"
                            className="promotion-coral"
                          />
                        </Col>
                        <Col xs={6} md={3} className="promoCol">
                          <img
                            src={`${process.env.PUBLIC_URL}/image/frog-eletric-green-scaled.jpg`}
                            alt="Coral 2"
                            className="promotion-coral"
                          />
                        </Col>
                        <Col xs={6} md={3} className="promoCol">
                          <img
                            src={`${process.env.PUBLIC_URL}/image/zoanthus-rasta.webp`}
                            alt="Coral 3"
                            className="promotion-coral"
                          />
                        </Col>
                        <Col xs={6} md={3} className="promoCol">
                          <img
                            src={`${process.env.PUBLIC_URL}/image/coral4.webp`}
                            alt="Coral 4"
                            className="promotion-coral"
                          />
                        </Col>
                      </Row>
                      <h4 className="mb-3">
                        Corre que esssa promoção só dura até dia 02/11/2024
                      </h4>
                      <h5 className="mb-3">
                        Clique aqui
                      </h5>
                      <Link to="/promocao">
                        <Button variant="primary" size="lg">
                          Promoção
                        </Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>
        )}

        {/* Produtos em Destaque */}
        <section className="featured-products py-5">
          <Container>
            <h2 className="text-center mb-4">Corais em Destaque</h2>
            {loading ? (
              <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
              </Container>
            ) : error ? (
              <Container className="text-center my-5">
                <Alert variant="danger">{error}</Alert>
              </Container>
            ) : products.length > 0 ? (
              <Row>
                {products.map((product) => (
                  <Col key={product.id} xs={12} sm={6} md={3} className="mb-4">
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Alert variant="info" className="text-center">
                Não há produtos em promoção no momento.
              </Alert>
            )}
            <div className="text-center mt-4">
              <Link to="/corais">
                <Button variant="primary" size="lg">
                  Ver mais corais
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default Home;
