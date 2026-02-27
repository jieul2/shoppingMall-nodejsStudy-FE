import React, { useState } from "react";
import { Offcanvas, Navbar, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleSelectMenu = (url) => {
    setShow(false);
    navigate(url);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const NavbarContent = () => {
    return (
      <div className="sidebar-content-wrapper">
        <div className="sidebar-item admin-title">Admin Account</div>
        <ul className="sidebar-area">
          <li
            className="sidebar-item"
            onClick={() => handleSelectMenu("/admin/product?page=1")}
          >
            Product Management
          </li>
          <li
            className="sidebar-item"
            onClick={() => handleSelectMenu("/admin/order?page=1")}
          >
            Order Management
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      {/* 데스크탑 사이드바 */}
      <div className="sidebar-toggle hide-on-mobile">
        <Link to="/">
          <img width={100} src="/image/hm-logo.png" alt="hm-logo.png" />
        </Link>
        {NavbarContent()}
      </div>

      {/* 모바일 상단 바 */}
      <Navbar
        bg="light"
        expand={false}
        className="mobile-sidebar-toggle show-only-mobile"
      >
        <Container fluid>
          <Link to="/">
            <img width={80} src="/image/hm-logo.png" alt="hm-logo.png" />
          </Link>
          <Navbar.Toggle
            aria-controls={`offcanvasNavbar-expand`}
            onClick={handleShow}
          />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand`}
            aria-labelledby={`offcanvasNavbarLabel-expand`}
            placement="top" // 여기서 'top'으로 설정하면 위에서 아래로 내려옵니다.
            className="mobile-offcanvas-menu"
            show={show}
            onHide={handleClose}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand`}>
                <Link to="/" onClick={handleClose}>
                  <img width={100} src="/image/hm-logo.png" alt="hm-logo.png" />
                </Link>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>{NavbarContent()}</Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default Sidebar;
