const BASE_URL = "https://api.escuelajs.co/api/v1";

async function request(path, params = {}) {
  const url = new URL(`${BASE_URL}/${path}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value)
  );

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json();
}

export async function fetchProducts(limit = 60) {
  return request("products", { limit });
}

export async function fetchProductsByCategory(categoryId, limit = 60) {
  return request("products", { categoryId, limit });
}

export async function fetchCategories() {
  return request("categories");
}
