import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CartProductCard from "./component/CartProductCard";
import OrderReceipt from "../PaymentPage/component/OrderReceipt";
import "./style/cart.style.css";
import { getCartList } from "../../features/cart/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartList, totalPrice } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCartList());
  }, [dispatch]);

  return (
    <Container className="cart-page-container">
      <h2 className="cart-title mb-4">쇼핑백</h2>
      <Row className="g-4">
        <Col xs={12} lg={8}>
          {cartList.length > 0 ? (
            <div className="cart-list-wrapper">
              {cartList.map((item) => (
                <CartProductCard item={item} key={item._id} />
              ))}
            </div>
          ) : (
            <div className="empty-cart-box">
              <h3 className="mb-3">카트가 비어있습니다.</h3>
              <p className="text-muted">마음에 드는 상품을 담아보세요!</p>
            </div>
          )}
        </Col>
        <Col xs={12} lg={4}>
          <div className="receipt-sticky">
            <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
