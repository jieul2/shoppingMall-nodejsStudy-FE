import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import OrderReceipt from "./component/OrderReceipt";
import PaymentForm from "./component/PaymentForm";
import "./style/paymentPage.style.css";
import { cc_expires_format } from "../../utils/number";
import { createOrder } from "../../features/order/orderSlice";
import { getAddressList } from "../../features/address/addressSlice";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { orderNum } = useSelector((state) => state.order);
  const { addressList } = useSelector((state) => state.address);
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
  // [기능 추가] 페이지 로드 시 주소 목록 불러오기
  useEffect(() => {
    dispatch(getAddressList());
  }, [dispatch]);

  // [기능 추가] 주소 선택 시 폼에 자동 채우기
  const handleSelectAddress = (addrContainer) => {
    const addr = addrContainer.addressList[0]; // 현재 구조상 [0]에 주소가 있음
    setShipInfo({
      firstName: addrContainer.firstName,
      lastName: addrContainer.lastName,
      contact: addrContainer.phoneNumber,
      address: addr.address,
      city: addr.city,
      zip: addr.zipCode,
    });
  };

  // [기능 추가] 주소 폼 초기화 (새 주소 추가용)
  const handleResetForm = () => {
    setShipInfo({
      firstName: "",
      lastName: "",
      contact: "",
      address: "",
      city: "",
      zip: "",
    });
  };
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
            {/* [추가] 저장된 배송지 선택 섹션 */}
            <Card className="payment-card mb-4 border-primary">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="section-title mb-0">내 배송지 선택</h4>
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={handleResetForm}
                  >
                    새 주소 입력
                  </Button>
                </div>

                <div className="address-selector-wrapper d-flex gap-2 overflow-auto pb-2">
                  {addressList && addressList.length > 0 ? (
                    addressList.map((item) => (
                      <Card
                        key={item._id}
                        className="address-select-item p-3 flex-shrink-0 cursor-pointer"
                        style={{ width: "200px", cursor: "pointer" }}
                        onClick={() => handleSelectAddress(item)}
                      >
                        <div className="fw-bold mb-1">
                          {item.lastName}
                          {item.firstName}
                          {item.addressList[0]?.isDefault && (
                            <Badge
                              bg="dark"
                              className="ms-2"
                              style={{ fontSize: "10px" }}
                            >
                              기본
                            </Badge>
                          )}
                        </div>
                        <div className="small text-muted text-truncate">
                          {item.addressList[0]?.address}
                        </div>
                        <div className="extra-small text-muted">
                          {item.phoneNumber}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted small">저장된 주소가 없습니다.</p>
                  )}
                </div>
              </Card.Body>
            </Card>

            <Form onSubmit={handleSubmit}>
              <Card className="payment-card mb-4">
                <Card.Body className="p-4">
                  <h4 className="section-title mb-4">배송 주소 확인</h4>
                  {/* 기존 배송지 Form.Group 항목들은 value={shipInfo.xxx}를 추가해야 자동 채우기가 작동합니다 */}
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="lastName">
                      <Form.Label className="small text-muted">성</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={shipInfo.lastName} // value 추가
                        onChange={handleFormChange}
                        required
                        className="custom-input"
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="firstName">
                      <Form.Label className="small text-muted">이름</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={shipInfo.firstName} // value 추가
                        onChange={handleFormChange}
                        required
                        className="custom-input"
                      />
                    </Form.Group>
                  </Row>

                  <Form.Group className="mb-3" controlId="contact">
                    <Form.Label className="small text-muted">연락처</Form.Label>
                    <Form.Control
                      name="contact"
                      value={shipInfo.contact} // value 추가
                      onChange={handleFormChange}
                      required
                      className="custom-input"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="address">
                    <Form.Label className="small text-muted">주소</Form.Label>
                    <Form.Control
                      name="address"
                      value={shipInfo.address} // value 추가
                      onChange={handleFormChange}
                      required
                      className="custom-input"
                    />
                  </Form.Group>

                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="city">
                      <Form.Label className="small text-muted">City</Form.Label>
                      <Form.Control
                        name="city"
                        value={shipInfo.city} // value 추가
                        onChange={handleFormChange}
                        required
                        className="custom-input"
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="zip">
                      <Form.Label className="small text-muted">Zip</Form.Label>
                      <Form.Control
                        name="zip"
                        value={shipInfo.zip} // value 추가
                        onChange={handleFormChange}
                        required
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
