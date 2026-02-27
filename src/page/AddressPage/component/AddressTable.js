import React from "react";
import { Table, Button, Badge } from "react-bootstrap";

const AddressTable = ({ addressList, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <Table className="address-table">
        <thead>
          <tr>
            <th style={{ minWidth: "100px" }}>성함</th>
            <th style={{ minWidth: "130px" }}>연락처</th>
            <th>주소 목록</th>
            <th className="text-center" style={{ minWidth: "150px" }}>
              관리
            </th>
          </tr>
        </thead>
        <tbody style={{ verticalAlign: "middle" }}>
          {addressList && addressList.length > 0 ? (
            addressList.map((item) => (
              <tr key={item._id}>
                <td className="fw-bold">
                  {item.lastName}
                  {item.firstName}
                </td>
                <td className="text-muted">{item.phoneNumber}</td>
                <td>
                  {item.addressList &&
                    item.addressList.map((addr, index) => (
                      <div key={addr._id || index} className="py-1">
                        <div className="address-text d-flex align-items-center">
                          <span className="me-2">{addr.address}</span>
                          {addr.isDefault && (
                            <Badge
                              bg="dark"
                              className="default-badge"
                              style={{ fontSize: "10px" }}
                            >
                              기본
                            </Badge>
                          )}
                        </div>
                        <div className="text-muted extra-small">
                          {addr.city}, {addr.zipCode}
                        </div>
                      </div>
                    ))}
                </td>
                <td>
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="table-btn px-3"
                      onClick={() => onEdit(item)}
                    >
                      수정
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="table-btn px-3"
                      onClick={() => onDelete(item._id)}
                    >
                      삭제
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-muted">
                등록된 배송지가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AddressTable;
