import React from "react";
import "./category.css";
import { Chip } from "@mui/material";
import ProductList from "../../components/ProductList";
import useSocket from "../../customHooks/useSocket";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Category = () => {
  const sortOptions = [
    { label: "Popularity", filter: "P" },
    { label: "Price - Low to High", filter: "LH" },
    { label: "Price - High to Low", filter: "HL" },
    { label: "Newest First", filter: "NF" },
  ];

  const [selectedOption, setSelectedOption] = useState("P");

  const params = useParams();

  const { sendMessage, socket } = useSocket();

  const setSelectedSortOption = (option) => {
    setSelectedOption(option);
    sendMessage({ MT: "3", catId: params.catId, filter: option });
  };

  const onClickSort = (filterType) => {
    switch (filterType) {
      case "P": {
        setSelectedSortOption("P");
        break;
      }
      case "LH": {
        setSelectedSortOption("LH");
        break;
      }
      case "HL": {
        setSelectedSortOption("HL");
        break;
      }
      case "NF": {
        setSelectedSortOption("NF");
        break;
      }
      default: {
        setSelectedSortOption("P");
        break;
      }
    }
  };

  useEffect(() => {
    setSelectedSortOption("P")
  }, []);

  const { productCategories } = useSelector((state) => state.dashboardSlice);
  return (
    <div className="category-root">
      <div className="sort-container">
        <h4>Category: <span>Camera</span></h4>
        <div>
          <div className="sort-options">
            <h4>Sort:</h4>
            {sortOptions.map((item, index) => (
              <Chip
                className={selectedOption === item.filter ? "selected" : ""}
                key={`sort-item-${index}`}
                label={item.label}
                variant="outlined"
                onClick={() => onClickSort(item.filter)}
              />
            ))}
          </div>
        </div>
      </div>
      <div>
        <ProductList productData={productCategories} />
      </div>
    </div>
  );
};

export default Category;
