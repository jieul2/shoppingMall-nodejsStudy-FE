import React from "react";
import { Form, Row, Col, Button, Card } from "react-bootstrap";
// 로딩 상태를 보여주고 싶다면 useSelector를 사용할 수 있습니다.
import { useSelector } from "react-redux";

const NewAddressDialog = ({
  mode,
  newAddress,
  handleInputChange,
  handleAddAddress,
  setShowForm,
}) => {
  // 리덕스의 로딩 상태를 가져와서 저장 중일 때 버튼을 비활성화할 수 있습니다.
  const { loading } = useSelector((state) => state.address);

  return (
    <Card className="address-card mb-4 border-0 shadow-sm p-4">
      <Card.Body>
        <h5 className="fw-bold mb-4">
          {mode === "new" ? "새 배송지 추가" : "배송지 수정"}
        </h5>
        <Form onSubmit={handleAddAddress}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small text-muted">
                  성 (Last Name)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={newAddress.lastName || ""}
                  onChange={handleInputChange}
                  required
                  className="custom-input"
                  disabled={loading}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small text-muted">
                  이름 (First Name)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={newAddress.firstName || ""}
                  onChange={handleInputChange}
                  required
                  className="custom-input"
                  disabled={loading}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="small text-muted">연락처 (Phone)</Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              value={newAddress.phoneNumber || ""}
              onChange={handleInputChange}
              required
              className="custom-input"
              placeholder="010-XXXX-XXXX"
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small text-muted">주소 (Address)</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={newAddress.address || ""}
              onChange={handleInputChange}
              required
              className="custom-input"
              disabled={loading}
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small text-muted">
                  도시 (City)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={newAddress.city || ""}
                  onChange={handleInputChange}
                  required
                  className="custom-input"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small text-muted">
                  우편번호 (Zip)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="zipCode"
                  value={newAddress.zipCode || ""}
                  onChange={handleInputChange}
                  required
                  className="custom-input"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              id="default-address-check"
              label="기본 배송지로 설정"
              name="isDefault"
              checked={newAddress.isDefault || false}
              onChange={(e) =>
                handleInputChange({
                  target: { name: "isDefault", value: e.target.checked },
                })
              }
              className="small text-muted"
            />
          </Form.Group>

          <div className="d-flex gap-2 mt-2">
            <Button
              variant="outline-dark"
              className="w-50 save-pill"
              onClick={() => setShowForm(false)}
              disabled={loading}
            >
              취소
            </Button>
            <Button
              variant="dark"
              type="submit"
              className="w-50 save-pill"
              disabled={loading}
            >
              {loading
                ? "처리 중..."
                : mode === "new"
                  ? "주소 저장하기"
                  : "수정 완료"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default NewAddressDialog;
