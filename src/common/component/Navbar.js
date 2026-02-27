import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBox,
  faSearch,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/user/userSlice";
import { Container, Row, Col } from "react-bootstrap";

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const { cartItemCount } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const menuList = ["여성", "남성", "아동", "H&M HOME", "Sale"];

  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      if (event.target.value === "") return navigate("/");
      navigate(`?name=${event.target.value}`);
    }
  };

  return (
    <nav className="modern-nav-container">
      {/* 관리자 배너 */}
      {user && user.level === "admin" && (
        <div className="admin-top-bar">
          <Link to="/admin/product?page=1">Admin Dashboard</Link>
        </div>
      )}

      <Container>
        {/* 상단 섹션: 로고와 유저 아이콘 */}
        <Row className="align-items-center py-3">
          <Col xs={4} md={4} className="d-flex align-items-center">
            <div className="search-box-wrapper hide-on-mobile">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="제품 검색"
                onKeyPress={onCheckEnter}
                className="nav-search-input"
              />
            </div>
          </Col>

          <Col xs={4} md={4} className="text-center">
            <Link to="/" className="nav-logo-link">
              <h1 className="brand-logo">SHOP</h1>
            </Link>
          </Col>

          <Col
            xs={4}
            md={4}
            className="d-flex justify-content-end align-items-center"
          >
            <div className="nav-icons-group">
              {user ? (
                <div
                  onClick={() => dispatch(logout())}
                  className="icon-item"
                  title="로그아웃"
                >
                  <FontAwesomeIcon icon={faUser} />
                </div>
              ) : (
                <div
                  onClick={() => navigate("/login")}
                  className="icon-item"
                  title="로그인"
                >
                  <FontAwesomeIcon icon={faUser} />
                </div>
              )}
              <div
                onClick={() => navigate("/account/purchase")}
                className="icon-item"
                title="주문내역"
              >
                <FontAwesomeIcon icon={faBox} />
              </div>
              <div
                onClick={() => navigate("/cart")}
                className="icon-item cart-badge-wrapper"
                title="쇼핑백"
              >
                <FontAwesomeIcon icon={faShoppingBag} />
                {cartItemCount > 0 && (
                  <span className="cart-count">{cartItemCount}</span>
                )}
              </div>
            </div>
          </Col>
        </Row>

        {/* 하단 섹션: 메뉴 리스트 및 모바일 전용 검색창 */}
        <div className="nav-bottom-area">
          <ul className="nav-menu-list">
            {menuList.map((menu, index) => (
              <li key={index} className="menu-item">
                <a href="#">{menu}</a>
              </li>
            ))}
          </ul>

          <div className="mobile-search-bar show-only-mobile">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="제품 검색"
              onKeyPress={onCheckEnter}
            />
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
