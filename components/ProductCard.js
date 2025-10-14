import Image from "next/image";
import Link from "next/link";
import React from "react";
import "@/stylesheets/productCard.css";

const ProductCard = ({
  product,
  showUserActions = true,
  showActions = false,
}) => {
  return (
    <div className="user-product-card">
      <Link href={`/user/item/details/${product._id}`}>
        <div className="product-image">
          <Image
            src={product.images.main[0].image}
            alt={product.title}
            width={250}
            height={300}
            className="product-image"
          />
          {product.tag.length > 0 && (
            <div
              className={`product-badge ${
                product.shiningEffect ? "shine" : ""
              }`}
            >
              {product.tag[0]}
            </div>
          )}
        </div>
      </Link>
      <div className="product-info">
        <p className="product-brand">TFW</p>
        <h3 className="product-title">{product.title}</h3>
        <div className="product-price">
          <span className="price-current">&#8377;{product.currentPrice}</span>
          <span className="price-original">&#8377;{product.oldPrice}</span>
        </div>
        {showUserActions && (
          <button className="add-to-cart">
            <span>Add to Cart</span>
          </button>
        )}
        {showActions && showActions(product)}
      </div>
    </div>
  );
};

export default ProductCard;
