import React, { useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import OrderStatusCard from "./component/OrderStatusCard";
import { useNavigate } from "react-router-dom";
import "./style/orderStatus.style.css";
import { getOrder } from "../../features/order/orderSlice";

const MyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderList } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user); // 사용자 정보 가져오기

  useEffect(() => {
    dispatch(getOrder());
  }, [dispatch]);

  return (
    <Container className="status-card-container mb-5">
      {/* 마이페이지 헤더 섹션 */}
      <div className="mypage-header mb-4 py-4 border-bottom">
        <Row className="align-items-center">
          <Col md={8}>
            <h2 className="fw-bold mb-1">마이페이지</h2>
            <p className="text-muted mb-0">
              {user?.name}님의 주문 내역과 회원 정보를 관리하세요.
            </p>
          </Col>
          <Col md={4} className="text-md-end mt-3 mt-md-0">
            {/* 회원정보 수정 버튼 (기존) */}
            <Button variant="outline-dark" className="me-2 rounded-pill px-4">
              정보 수정
            </Button>

            {/* 배송지 관리 버튼 (새로 추가) */}
            <Button
              variant="dark"
              className="rounded-pill px-4"
              onClick={() => navigate("/address")} // AppRouter에 설정할 경로
            >
              배송지 관리
            </Button>
          </Col>
        </Row>
      </div>

      {/* 사용자 요약 정보 카드 */}
      <Card className="mb-5 border-0 shadow-sm bg-light">
        <Card.Body className="p-4">
          <Row>
            <Col sm={6} md={3} className="mb-3 mb-md-0">
              <div className="info-label text-muted small">이름</div>
              <div className="fw-bold">{user?.name || "사용자"}</div>
            </Col>
            <Col sm={6} md={3} className="mb-3 mb-md-0">
              <div className="info-label text-muted small">이메일</div>
              <div className="fw-bold">{user?.email || "이메일 정보 없음"}</div>
            </Col>
            <Col sm={6} md={3}>
              <div className="info-label text-muted small">총 주문 건수</div>
              <div className="fw-bold text-primary">
                {orderList?.length || 0}건
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 주문 내역 섹션 */}
      <h4 className="fw-bold mb-4">최근 주문 내역</h4>
      {orderList?.length === 0 ? (
        <div className="no-order-box text-center py-5 border rounded bg-white">
          <div className="text-muted mb-3">진행중인 주문이 없습니다.</div>
          <Button variant="dark" onClick={() => (window.location.href = "/")}>
            쇼핑하러 가기
          </Button>
        </div>
      ) : (
        <div className="order-list">
          {orderList.map((item) => (
            <OrderStatusCard orderItem={item} key={item._id} />
          ))}
        </div>
      )}
    </Container>
  );
};

export default MyPage;
