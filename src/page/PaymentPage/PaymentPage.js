import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import OrderReceipt from "./component/OrderReceipt";
import PaymentForm from "./component/PaymentForm";
import "./style/paymentPage.style.css";
import { cc_expires_format } from "../../utils/number";
import { createOrder } from "../../features/order/orderSlice";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { orderNum } = useSelector((state) => state.order);
  const [cardValue, setCardValue] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });
  const navigate = useNavigate();
  const [firstLoading, setFirstLoading] = useState(true);
  const [shipInfo, setShipInfo] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    city: "",
    zip: "",
  });
  const { cartList, totalPrice } = useSelector((state) => state.cart);

  useEffect(() => {
    if (firstLoading) {
      setFirstLoading(false);
    } else {
      if (orderNum !== "") {
        navigate(`/payment/success`);
      }
    }
  }, [orderNum, navigate, firstLoading]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const { firstName, lastName, contact, address, city, zip } = shipInfo;

    dispatch(
      createOrder({
        totalPrice,
        shipTo: { address, city, zip },
        contact: { firstName, lastName, contact },
        orderList: cartList.map((item) => ({
          productId: item.productId._id,
          price: item.productId.price,
          qty: item.qty,
          size: item.size,
        })),
      }),
    );
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setShipInfo({ ...shipInfo, [name]: value });
  };

  const handlePaymentInfoChange = (event) => {
    const { name, value } = event.target;
    if (name === "expiry") {
      let newValue = cc_expires_format(value);
      setCardValue({ ...cardValue, [name]: newValue });
    } else {
      setCardValue({ ...cardValue, [name]: value });
    }
  };

  const handleInputFocus = (e) => {
    setCardValue({ ...cardValue, focus: e.target.name });
  };

  if (cartList?.length === 0) {
    navigate("/cart");
  }

  return (
    <Container className="payment-page-container mb-5">
      <Row className="g-4">
        <Col lg={7}>
          <div className="payment-form-section">
            <Form onSubmit={handleSubmit}>
              {/* 배송 정보 카드 */}
              <Card className="payment-card mb-4">
                <Card.Body className="p-4">
                  <h4 className="section-title mb-4">배송 주소</h4>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="lastName">
                      <Form.Label className="small text-muted">성</Form.Label>
                      <Form.Control
                        type="text"
                        onChange={handleFormChange}
                        required
                        name="lastName"
                        className="custom-input"
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="firstName">
                      <Form.Label className="small text-muted">이름</Form.Label>
                      <Form.Control
                        type="text"
                        onChange={handleFormChange}
                        required
                        name="firstName"
                        className="custom-input"
                      />
                    </Form.Group>
                  </Row>

                  <Form.Group className="mb-3" controlId="contact">
                    <Form.Label className="small text-muted">연락처</Form.Label>
                    <Form.Control
                      placeholder="010-xxxx-xxxx"
                      onChange={handleFormChange}
                      required
                      name="contact"
                      className="custom-input"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="address">
                    <Form.Label className="small text-muted">주소</Form.Label>
                    <Form.Control
                      placeholder="도로명 주소 또는 상세 주소"
                      onChange={handleFormChange}
                      required
                      name="address"
                      className="custom-input"
                    />
                  </Form.Group>

                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="city">
                      <Form.Label className="small text-muted">City</Form.Label>
                      <Form.Control
                        onChange={handleFormChange}
                        required
                        name="city"
                        className="custom-input"
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="zip">
                      <Form.Label className="small text-muted">Zip</Form.Label>
                      <Form.Control
                        onChange={handleFormChange}
                        required
                        name="zip"
                        className="custom-input"
                      />
                    </Form.Group>
                  </Row>
                </Card.Body>
              </Card>

              {/* 결제 정보 카드 */}
              <Card className="payment-card mb-4">
                <Card.Body className="p-4">
                  <h4 className="section-title mb-4">결제 정보</h4>
                  <PaymentForm
                    cardValue={cardValue}
                    handleInputFocus={handleInputFocus}
                    handlePaymentInfoChange={handlePaymentInfoChange}
                  />
                </Card.Body>
              </Card>
              {/* 모바일에서만 보이는 영수증 */}
              <div className="mobile-receipt-area mb-4">
                <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
              </div>

              <Button
                variant="dark"
                className="w-100 payment-final-btn"
                type="submit"
              >
                ₩ {totalPrice.toLocaleString()} 결제하기
              </Button>
            </Form>
          </div>
        </Col>

        {/* 데스크탑 영수증 영역 */}
        <Col lg={5} className="receipt-desktop-area">
          <div className="sticky-receipt">
            <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
