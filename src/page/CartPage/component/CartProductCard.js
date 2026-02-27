import React from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { currencyFormat } from "../../../utils/number";
import { updateQty, deleteCartItem } from "../../../features/cart/cartSlice";

const CartProductCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleQtyChange = (id, value) => {
    dispatch(updateQty({ id, value }));
  };

  const deleteCart = (id) => {
    // 삭제 전 사용자 확인 (선택 사항)
    if (window.confirm("이 상품을 장바구니에서 삭제하시겠습니까?")) {
      dispatch(deleteCartItem(id));
    }
  };

  return (
    <div className="cart-product-card">
      <Row className="align-items-center">
        {/* 이미지 영역: 겹침 방지를 위해 고정 너비와 비율 유지 */}
        <Col md={3} xs={4} className="cart-img-wrapper">
          <img
            src={item.productId.image}
            className="cart-product-img"
            alt={item.productId.name}
          />
        </Col>

        {/* 정보 영역 */}
        <Col md={9} xs={8} className="cart-info-wrapper">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h5 className="cart-product-title">{item.productId.name}</h5>
              <div className="cart-product-option text-muted">
                Size:{" "}
                <span className="fw-bold text-dark">
                  {item.size.toUpperCase()}
                </span>
              </div>
            </div>
            <button
              className="trash-button"
              onClick={() => deleteCart(item._id)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>

          <div className="cart-product-price-row d-flex justify-content-between align-items-end mt-3">
            <div>
              <div className="unit-price text-muted small">
                단가: ₩ {currencyFormat(item.productId.price)}
              </div>
              <div className="total-item-price fw-bold">
                총액: ₩ {currencyFormat(item.productId.price * item.qty)}
              </div>
            </div>

            <div className="qty-selector-wrapper">
              <Form.Label className="small text-muted mb-1 d-block">
                Quantity
              </Form.Label>
              <Form.Select
                onChange={(event) =>
                  handleQtyChange(item._id, event.target.value)
                }
                required
                defaultValue={item.qty}
                className="qty-dropdown-custom"
              >
                {[...Array(10).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;
