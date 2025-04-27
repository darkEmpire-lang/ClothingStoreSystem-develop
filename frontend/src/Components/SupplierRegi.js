import React, { useState } from "react";
import axios from "axios";
import Nav from "./Nav";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function SupplierRegi() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:4058/suppliers", data);
      setMessage("Supplier added successfully!");
      reset();
    } catch (error) {
      setMessage("Error adding supplier");
      console.error(error);
    }
  };

  return (
    <div style={styles.mainContainer}>
      <Nav />
      <div style={styles.formWrapper}>
        <h2 style={styles.formTitle}>Register Supplier</h2>

        {message && (
          <p
            style={{
              ...styles.message,
              ...(message.includes("successfully") ? styles.success : styles.error),
            }}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={styles.formContainer}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input type="text" {...register("name", { required: true })} placeholder="Enter supplier name" style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Contact Number</label>
            <input
              type="text"
              {...register("contactNumber", {
                required: "Contact number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Contact number must be exactly 10 digits",
                },
              })}
              placeholder="Enter contact number"
              style={styles.input}
            />
            {errors.contactNumber && (
              <p style={styles.errorMessage}>{errors.contactNumber.message}</p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Address</label>
            <input type="text" {...register("address", { required: true })} placeholder="Enter supplier address" style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Items</label>
            <input type="text" {...register("items", { required: true })} placeholder="Enter supplied items" style={styles.input} />
          </div>

          <button type="submit" style={styles.submitButton}>
            Register Supplier
          </button>
        </form>
      </div>
    </div>
  );
}

export default SupplierRegi;

const styles = {
  mainContainer: {
    background: "linear-gradient(to right, #ece9e6, #ffffff)",
    minHeight: "100vh",
    padding: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  formWrapper: {
    backgroundColor: "#fff",
    padding: "30px 40px",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    width: "100%",
  },
  formTitle: {
    textAlign: "center",
    fontSize: "28px",
    color: "#333",
    marginBottom: "20px",
  },
  message: {
    textAlign: "center",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px",
    fontWeight: "bold",
  },
  success: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "5px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
  submitButton: {
    width: "100%",
    background: "linear-gradient(to right, #007bff, #0056b3)",
    color: "white",
    padding: "12px",
    fontSize: "18px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  submitButtonHover: {
    background: "#0056b3",
  },
  errorMessage: {
    color: "#721c24",
    fontSize: "12px",
    marginTop: "5px",
  },
};
