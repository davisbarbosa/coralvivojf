import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Carousel,
  Spinner,
  Alert,
} from "react-bootstrap";
import ThemeContext from "../context/ThemeContext";
import { Helmet } from "react-helmet";
import { usePapaParse } from "react-papaparse";

// URL do CSV
function Portifolio() {
  const [showModal, setShowModal] = useState(false);
  const [selectedProjeto, setSelectedProjeto] = useState(null);
  const { darkMode } = useContext(ThemeContext);

  const [portifolio, setPortifolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { readString } = usePapaParse();

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/data/portifolio.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((csvString) => {
        readString(csvString, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const formattedData = results.data.map((item) => ({
              title: item.title,
              description: item.description,
              images: item.images ? item.images.split(", ") : [], // Adiciona verificação para undefined
            }));
            setPortifolio(formattedData);
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

  const handleShow = (projeto) => {
    setSelectedProjeto(projeto);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProjeto(null);
  };

  const cardStyle = {
    cursor: "pointer",
    backgroundColor: darkMode ? "#2f2f2f" : "#fff",
    color: darkMode ? "#f0f0f0" : "#000",
  };

  const themeClass = darkMode ? "dark-mode" : "light-mode";

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
        <title>Coral Vivo JF | Portfólio</title>
        <meta
          name="description"
          content="Conheça nossos montagens de aquarios personalizados"
        />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <div className={themeClass}>
        <Container className={`py-3`}>
          <h1 className="text-center mb-4">Portfólio de Projetos</h1>
          <Row>
            {portifolio.map((projeto, index) => (
              <Col md={4} key={index} className="mb-4">
                <Card style={cardStyle}>
                  <Card.Img
                    variant="top"
                    src={projeto.images[0]}
                    alt={`Imagem do projeto ${projeto.title}`}
                  />
                  <Card.Body>
                    <Card.Title>{projeto.title}</Card.Title>
                    <Card.Text>{projeto.description}</Card.Text>
                    <Button variant="primary" onClick={() => handleShow(projeto)}>
                      Ver Mais
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Modal para exibir o carrossel de imagens */}
          <Modal show={showModal} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>{selectedProjeto?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedProjeto && (
                <Carousel>
                  {selectedProjeto.images.map((image, idx) => (
                    <Carousel.Item key={idx}>
                      <img
                        className="d-block w-100"
                        src={image}
                        alt={`Imagem ${idx + 1} do projeto ${selectedProjeto?.title}`}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Fechar
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </>
  );
}

export default Portifolio;
