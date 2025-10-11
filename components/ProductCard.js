import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({product}) => {
  return (
    <Link href={`/user/item/details/${product._id}`} className="product-card">
      <div className="product-image">
        <Image
          src={product.images.main[0]}
          alt={product.title}
          width={250}
          height={300}
          className="product-image"
        />
        <div
          className={`product-badge ${product.shiningEffect ? "shine" : ""}`}
        >
          {product.tag}
        </div>
      </div>
      <div className="product-info">
        <p className="product-brand">TFW</p>
        <h3 className="product-title">{product.title}</h3>
        <div className="product-price">
          <span className="price-current">&#8377;{product.currentPrice}</span>
          <span className="price-original">&#8377;{product.oldPrice}</span>
        </div>
        <button className="add-to-cart">
          <span>Add to Cart</span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
