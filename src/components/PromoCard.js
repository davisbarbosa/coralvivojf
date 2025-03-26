import React, { useContext } from "react";
import { Card, Button } from "react-bootstrap";
import ThemeContext from "../context/ThemeContext"; // Importa o contexto do tema

const PromoCard = ({ product, onAddToSelection }) => {
  const { darkMode } = useContext(ThemeContext); // Obtém o estado do tema

  // Estilos dinâmicos baseados no tema
  const cardStyle = {
    cursor: "pointer",
    backgroundColor: darkMode ? "#2f2f2f" : "#fff", // Fundo escuro ou claro
    color: darkMode ? "#f0f0f0" : "#000", // Texto claro ou escuro
  };

  return (
    <Card style={cardStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderTopLeftRadius: "5px",
          borderTopRightRadius: "5px",
          maxHeight: "150px",
        }}
      >
        <Card.Img
          style={{
            height: "auto",
            width: "100%",
          }}
          src={process.env.PUBLIC_URL + "/image/products/" +product.image}
          alt={product.name}
        />
      </div>
      <Card.Body>
        <Card.Subtitle>{product.id} - {product.name}</Card.Subtitle>
        <Card.Text>R${product.price}</Card.Text>
      </Card.Body>
      <Card.Footer>
      <Button variant="primary" onClick={() => onAddToSelection(product)}>
          Adicionar
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default PromoCard;
