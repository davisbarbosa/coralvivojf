import React, { useState, useEffect, useMemo, useContext } from "react";
import { usePapaParse } from "react-papaparse";
import ProductCard from "./ProductCard";
import Filters from "./Filters"; // Importe o componente Filters
import { Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTh, faList } from "@fortawesome/free-solid-svg-icons";
import ThemeContext from "../context/ThemeContext";
import { Helmet } from "react-helmet";

const ProductList = () => {
  const { darkMode } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { readString } = usePapaParse();
  const [viewMode, setViewMode] = useState("card");

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubtype, setSelectedSubtype] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("name");
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [filterId, setFilterId] = useState(""); // Novo estado para o filtro por ID

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/data/products.csv")
      .then((response) => response.text())
      .then((csvString) => {
        readString(csvString, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setProducts(results.data);
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

  const uniqueTypes = [...new Set(products.map((product) => product.type))];
  const uniqueSizes = [...new Set(products.map((product) => product.size))]; // Adicione tamanhos únicos

  const filteredSubtypes = [
    ...new Set(
      products
        .filter((product) => product.type === selectedType)
        .map((product) => product.subtype)
    ),
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesId = filterId ? product.id === filterId : true;
      const matchesSearchTerm = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = selectedType ? product.type === selectedType : true;
      const matchesSubtype = selectedSubtype
        ? product.subtype === selectedSubtype
        : true;
      const matchesSize = selectedSize ? product.size === selectedSize : true;
      const matchesPrice =
        parseFloat(product.price) >= priceRange[0] &&
        parseFloat(product.price) <= priceRange[1];
      const matchesStock = hideOutOfStock ? product.number > 0 : true;

      return (
        matchesId &&
        matchesSearchTerm &&
        matchesType &&
        matchesSubtype &&
        matchesSize &&
        matchesPrice &&
        matchesStock
      );
    });
  }, [
    products,
    filterId,
    searchTerm,
    selectedType,
    selectedSubtype,
    selectedSize,
    priceRange,
    hideOutOfStock,
  ]);

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortBy === "price") {
      return sortOrder === "asc"
        ? parseFloat(a.price) - parseFloat(b.price)
        : parseFloat(b.price) - parseFloat(a.price);
    } else if (sortBy === "id") {
      return sortOrder === "asc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
    } else {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
  });

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedType("");
    setSelectedSubtype("");
    setSelectedSize("");
    setPriceRange([0, 1000]);
    setSortOrder("asc");
  };

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
        <title>Coral Vivo JF | Estoque de produtos</title>
        <meta
          name="description"
          content="Explore nossa coleção acessórios e produtos de qualidade para aquaristas."
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Coral Vivo JF | Estoque" />
        <meta
          property="og:description"
          content="Explore nossa coleção acessórios e produtos de qualidade para aquaristas."
        />
        <meta property="og:image" content="%PUBLIC_URL%/logo192.png" />
        <meta
          property="og:url"
          content="https://www.coralvivojf.com.br/estoque"
        />
        <meta property="og:type" content="website" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="%PUBLIC_URL%/logo512.png" />
        <meta name="twitter:title" content="Coral Vivo JF | Estoque" />
        <meta
          name="twitter:description"
          content="Explore nossa coleção acessórios e produtos de qualidade para aquaristas."
        />
        <meta name="twitter:image" content="%PUBLIC_URL%/logo192.png" />
      </Helmet>
      <div
        className={`py-3 ${
          darkMode ? "bg-dark text-light" : "bg-light text-dark"
        }`}
      >
        <Container>
          <h1 className={`text-center mb-4`}>Estoque de produtos</h1>
          <Row className="mb-3">
            <Col className="d-flex flex-wrap justify-content-md-end">
              <Button
                variant={viewMode === "card" ? "primary" : "secondary"}
                onClick={() => setViewMode("card")}
                className="me-2"
              >
                <FontAwesomeIcon icon={faTh} />
              </Button>
              <Button
                variant={viewMode === "table" ? "primary" : "secondary"}
                onClick={() => setViewMode("table")}
              >
                <FontAwesomeIcon icon={faList} />
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={4} lg={3}>
              <Filters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedSubtype={selectedSubtype}
                setSelectedSubtype={setSelectedSubtype}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                hideOutOfStock={hideOutOfStock}
                setHideOutOfStock={setHideOutOfStock}
                handleResetFilters={handleResetFilters}
                uniqueTypes={uniqueTypes}
                filteredSubtypes={filteredSubtypes}
                darkMode={darkMode}
                uniqueSizes={uniqueSizes}
                filterId={filterId}
                setFilterId={setFilterId} 
              />
            </Col>

            <Col xs={12} sm={12} md={8} lg={9}>
              <Row className="mb-3">
                <Col>
                  {viewMode === "card" ? (
                    <Row>
                      {sortedProducts.map(
                        (product, index) =>
                          product.enable === "true" && (
                            <Col
                              className="mb-4"
                              key={product.id || index}
                              xs={6}
                              sm={6}
                              md={4}
                              lg={3}
                            >
                              <ProductCard product={product} />
                            </Col>
                          )
                      )}
                    </Row>
                  ) : (
                    <div>
                      <table
                        className={`table table-striped ${
                          darkMode ? "table-dark" : ""
                        }`}
                      >
                        <thead>
                          <tr>
                            <th scope="col">cod</th>
                            <th scope="col">Nome</th>
                            <th scope="col">Marca</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Subtipo</th>
                            <th scope="col">Tamanho</th>
                            <th scope="col">Preço</th>
                            <th scope="col">Estoque</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedProducts.map((product, index) => (
                            <tr key={product.id || index}>
                              <td>{product.id}</td>
                              <td>{product.name}</td>
                              <td>{product.brand}</td>
                              <td>{product.type}</td>
                              <td>{product.subtype}</td>
                              <td>{product.size}</td>
                              <td>{product.price}</td>
                              <td>{product.number}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ProductList;
