import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Carousel,
  Spinner,
  Alert,
  Button,
  Table,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { FaArrowLeft } from "react-icons/fa";
import ThemeContext from "../context/ThemeContext";
import ReactWhatsapp from "react-whatsapp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/corals2.csv`)
      .then((response) => response.text())
      .then((csvString) => {
        const { parse } = require("papaparse");
        const results = parse(csvString, {
          header: true,
          skipEmptyLines: true,
        });
        const foundProduct = results.data.find((p) => p.id === id);
        foundProduct
          ? setProduct(foundProduct)
          : setError("Produto não encontrado.");
        setLoading(false);
      })
      .catch((err) => {
        setError(`Erro ao carregar os detalhes do produto: ${err.message}`);
        setLoading(false);
      });
  }, [id]);

  const handleBack = () => navigate(-1);

  const isYouTubeLink = (url) => /youtu\.?be/.test(url);

  if (loading) {
    return (
      <Spinner animation="border" variant={darkMode ? "light" : "primary"} />
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const shareUrl = `${window.location.origin}/product/${product.id}`;
  const shareMessage = `Confira este produto: ${product.name} por R$${product.price}`;
  const phoneNumber = "+553299482380"; // WhatsApp
  const message = `Olá, tenho interesse no coral ${product.name} por R$${product.price}.`;

  return (
    <div className={darkMode ? "bg-dark text-light" : "bg-light text-dark"}>
      <Container className="pt-3 ProductDetails">
        <Button
          variant={darkMode ? "secondary" : "primary"}
          onClick={handleBack}
          className="d-flex align-items-center"
          aria-label="Voltar para a página anterior"
        >
          <FaArrowLeft style={{ marginRight: "5px" }} />
          Voltar
        </Button>

        <Row className="pt-3 pb-5">
          <Col md={6}>
            <Carousel
              indicators={false}
              interval={null}
              className="CarouselProductDetails"
            >
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={process.env.PUBLIC_URL + "/image/corais/" + product.image}
                  alt={`${product.name} - 1`}
                />
              </Carousel.Item>
              {product.image2 && (
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={process.env.PUBLIC_URL + "/image/corais/" +product.image2}
                    alt={`${product.name} - 2`}
                  />
                </Carousel.Item>
              )}
              {product.image3 && (
                <Carousel.Item>
                  {isYouTubeLink(product.image3) ? (
                    <div className="video-container">
                      <iframe
                        src={
                          product.image3.replace("watch?v=", "embed/") +
                          "?rel=0&modestbranding=1&controls=0"
                        }
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <img
                      className="d-block w-100"
                      src={process.env.PUBLIC_URL + "/image/corais/" +product.image3}
                      alt={`${product.name} - 3`}
                    />
                  )}
                </Carousel.Item>
              )}
            </Carousel>
          </Col>

          <Col md={6}>
            <Row>
              <Col>
                <Table
                  striped
                  bordered
                  hover
                  variant={darkMode ? "dark" : "light"}
                >
                  <tbody>
                    <tr>
                      <th>Nome</th>
                      <td>{product.name}</td>
                    </tr>
                    <tr>
                      <th>Preço</th>
                      <td>R${product.price}</td>
                    </tr>
                    <tr>
                      <th>Tipo</th>
                      <td>{product.type}</td>
                    </tr>
                    <tr>
                      <th>Subtipo</th>
                      <td>{product.subtype}</td>
                    </tr>
                    <tr>
                      <th>Tamanho</th>
                      <td>{product.size}</td>
                    </tr>
                    <tr>
                      <th>Estoque</th>
                      <td>{product.number}</td>
                    </tr>
                    <tr>
                      <th></th>
                      <td>
                        {" "}
                        <ReactWhatsapp
                          className="btn"
                          number={phoneNumber}
                          message={message}
                          style={{
                            backgroundColor: "#25D366",
                            color: "#000",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faWhatsapp}
                            style={{ marginRight: "8px" }}
                          />
                          Compre via WhatsApp
                        </ReactWhatsapp>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row>
              <Col>
                <div>
                  <h5>Compartilhar:</h5>
                  <FacebookShareButton url={shareUrl} quote={shareMessage}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={shareUrl} title={shareMessage}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <WhatsappShareButton url={shareUrl} title={shareMessage}>
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetails;
