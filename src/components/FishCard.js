import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Hook para navegação
import ThemeContext from "../context/ThemeContext"; // Importa o contexto do tema

const FishCard = ({ product }) => {
  const { darkMode } = useContext(ThemeContext); // Obtém o estado do tema
  const navigate = useNavigate(); // Inicializa o hook useNavigate

  // Estilos dinâmicos baseados no tema
  const cardStyle = {
    cursor: "pointer",
    backgroundColor: darkMode ? "#2f2f2f" : "#fff", // Fundo escuro ou claro
    color: darkMode ? "#f0f0f0" : "#000", // Texto claro ou escuro
  };

  const handleCardClick = () => {
    window.scrollTo(0, 0); // Move a rolagem para o topo da página
    navigate(`/peixe/${product.id}`); // Redireciona para a página de detalhes
  };

  return (
    <Card onClick={handleCardClick} style={cardStyle}>
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
          src={`${process.env.PUBLIC_URL}/image/peixes/${product.image}`}
          // src={`${product.image}`}
          alt={product.name}
        />
      </div>
      <Card.Body>
        <Card.Title>{product.name}{product.size}</Card.Title>
        <Card.Subtitle>
          Cod: {product.id}
        </Card.Subtitle>
        <Card.Title>R${product.price}</Card.Title>
        <Card.Text>
          {product.number > 0
            ? `${product.number} em estoque`
            : "Produto esgotado"}
        </Card.Text>
        {/* <Card.Text>
          {product.nparcel}x de R${product.parcel} sem juros <br /> R$
          {product.promoprice} no pix
        </Card.Text> */}
      </Card.Body>
    </Card>
  );
};

export default FishCard;
