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
import { Container, Row, Col, Dropdown } from "react-bootstrap";

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const { cartItemCount } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      if (event.target.value === "") return navigate("/");
      navigate(`?name=${event.target.value}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="modern-nav-container">
      {/* 관리자 배너 (기존 유지) */}

      <Container>
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
              {/* 유저 메뉴 드롭다운 */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  as="div"
                  className="icon-item custom-dropdown-toggle"
                >
                  <FontAwesomeIcon icon={faUser} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {user ? (
                    <>
                      <Dropdown.Header>
                        {user.name}님 환영합니다
                      </Dropdown.Header>
                      <Dropdown.Item
                        onClick={() => navigate("/account/purchase")}
                      >
                        마이페이지 (주문내역)
                      </Dropdown.Item>
                      {user.level === "admin" && (
                        <Dropdown.Item
                          onClick={() => navigate("/admin/product?page=1")}
                        >
                          어드민 페이지
                        </Dropdown.Item>
                      )}
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout}>
                        로그아웃
                      </Dropdown.Item>
                    </>
                  ) : (
                    <Dropdown.Item onClick={() => navigate("/login")}>
                      로그인 / 회원가입
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>

              {/* 쇼핑백 (기존 유지) */}
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

        <div className="nav-bottom-area">
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
