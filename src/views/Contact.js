import React, { useContext, useState } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import ThemeContext from "../context/ThemeContext";
import { Helmet } from "react-helmet";

function Contact() {
  const { darkMode } = useContext(ThemeContext);
  const containerClass = darkMode ? "bg-dark text-light" : "bg-light text-dark";

  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const images = [
    "../image/loja1.jpg",
    "../image/loja2.jpg",
    "../image/loja3.jpg",
    "../image/loja1.jpg",
    "../image/loja2.jpg",
    "../image/loja3.jpg",
  ];

  const openModal = (image) => {
    setCurrentImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentImage("");
  };

  return (
    <>
      <Helmet>
        <title>Coral Vivo JF | Loja</title>
        <meta
          name="description"
          content="Venha conhecer nossa loja e a estrutura fantástica que montamos para ter a melhor qualidade para nossos clientes e nossos animais."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className={`py-3 ${containerClass}`} style={{minHeight: "100vh"}}>
        <Container>
          <h1 className="text-center mb-5">Nossa loja</h1>

          <Row>
            {/* Galeria de Imagens */}
            <Col md={12}>
              <Row>
                {images.map((image, index) => (
                  <Col md={2} key={index} className="mb-4">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        width: "100%",
                        height: "250px",
                        borderRadius: "5px",
                      }}
                    >
                      <img
                        src={image}
                        alt={`Descrição da imagem ${index + 1}`}
                        style={{
                          cursor: "pointer",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onClick={() => openModal(image)}
                        loading="lazy"
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          {/* Modal para Imagem Ampliada */}
          <Modal
            show={showModal}
            onHide={closeModal}
            centered
            backdrop="static"
            keyboard
          >
            <Modal.Body>
              <img
                src={currentImage}
                alt="Imagem ampliada"
                style={{ width: "100%" }}
                onClick={closeModal}
              />
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </>
  );
}

export default Contact;
