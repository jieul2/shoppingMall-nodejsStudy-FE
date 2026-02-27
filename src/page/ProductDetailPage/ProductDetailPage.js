import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ColorRing } from "react-loader-spinner";
import { currencyFormat } from "../../utils/number";
import "./style/productDetail.style.css";
import { getProductDetail } from "../../features/product/productSlice";
import { addToCart } from "../../features/cart/cartSlice";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { selectedProduct, loading } = useSelector((state) => state.product);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1); // 수량 상태 추가
  const { id } = useParams();
  const [sizeError, setSizeError] = useState(false);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const addItemToCart = () => {
    // 사이즈 선택 여부 확인
    if (size === "") {
      setSizeError(true);
      return;
    }
    // 로그인 여부 확인
    if (!user) {
      navigate("/login");
      return;
    }
    // 카트에 아이템 추가 (아이디, 사이즈, 수량 전달)
    dispatch(addToCart({ id, size, qty }));
  };

  const selectSize = (value) => {
    setSize(value);
    if (sizeError) setSizeError(false);
    setQty(1); // 사이즈 변경 시 수량 초기화 (옵션)
  };

  // 수량 조절 함수
  const handleQtyChange = (type) => {
    if (type === "plus") {
      // 해당 사이즈의 재고보다 많이 담지 못하게 제한
      if (qty < selectedProduct.stock[size]) {
        setQty(qty + 1);
      } else if (!size) {
        alert("사이즈를 먼저 선택해주세요.");
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      if (qty > 1) setQty(qty - 1);
    }
  };

  useEffect(() => {
    dispatch(getProductDetail(id));
  }, [id, dispatch]);

  if (loading || !selectedProduct)
    return (
      <div className="loading-container">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          colors={["#000", "#333", "#666", "#999", "#ccc"]}
        />
      </div>
    );

  return (
    <Container className="product-detail-container">
      <Row>
        <Col lg={6} className="product-image-section">
          <img
            src={selectedProduct.image}
            className="product-main-img"
            alt={selectedProduct.name}
          />
        </Col>
        <Col lg={6} className="product-info-section">
          <h2 className="product-title">{selectedProduct.name}</h2>
          <h3 className="product-price">
            ₩ {currencyFormat(selectedProduct.price)}
          </h3>
          <p className="product-description">{selectedProduct.description}</p>

          <hr className="my-4" />

          <div className="size-selection-area mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="section-title">Select Option</span>
              {sizeError && (
                <span className="error-text">옵션을 선택해주세요.</span>
              )}
            </div>

            <div className="size-buttons">
              {Object.keys(selectedProduct.stock).map((item, index) => {
                const isOutOfStock = selectedProduct.stock[item] <= 0;
                return (
                  <button
                    key={index}
                    className={`size-btn ${size === item ? "active" : ""} ${
                      isOutOfStock ? "out-of-stock" : ""
                    }`}
                    onClick={() => !isOutOfStock && selectSize(item)}
                    disabled={isOutOfStock}
                  >
                    {item.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 수량 선택 섹션 추가 */}
          <div className="qty-selection-area mb-4">
            <span className="section-title d-block mb-3">Quantity</span>
            <div className="qty-counter">
              <button
                className="qty-btn"
                onClick={() => handleQtyChange("minus")}
                disabled={qty <= 1}
              >
                -
              </button>
              <span className="qty-number">{qty}</span>
              <button
                className="qty-btn"
                onClick={() => handleQtyChange("plus")}
              >
                +
              </button>
            </div>
          </div>

          <Button
            variant="dark"
            className="add-cart-btn w-100 mt-2"
            onClick={addItemToCart}
          >
            장바구니 담기
          </Button>

          <div className="additional-info mt-4">
            <div className="info-item">
              <span className="info-label">상품 ID:</span>{" "}
              <span className="product-id">{selectedProduct._id}</span>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
