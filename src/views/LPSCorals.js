import React, { useState, useEffect, useMemo, useContext } from "react";
import { usePapaParse } from "react-papaparse";
import ProductCard from "../components/ProductCard";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Button,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTh, faList } from "@fortawesome/free-solid-svg-icons";
import ThemeContext from "../context/ThemeContext";
import { Helmet } from "react-helmet";

const LPSCorals = () => {
  const { darkMode } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { readString } = usePapaParse();
  const [viewMode, setViewMode] = useState("card"); // "card" ou "list"
  const [sortBy, setSortBy] = useState("name"); // Critério de ordenação
  const [sortOrder, setSortOrder] = useState("asc"); // Ordem crescente/decrescente

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/data/corals.csv")
      .then((response) => response.text())
      .then((csvString) => {
        readString(csvString, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setProducts(
              results.data.filter(
                (product) =>
                  product.type === "coral" && product.subtype === "lps"
              )
            );
            setLoading(false);
          },
          error: (err) => {
            setError(err.message);
            setLoading(false);
          },
        });
      })
      .catch((error) => {
        setError("Erro ao carregar o arquivo CSV: " + error.message);
        setLoading(false);
      });
  }, [readString]);

  const sortedProducts = useMemo(() => {
    return products.sort((a, b) => {
      if (sortBy === "price") {
        return sortOrder === "asc"
          ? parseFloat(a.price) - parseFloat(b.price)
          : parseFloat(b.price) - parseFloat(a.price);
      } else {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });
  }, [products, sortBy, sortOrder]);

  if (loading) {
    return (
      <Container>
        <Spinner
          animation="border"
          variant={darkMode ? "light" : "primary"}
          className="m-5"
        />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="m-5">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Corais LPS | Estoque Coral Vivo JF</title>
        <meta
          name="description"
          content="Explore nossa coleção exclusiva de corais LPS."
        />
        <meta
          property="og:title"
          content="Corais LPS | Estoque Coral Vivo JF"
        />
        <meta
          property="og:description"
          content="Explore nossa coleção exclusiva de corais LPS."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div
        className={`py-3 ${
          darkMode ? "bg-dark text-light" : "bg-light text-dark"
        }`}
      >
        <Container>
          <h1 className="text-center mb-4">Corais LPS</h1>

          {/* Controle de Ordenação */}
          <Row className="mb-3">
            <Col
              md={{ span: 2, offset: 8 }}
              className="d-flex flex-wrap justify-content-md-end"
            >
              <Button
                variant={viewMode === "card" ? "primary" : "secondary"}
                onClick={() => setViewMode("card")}
                className="me-2"
              >
                <FontAwesomeIcon icon={faTh} /> {/* Ícone de Grid */}
              </Button>
              <Button
                variant={viewMode === "table" ? "primary" : "secondary"}
                onClick={() => setViewMode("table")}
              >
                <FontAwesomeIcon icon={faList} /> {/* Ícone de Lista */}
              </Button>
            </Col>
            <Col md={2} className="d-flex flex-wrap justify-content-md-end">
              <Form.Select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className={darkMode ? "bg-dark text-light" : ""}
              >
                <option value="name-asc">Nome (A-Z)</option>
                <option value="name-desc">Nome (Z-A)</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Renderização dos Produtos */}
          <Row>
            <Col>
              {viewMode === "card" ? (
                <Row>
                  {sortedProducts.map((product, index) => (
                    <Col
                      key={product.id || index}
                      xs={6}
                      sm={6}
                      md={4}
                      lg={3}
                      className="mb-4"
                    >
                      <ProductCard product={product} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <table
                  className={`table table-striped ${
                    darkMode ? "table-dark" : ""
                  }`}
                >
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Estoque</th>
                      <th>Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProducts.map((product, index) => (
                      <tr
                        key={product.id || index}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{product.name}</td>
                        <td>{product.number}</td>
                        <td>R${product.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default LPSCorals;
