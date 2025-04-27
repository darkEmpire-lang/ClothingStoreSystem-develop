import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const URL = "http://localhost:4058/category";

// Fetch categories
const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    if (response.data && response.data.categories) {
      return response.data.categories;
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Delete category
const deleteHandler = async (id) => {
  try {
    const res = await axios.delete(`${URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

function Category() {
  const [categories, setCategories] = useState([]);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchHandler().then((data) => setCategories(data));
  }, []);

  const handleDelete = (id) => {
    deleteHandler(id)
      .then(() => {
        setCategories((prev) => prev.filter((cat) => cat._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
      });
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Sort and filter categories
  const sortedCategories = [...categories].sort((a, b) => {
    const valA = a[sortField]?.toLowerCase?.() || "";
    const valB = b[sortField]?.toLowerCase?.() || "";
    return sortOrder === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  const filteredCategories = sortedCategories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Nav />
      <h1 className="text-center mt-4 mb-3 text-dark">Total Categories</h1>

      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="container-fluid">
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead className="bg-dark text-white">
              <tr>
                <th
                  onClick={() => handleSortChange("name")}
                  style={{ cursor: "pointer" }}
                  className="text-center"
                >
                  Category Name{" "}
                  {sortField === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th className="text-center">Type</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category._id}>
                    <td className="text-center">{category.name}</td>
                    <td className="text-center">{category.types}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(category._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No categories available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Category;
