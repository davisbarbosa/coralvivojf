// Filters.js
import React from "react";
import { Form, Button } from "react-bootstrap";

const Filters = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedSubtype,
  setSelectedSubtype,
  selectedSize,
  setSelectedSize,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  hideOutOfStock,
  setHideOutOfStock,
  handleResetFilters,
  uniqueTypes,
  filteredSubtypes,
  darkMode,
  uniqueSizes,
  filterId,
  setFilterId, // Novo prop para filtro de ID
}) => {
  return (
    <Form className="p-3 border" style={{ borderRadius: "5px" }}>
      <Form.Group controlId="stockFilter" className="mt-3">
        <Form.Check
          type="checkbox"
          label="Ocultar itens fora de estoque"
          checked={hideOutOfStock}
          onChange={(e) => setHideOutOfStock(e.target.checked)}
          className={darkMode ? "text-light" : ""}
        />
      </Form.Group>

      <Form.Group controlId="filterId">
        <Form.Label>Código</Form.Label>
        <Form.Control
          type="text"
          placeholder="Digite o código"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
          className={darkMode ? "bg-dark text-light" : ""}
        />
      </Form.Group>

      <Form.Group controlId="search">
        <Form.Label>Nome</Form.Label>
        <Form.Control
          type="text"
          placeholder="Buscar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={darkMode ? "bg-dark text-light" : ""}
        />
      </Form.Group>

      <Form.Group controlId="type">
        <Form.Label>Tipo</Form.Label>
        <Form.Select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setSelectedSubtype("");
          }}
          className={darkMode ? "bg-dark text-light" : ""}
        >
          <option value="">Todos os tipos</option>
          {uniqueTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="subtype">
        <Form.Label>Subtipo</Form.Label>
        <Form.Select
          value={selectedSubtype}
          onChange={(e) => setSelectedSubtype(e.target.value)}
          disabled={!selectedType}
          className={darkMode ? "bg-dark text-light" : ""}
        >
          <option value="">Todos os subtipos</option>
          {filteredSubtypes.map((subtype, index) => (
            <option key={index} value={subtype}>
              {subtype}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="size">
        <Form.Label>Tamanho</Form.Label>
        <Form.Select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className={darkMode ? "bg-dark text-light" : ""}
        >
          <option value="">Todos os tamanhos</option>
          {uniqueSizes.map((size, index) => (
            <option key={index} value={size}>
              {size}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="price">
        <Form.Label>
          Faixa de preço: {`R$${priceRange[0]} - R$${priceRange[1]}`}
        </Form.Label>
        <Form.Range
          min={0}
          max={1000}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, e.target.value])}
        />
      </Form.Group>

      <Form.Group controlId="button">
        <Button variant="secondary" onClick={handleResetFilters}>
          Resetar Filtros
        </Button>
      </Form.Group>

      <Form.Group controlId="sort">
        <Form.Label>Ordenar por:</Form.Label>
        <Form.Select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const value = e.target.value;
            setSortBy(
              value.includes("price")
                ? "price"
                : value.includes("id")
                ? "id"
                : "name"
            );
            setSortOrder(value.includes("desc") ? "desc" : "asc");
          }}
          className={darkMode ? "bg-dark text-light" : ""}
        >
          <option value="name-asc">Nome (A-Z)</option>
          <option value="name-desc">Nome (Z-A)</option>
          <option value="price-asc">Menor Preço</option>
          <option value="price-desc">Maior Preço</option>
          <option value="id-asc">ID (Crescente)</option>
          <option value="id-desc">ID (Decrescente)</option>
        </Form.Select>
      </Form.Group>
    </Form>
  );
};

export default Filters;
