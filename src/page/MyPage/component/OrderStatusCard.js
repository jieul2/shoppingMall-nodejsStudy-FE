import React from "react";
import { Row, Col, Badge } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

const OrderStatusCard = ({ orderItem }) => {
  return (
    <div className="status-card-wrapper">
      <Row className="status-card align-items-center">
        <Col xs={4} md={2} className="text-center">
          <img
            src={orderItem.items[0]?.productId?.image}
            alt={orderItem.items[0]?.productId?.name || "상품 이미지"}
            className="order-img"
          />
        </Col>
        <Col xs={8} md={8} className="order-info">
          <div className="order-num-text">
            <strong>주문번호: {orderItem.orderNum}</strong>
          </div>
          <div className="text-12 date-text">
            {orderItem.createdAt.slice(0, 10)}
          </div>
          <div className="product-name">
            {orderItem.items[0].productId.name}
            {orderItem.items.length > 1 &&
              ` 외 ${orderItem.items.length - 1}개`}
          </div>
          <div className="total-price">
            ₩ {currencyFormat(orderItem.totalPrice)}
          </div>
        </Col>
        <Col xs={12} md={2} className="vertical-middle status-badge-area">
          <div className="text-align-center text-12 hide-on-mobile">
            주문상태
          </div>
          <Badge bg={badgeBg[orderItem.status]} className="status-badge">
            {orderItem.status}
          </Badge>
        </Col>
      </Row>
    </div>
  );
};

export default OrderStatusCard;
