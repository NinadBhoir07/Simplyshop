import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import ProductGrid from "../Products/ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products,
  );
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  // ✅ SINGLE useEffect - no loops
  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  // ✅ Memoized image setter
  useEffect(() => {
    if (selectedProduct?.images?.[0]?.url) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct?.images]);

  // ✅ Memoized handlers
  const handleQuantityChange = useCallback(
    (action) => {
      if (action === "plus") {
        setQuantity((prev) => prev + 1);
      } else if (action === "minus" && quantity > 1) {
        setQuantity((prev) => prev - 1);
      }
    },
    [quantity],
  );

  const handleAddToCart = useCallback(() => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart", {
        duration: 1000,
      });
      return;
    }

    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        sizes: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      }),
    )
      .then(() => {
        toast.success("Product added to cart!", { duration: 1000 });
      })
      .catch((err) => {
        toast.error("Failed to add to cart", { duration: 1000 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  }, [
    dispatch,
    productFetchId,
    quantity,
    selectedSize,
    selectedColor,
    guestId,
    user?._id,
  ]);

  const handleImageClick = useCallback((imageUrl) => {
    setMainImage(imageUrl);
  }, []);

  const handleSizeClick = useCallback((size) => {
    setSelectedSize(size);
  }, []);

  const handleColorClick = useCallback((color) => {
    setSelectedColor(color);
  }, []);

  if (loading) {
    return <div className="p-12 text-center">Loading product details...</div>;
  }

  if (error) {
    return <div className="p-12 text-center text-red-500">Error: {error}</div>;
  }

  if (!selectedProduct) {
    return <div className="p-12 text-center">Product not found</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Images Section */}
          <div className="lg:w-1/2">
            {/* Main Image */}
            {mainImage ? (
              <img
                src={mainImage}
                alt={selectedProduct.name}
                className="w-full h-150 object-cover rounded-2xl shadow-md"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}

            {/* Thumbnails */}
            <div className="flex gap-3 pl-4 mt-10 overflow-x-auto ">
              {selectedProduct.images?.map((image, index) => (
                <img
                  key={image.url || index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-30 object-cover rounded-xl cursor-pointer flex-shrink-0 transition-all ${
                    mainImage === image.url
                      ? "ring-4 ring-blue-500 shadow-lg"
                      : "hover:ring-2 hover:ring-gray-300"
                  }`}
                  onClick={() => handleImageClick(image.url)}
                  loading="lazy"
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {selectedProduct.name}
              </h1>

              {selectedProduct.originalPrice && (
                <p className="text-xl text-gray-500 line-through mb-1">
                  ${selectedProduct.originalPrice}
                </p>
              )}

              <p className="text-3xl font-bold text-gray-900">
                ${selectedProduct.price}
              </p>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* Color Selector */}
            <div>
              <p className="text-lg font-medium mb-3">Color:</p>
              <div className="flex gap-3">
                {selectedProduct.color?.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorClick(color)}
                    className={`w-12 h-12 rounded-full border-4 transition-all shadow-md ${
                      selectedColor === color
                        ? "border-blue-500 shadow-blue-200"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{
                      backgroundColor: color.replace(/\s+/g, "").toLowerCase(),
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <p className="text-lg font-medium mb-3">Size:</p>
              <div className="flex gap-3 flex-wrap">
                {selectedProduct.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeClick(size)}
                    className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                      selectedSize === size
                        ? "bg-black text-white border-black shadow-lg"
                        : "border-gray-300 hover:border-gray-500 hover:shadow-md"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-lg font-medium mb-3">Quantity:</p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl hover:bg-gray-200 transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-2xl font-bold min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl hover:bg-gray-200 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled || !selectedSize || !selectedColor}
              className={`w-full py-4 px-8 rounded-xl text-lg font-bold transition-all shadow-lg ${
                isButtonDisabled || !selectedSize || !selectedColor
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-black to-gray-900 text-white hover:from-gray-900 hover:to-black hover:shadow-xl hover:scale-[1.02]"
              }`}
            >
              {isButtonDisabled ? "Adding..." : "ADD TO CART"}
            </button>

            {/* Product Details Table */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <span className="font-medium">Brand:</span>
              <span>{selectedProduct.brand || "N/A"}</span>

              <span className="font-medium">Material:</span>
              <span>{selectedProduct.material || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            You May Also Like
          </h2>
          <ProductGrid
            products={similarProducts}
            loading={false}
            error={null}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
