import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import "./CartItem.css";
import { IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useDispatch } from "react-redux";
import {
  handleProdQuantityUpdate,
  handleDeleteCartItem,
} from "../../redux/dashboardSlice";

const CartItem = (props) => {
  const { cartData } = props;
  const dispatch = useDispatch();
  const increasedValue =
    cartData?.prodMarketPrice + cartData?.prodMarketPrice * (7 / 100);

  const handelProductQuantity = (prodId, shouldIncrease) => {
    if (shouldIncrease) {
      dispatch(handleProdQuantityUpdate({ prodId, shouldIncrease }));
    } else {
      if (cartData.cartQty === 1) {
        return 
      }
      dispatch(handleProdQuantityUpdate({ prodId, shouldIncrease }));
    }
  };

  const handleOnClickDelete = (prodId) => {
    dispatch(handleDeleteCartItem(prodId));
  };

  return (
    <div className="cart-item-root">
      <div className="prod-image-container">
        {cartData?.productId ? (
          <img
            src={require(`../../assets/images/${cartData.productId}.jpg`)}
            alt="product-data"
          />
        ) : null}
      </div>
      <div className="prod-text-container">
        <p>{cartData?.prodName}</p>
        <div className="prod-price">
          <h4>₹{cartData?.prodMarketPrice}</h4>
          <h5>₹{increasedValue}</h5>
          <h6>7% off</h6>
        </div>
        <div className="quantity">
          <IconButton
            onClick={() => handelProductQuantity(cartData?.productId, false)}
          >
            <RemoveCircleOutlineIcon htmlColor="#013678"/>
          </IconButton>
          <div>{cartData?.cartQty}</div>
          <IconButton

            onClick={() => handelProductQuantity(cartData?.productId, true)}
          >
            <AddCircleIcon htmlColor="#013678"/>
          </IconButton>
        </div>
      </div>
      <IconButton onClick={() => handleOnClickDelete(cartData?.productId)}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default CartItem;
