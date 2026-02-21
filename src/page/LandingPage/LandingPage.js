import React, { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";

const LandingPage = () => {
  const dispatch = useDispatch();

  // const productList = useSelector((state) => state.product.productList);
  const { productList, loading } = useSelector((state) => state.product);
  const [query] = useSearchParams();
  const name = query.get("name");
  useEffect(() => {
    dispatch(
      getProductList({
        name,
      }),
    );
  }, [query]);

  return (
    <Container>
      <Row>
        {/* 1. 로딩 중일 때 스피너 표시 */}
        {loading ? (
          <div className="text-align-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : productList.length > 0 ? (
          /* 2. 데이터 로드 완료 및 결과가 있을 때 */
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          /* 3. 로딩이 끝났는데 데이터가 없을 때만 '결과 없음' 표시 */
          <div className="text-align-center empty-bag">
            {name === "" || !name ? (
              <h2>등록된 상품이 없습니다!</h2>
            ) : (
              <h2>{name}과 일치한 상품이 없습니다!</h2>
            )}
          </div>
        )}
      </Row>
    </Container>
  );
};

export default LandingPage;
