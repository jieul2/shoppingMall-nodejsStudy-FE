import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";

const OrderReceipt = ({ cartList, totalPrice }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="receipt-container">
      <h3 className="receipt-title">주문 요약</h3>
      <div className="receipt-content">
        <ul className="receipt-list">
          {cartList.length > 0 &&
            cartList.map((item, index) => (
              <li key={index} className="receipt-item">
                <div className="d-flex justify-content-between">
                  <span className="item-name text-muted">
                    {item.productId.name} x {item.qty}
                  </span>
                  <span className="item-price">
                    ₩ {currencyFormat(item.productId.price * item.qty)}
                  </span>
                </div>
              </li>
            ))}
        </ul>

        <div className="d-flex justify-content-between align-items-center total-row">
          <span className="total-label">총 결제 금액</span>
          <span className="total-amount">₩ {currencyFormat(totalPrice)}</span>
        </div>

        {location.pathname.includes("/cart") && cartList.length > 0 && (
          <Button
            variant="dark"
            className="w-100 payment-button mt-4"
            onClick={() => navigate("/payment")}
          >
            결제하기
          </Button>
        )}

        <div className="receipt-footer mt-4">
          <p className="footer-text">
            * 결제 단계에서 배송료 및 할인 코드를 적용할 수 있습니다.
          </p>
          <div className="policy-info">
            주문 시 <strong>반품 및 환불 정책</strong>에 동의하는 것으로
            간주됩니다. 30일 이내 무료 반품이 가능합니다.
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
