import React, { useState, useEffect, useContext } from "react";
import { usePapaParse } from "react-papaparse";
import PromoCard from "../components/PromoCard";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { FaWhatsapp, FaTrashAlt, FaCheckCircle } from "react-icons/fa";
import ThemeContext from "../context/ThemeContext";
import { Helmet } from "react-helmet";

const Promo = () => {
  const { darkMode } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { readString } = usePapaParse();

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/data/corals2.csv")
      .then((response) => response.text())
      .then((csvString) => {
        readString(csvString, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const filteredProducts = results.data.filter(
              (product) =>
                parseInt(product.number, 10) > 0 &&
                parseInt(product.price, 10) !== 0
            );
            setProducts(filteredProducts);
            setLoading(false);
          },
          error: (err) => {
            console.error("Erro ao processar CSV:", err);
            setError("Erro ao processar os dados.");
            setLoading(false);
          },
        });
      })
      .catch((error) => {
        console.error("Erro ao carregar CSV:", error);
        setError("Erro ao carregar o arquivo CSV.");
        setLoading(false);
      });
  }, [readString]);

  const handleDragStart = (product) => (event) => {
    event.dataTransfer.setData("product", JSON.stringify(product));
  };

  const handleDrop = (event) => {
    const product = JSON.parse(event.dataTransfer.getData("product"));
    const updatedItems = [...selectedItems, product].slice(-4);
    setSelectedItems(updatedItems);
  };

  const removeItem = (id) => {
    setSelectedItems(selectedItems.filter((item, index) => index !== id));
  };

  const clearSelectedItems = () => setSelectedItems([]);

  // const handleAddToSelection = (product) => {
  //   const updatedItems = [...selectedItems, product].slice(-4);
  //   setSelectedItems(updatedItems);
  // };

  const handleAddToSelection = (product) => {
    // Verifica se o item já está na seleção
    if (selectedItems.some((item) => item.id === product.id)) {
      return; // Se o item já existe, não faz nada
    }
  
    const updatedItems = [...selectedItems, product].slice(-4);
    setSelectedItems(updatedItems);
  };

  const getFreeItem = () => {
    // Verifica se há itens selecionados antes de usar o reduce
    if (selectedItems.length === 0) return [];

    // Encontra o menor preço
    const minPrice = Math.min(
      ...selectedItems.map((item) => parseFloat(item.price))
    );

    // Retorna todos os itens que têm o menor preço
    return selectedItems.filter((item) => parseFloat(item.price) === minPrice);
  };

  const calculateTotal = () => {
    if (selectedItems.length === 4) {
      const freeItems = getFreeItem(); // Pode haver vários itens com o menor preço

      let hasRemovedFreeItem = false; // Controle para remover apenas uma ocorrência

      const total = selectedItems
        .filter((item) => {
          const isFreeItem = freeItems.some((free) => free.id === item.id);

          // Remove apenas uma vez o item mais barato
          if (isFreeItem && !hasRemovedFreeItem) {
            hasRemovedFreeItem = true;
            return false; // Ignora esse item no cálculo do total
          }
          return true;
        })
        .reduce((acc, item) => acc + parseFloat(item.price), 0);

      return total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return "0,00";
  };

  const generateWhatsappMessage = () => {
    const itemsText = selectedItems
      .map((item) => `${item.id} - ${item.name} - R$${item.price}`)
      .join("\n");

    const freeItem = getFreeItem()[0];
    const freeItemText = freeItem
      ? `\n\n*Item gratuito:* ${freeItem.name}`
      : "\n\nNenhum item gratuito.";

    const totalText =
      selectedItems.length === 4 ? `\n\n*Total:* R$${calculateTotal()}` : "";

    return `Olá, gostaria de fazer um pedido com os seguintes itens:\n${itemsText}${freeItemText}${totalText}`;
  };

  const phoneNumber = "+553299482380";
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    generateWhatsappMessage()
  )}`;

  return (
    <>
      <Helmet>
        <title>Coral Vivo JF | Promoção</title>
        <meta
          name="description"
          content="Explore nossas promoçõesde de corais vivos, peixes marinhos e ornamentais, acessórios e produtos de qualidade para aquaristas."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div
        className={`py-3 ${
          darkMode ? "bg-dark text-light" : "bg-light text-dark"
        }`}
      >
        <Container>
          <h1 className="text-center mb-2">Promoção</h1>
          <h2 className="text-center mb-2">Comprando 4 Corais</h2>
          <h3 className="text-center mb-2">
            O de menor valor sai totalmente <strong>GRÁTIS</strong>!
          </h3>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Loading products...</p>
            </div>
          ) : (
            <Row className="mb-4">
              <Col xs={12} md={3}>
                <div
                  className={`p-3 mb-3 border ${
                    darkMode ? "border-light" : "border-dark"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  style={{ minHeight: "150px", borderRadius: "5px" }}
                >
                  <h5>Arraste ou adicione até 4 itens aqui:</h5>
                  {selectedItems.length === 0 ? (
                    <p>Nenhum item selecionado</p>
                  ) : (
                    <ul className="list-unstyled">
                      {selectedItems.map((item, index) => (
                        <li
                          key={index}
                          className="d-flex justify-content-between align-items-center mb-1"
                        >
                          <img
                            src={
                              process.env.PUBLIC_URL +
                              "/image/products/" +
                              item.image
                            }
                            alt={`Imagem do coral ${item.name}`}
                            style={{ width: "30px", height: "30px" }}
                          />
                          <span className="ms-2" style={{ width: "100%" }}>
                          {item.id} - {item.name}
                          </span>
                          <span className="ms-2">R${item.price}</span>
                          <FaTrashAlt
                            style={{
                              cursor: "pointer",
                              marginLeft: "10px",
                              fontSize: "24px",
                            }}
                            onClick={() => removeItem(index)}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                  {selectedItems.length === 4 && (
                    <>
                      <ul className="list-unstyled">
                        <li className="d-flex justify-content-between align-items-center mb-1">
                          <span
                            style={{ width: "30px", height: "30px" }}
                          ></span>
                          <span className="ms-2"></span>
                          <span
                            className="ms-2"
                            style={{ width: "100%", textAlign: "right" }}
                          >
                            <strong>Total: </strong>R${calculateTotal()}
                          </span>
                          <span className="ms-2">
                            <FaCheckCircle />
                          </span>
                        </li>
                      </ul>
                      <div className="mt-3 text-right">
                        <p>
                          <strong>Item gratuito:</strong>{" "}
                          {getFreeItem()[0].id} - {getFreeItem()[0].name}
                        </p>
                      </div>
                      <Button
                        variant="success"
                        href={whatsappLink}
                        target="_blank"
                        className="me-2"
                      >
                        <FaWhatsapp /> Fazer Pedido
                      </Button>
                      <Button variant="danger" onClick={clearSelectedItems}>
                        <FaTrashAlt /> Limpar
                      </Button>
                    </>
                  )}
                </div>
              </Col>
              <Col xs={12} md={9}>
                <Row>
                  {products.map(
                    (product, index) =>
                      product.enable === "true" && (
                        <Col
                          key={product.id}
                          xs={6}
                          md={3}
                          draggable
                          onDragStart={handleDragStart(product)}
                          className="mb-4"
                        >
                          <PromoCard
                            product={product}
                            onAddToSelection={handleAddToSelection}
                          />
                        </Col>
                      )
                  )}
                </Row>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </>
  );
};

export default Promo;
