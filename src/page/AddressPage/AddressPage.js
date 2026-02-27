import React, { useEffect, useState } from "react";
import { Container, Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import NewAddressDialog from "./component/NewAddressDialog";
import AddressTable from "./component/AddressTable"; // 테이블 컴포넌트 추가
import "./style/address.style.css";
import {
  getAddressList,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../../features/address/addressSlice";

const AddressPage = () => {
  const { addressList } = useSelector((state) => state.address);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("new"); // "new" 또는 "edit"
  const [selectedAddress, setSelectedAddress] = useState(null);
  const dispatch = useDispatch();

  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    city: "",
    zipCode: "",
    isDefault: false, // 추가
  });

  useEffect(() => {
    // [기능 추가] API에서 배송지 목록 가져오기
    dispatch(getAddressList());
  }, [dispatch]);

  useEffect(() => {
    console.log("현재 배송지 목록:", addressList);
  }, [addressList]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleOpenEdit = (address) => {
    setMode("edit");
    setSelectedAddress(address);
    setNewAddress(address); // 기존 값으로 폼 채우기

    const addrInfo = address.addressList[0] || {};
    setNewAddress({
      firstName: address.firstName,
      lastName: address.lastName,
      phoneNumber: address.phoneNumber,
      // 여기서 하위 배열의 값을 폼 필드 이름에 맞게 매칭
      address: addrInfo.address || "",
      city: addrInfo.city || "",
      zipCode: addrInfo.zipCode || "",
      isDefault: addrInfo.isDefault || false,
    });
    setShowForm(true);
  };

  const handleAddOrUpdateAddress = (event) => {
    event.preventDefault();
    if (mode === "new") {
      dispatch(addAddress(newAddress));
    } else {
      console.log("업데이트할 배송지 ID:", selectedAddress.addressList[0]._id);
      console.log("업데이트할 배송지 데이터:", newAddress);
      dispatch(
        updateAddress({
          id: selectedAddress.addressList[0]._id,
          formData: { ...newAddress },
        }),
      );
    }
    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setNewAddress({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      city: "",
      zipCode: "",
      isDefault: false,
    });
    setMode("new");
  };

  const handleDelete = (id) => {
    dispatch(deleteAddress(id));
  };

  return (
    <Container className="address-page-container mb-5">
      <div className="address-header d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">배송지 관리</h2>
        {!showForm && (
          <Button
            variant="dark"
            className="add-address-btn"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + 새 주소 추가
          </Button>
        )}
      </div>

      {showForm && (
        <NewAddressDialog
          mode={mode}
          newAddress={newAddress}
          handleInputChange={handleInputChange}
          handleAddAddress={handleAddOrUpdateAddress}
          setShowForm={setShowForm}
        />
      )}

      <Card className="address-main-card border-0 shadow-sm">
        <Card.Body>
          {addressList.length === 0 ? (
            <div className="empty-address text-center py-5 text-muted">
              등록된 배송지가 없습니다.
            </div>
          ) : (
            <AddressTable
              addressList={addressList}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onSetDefault={(id) => console.log("기본 설정", id)}
            />
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddressPage;
