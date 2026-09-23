import api from "./axiosConfig";


export const createProduct = async (productData, publisherId, imageUrl) => {
  const response = await api.post(
    `/products?publisherId=${publisherId}&imageUrl=${encodeURIComponent(imageUrl)}`,
    productData
  );
  return response.data;
};


export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};


export const getMarketProducts = async (exchangeType, city, page = 0, size = 12) => {
  const response = await api.get("/products/market", {
    params: { exchangeType, city, page, size },
  });
  return response.data;
};


export const getProductsByPublisher = async (publisherId, page = 0, size = 12) => {
  const response = await api.get(`/products/publisher/${publisherId}`, {
    params: { page, size },
  });
  return response.data;
};


export const deleteProduct = async (id, publisherId) => {
  await api.delete(`/products/${id}`, {
    params: { publisherId },
  });
};

export const updateProductStatus = async (id, publisherId, status) => {
  const response = await api.put(`/products/${id}/status`, null, {
    params: { publisherId, status },
  });
  return response.data;
};
