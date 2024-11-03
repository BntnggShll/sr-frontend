import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductTable = () => {
  const [products, setProducts] = useState([]); // State untuk menyimpan data produk
  const [showModal, setShowModal] = useState(false); // State untuk menampilkan modal
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageProduct, setCurrentPageProduct] = useState(0); // State untuk halaman user
  const itemsPerPage = 10; // Maksimal 10 data per halaman
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  }); // State untuk menambahkan produk baru
  const [editingProduct, setEditingProduct] = useState(null); // State untuk menyimpan data produk yang sedang diedit

  // Mengambil data produk dari API
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products`)
      .then((response) => {
        setProducts(response.data.product);
      })
      .catch((error) => {
        console.error("Error fetching products", error);
      });
  }, []);

  // Fungsi untuk menambah produk baru
  const handleAddProduct = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("stock", newProduct.stock);
    if (newProduct.image) {
      formData.append("image", newProduct.image); // Append gambar ke FormData
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setProducts([...products, response.data.product]);
        setShowModal(false);
        setNewProduct({
          name: "",
          description: "",
          price: "",
          stock: "",
          image: null,
        });
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error adding product", error);
      });
  };

  // Fungsi untuk mengedit produk
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct(product); // Set produk yang ingin diedit ke dalam form
    setShowModal(true);
  };

  // Mengedit fungsi handleSaveEdit untuk memastikan gambar diproses dengan benar
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", Number(newProduct.price));
    formData.append("stock", Number(newProduct.stock));
    if (newProduct.image) {
      formData.append("image", newProduct.image); // Append gambar ke FormData
    }

    axios
      .put(
        `${process.env.REACT_APP_API_URL}/products/${editingProduct.product_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        const updatedProducts = products.map((product) =>
          product.product_id === editingProduct.product_id
            ? response.data.product
            : product
        );
        setProducts(updatedProducts);
        setShowModal(false);
        setNewProduct({
          name: "",
          description: "",
          price: "",
          stock: "",
          image: null,
        });
        setEditingProduct(null);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error status:", error.response.status);
        } else {
          console.error("Error", error.message);
        }
      });
  };

  // Pagination untuk user
  const startIndexProduct = currentPageProduct * itemsPerPage;
  const endIndexProduct = startIndexProduct + itemsPerPage;
  const currentProduct = products.slice(startIndexProduct, endIndexProduct);

  const nextPageproducts = () => {
    if (endIndexProduct < products.length) {
      currentPageProduct((prevPage) => prevPage + 1);
    }
  };

  const prevPageproducts = () => {
    if (currentPageProduct > 0) {
      setCurrentPageProduct((prevPage) => prevPage - 1);
    }
  };

  // Fungsi untuk menghapus produk
  const handleDeleteProduct = (product_id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/products/${product_id}`)
      .then(() => {
        setProducts(products.filter((product) => product.id !== product_id));
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting product", error);
      });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div id="dataproduct">
      <nav>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h2>Data Product</h2>
          </div>

          <div>
            <input
              type="text"
              placeholder="Cari nama Product"
              value={searchQuery}
              onChange={handleSearch}
              className="form-control"
            />
          </div>
          <div className="tambah-product">
            <button
              className="btn btn-success"
              onClick={() => setShowModal(true)}
            >
              Tambah Produk
            </button>
          </div>
        </div>
      </nav>

      {/* Tabel Produk */}
      <div id="table">
        <table className="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProduct.map((product) => (
              <tr key={product.product_id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteProduct(product.product_id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Popup Form Tambah/Edit Produk */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingProduct ? "Edit Produk" : "Tambah Produk"}</h2>
            <form onSubmit={editingProduct ? handleSaveEdit : handleAddProduct}>
              <div className="form-group">
                <label>Nama:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  className="form-control"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock:</label>
                <input
                  type="number"
                  className="form-control"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL:</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.files[0] })
                  }
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? "Simpan Perubahan" : "Tambah"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="pagination">
        <button onClick={prevPageproducts} disabled={currentPageProduct === 0}>
          Previous
        </button>
        <button
          onClick={nextPageproducts}
          disabled={endIndexProduct >= products.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductTable;
