import React from "react";
import "./ProductList.css";
import CustomButton from "../CustomButton";
import ProductCard from "../ProductCard";
import { Grid } from "@mui/material";
import useSocket from "../../customHooks/useSocket";
import { useNavigate } from "react-router-dom";
import { handleScrollIntoView } from "../../utils/helpers";

const ProductList = (props) => {
  const { categoryTitle, onClickViewAll, productData, scrollToTopId } = props;

  const { sendMessage } = useSocket();
  const navigate = useNavigate()

  const onClickProduct = (prodId, catId) => {
    if (prodId) {
      sendMessage({ MT: "2", catId, prodId });
      navigate(`/product/${prodId}`)
    } else {
      // sendMessage({MT: "3", catId, filter: "P" })
      navigate(`/category/${catId}`)
    }
  };

  return (
    <div className="product-list-root">
      {categoryTitle ? (
        <div className="product-list-header">
          <h4>{categoryTitle}</h4>
          {productData.length > 6 ? (
            <CustomButton>View All</CustomButton>
          ) : null}
        </div>
      ) : null}
      <Grid container spacing={3} className="product-list">
        {productData?.length
          ? productData.map((item, index) => (
              <Grid className="product-list-item" item md={2}>
                <ProductCard
                  key={`featured-product-${index}`}
                  onClickProduct={onClickProduct}
                  price={item?.prodMarketPrice}
                  percentOff={item?.prodMarketPrice && "%7 off"}
                  title={item?.prodName || item?.categoryName}
                  productId={item?.productId}
                  categoryId={item?.categoryId}
                  image={
                    item?.productId || item?.categoryId
                      ? require(`../../assets/images/${
                          item?.productId || item?.categoryId
                        }.jpg`)
                      : null
                  }
                />
              </Grid>
            ))
          : null}
      </Grid>
    </div>
  );
};

export default ProductList;
