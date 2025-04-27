import React, { useState } from "react";
import { Card, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { FaUser, FaEnvelope, FaLock, FaCamera } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=222&color=fff";

function validateEmail(email) {
  // Must be valid and end with @gmail.com
  const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return re.test(email);
}

function validatePhone(phone) {
  // Only digits, exactly 10 digits
  return /^\d{10}$/.test(phone);
}

function validatePassword(password) {
  // At least 8 characters, at least one letter
  return /^(?=.*[A-Za-z]).{8,}$/.test(password);
}

function validateDOB(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  const dob = new Date(dateStr);
  // Only allow if dob is today or in the past
  return dob <= today;
}

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // for multi-step signup
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dateOfBirth: "",
    mobileNumber: "",
    address: "",
    profilePic: null,
  });
  const [preview, setPreview] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(loginForm.email)) {
      setError("Please enter a valid Gmail address.");
      return;
    }
    if (!validatePassword(loginForm.password)) {
      setError("Password must be at least 8 characters and contain at least one letter.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:4058/api/user/login", loginForm);
      if (res.data.success) {
        login(res.data.token, res.data.user);
        navigate("/");
      } else {
        setError(res.data.message);
      }
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    // Validate all fields
    if (!signupForm.name ||
        !signupForm.email ||
        !signupForm.password ||
        !signupForm.confirmPassword ||
        !signupForm.gender ||
        !signupForm.dateOfBirth ||
        !signupForm.mobileNumber ||
        !signupForm.address
    ) {
      setError("Please fill all fields.");
      return;
    }
    if (!validateEmail(signupForm.email)) {
      setError("Please enter a valid Gmail address.");
      return;
    }
    if (!validatePassword(signupForm.password)) {
      setError("Password must be at least 8 characters and contain at least one letter.");
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!validatePhone(signupForm.mobileNumber)) {
      setError("Phone number must be exactly 10 digits and digits only.");
      return;
    }
    if (!validateDOB(signupForm.dateOfBirth)) {
      setError("Date of Birth cannot be in the future.");
      return;
    }
    try {
      const formData = new FormData();
      Object.entries(signupForm).forEach(([key, value]) => {
        if (key === "profilePic" && value) formData.append("profilePic", value);
        else if (key !== "confirmPassword") formData.append(key, value);
      });
      const res = await axios.post("http://localhost:4058/api/user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        const loginRes = await axios.post("http://localhost:4058/api/user/login", {
          email: signupForm.email,
          password: signupForm.password,
        });
        login(loginRes.data.token, loginRes.data.user);
        navigate("/");
      } else {
        setError(res.data.message);
      }
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setSignupForm((prev) => ({ ...prev, profilePic: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  // Multi-step for signup
  const nextStep = (e) => {
    e.preventDefault();
    setError("");
    if (
      !signupForm.name ||
      !signupForm.email ||
      !signupForm.password ||
      !signupForm.confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }
    if (!validateEmail(signupForm.email)) {
      setError("Please enter a valid Gmail address.");
      return;
    }
    if (!validatePassword(signupForm.password)) {
      setError("Password must be at least 8 characters and contain at least one letter.");
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setStep(2);
  };

  const prevStep = (e) => {
    e.preventDefault();
    setStep(1);
  };

  // Restrict phone input to digits only and max 10 chars
  const handlePhoneInput = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setSignupForm((prev) => ({ ...prev, mobileNumber: value }));
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-center">
        <Card className="auth-card shadow">
          <Card.Body>
            <div className="text-center mb-3">
              <FaUser size={40} className="auth-logo" />
              <h2 className="fw-bold mt-2 mb-1">LiveArt</h2>
              <div className="auth-subtitle">
                {mode === "login" ? "Premium Clothing Experience" : "Join Our Community"}
              </div>
            </div>
            <div className="d-flex justify-content-center mb-4">
              <Button
                variant={mode === "login" ? "dark" : "outline-dark"}
                className="auth-switch-btn"
                onClick={() => { setMode("login"); setStep(1); setError(""); }}
              >
                Sign In
              </Button>
              <Button
                variant={mode === "signup" ? "dark" : "outline-dark"}
                className="auth-switch-btn"
                onClick={() => { setMode("signup"); setStep(1); setError(""); }}
              >
                Create Account
              </Button>
            </div>
            {mode === "login" ? (
              <Form onSubmit={handleLogin}>
                <h5 className="mb-3 fw-bold">Sign In</h5>
                <div className="auth-divider mb-3"></div>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form.Group className="mb-3">
                  <Form.Label className="auth-label"><FaEnvelope className="me-2" />Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your Gmail address"
                    value={loginForm.email}
                    onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="auth-label"><FaLock className="me-2" />Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="dark" className="w-100 mb-2 fw-bold">
                  <FaUser className="me-2" /> SIGN IN
                </Button>
                <div className="text-center mt-2 small">
                  Don't have an account?{" "}
                  <span className="auth-link" onClick={() => { setMode("signup"); setStep(1); setError(""); }}>
                    Create Account
                  </span>
                </div>
              </Form>
            ) : (
              <Form onSubmit={step === 1 ? nextStep : handleSignup}>
                <h5 className="mb-3 fw-bold">Create Account</h5>
                <div className="auth-divider mb-3"></div>
                {error && <Alert variant="danger">{error}</Alert>}
                {step === 1 ? (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label className="auth-label"><FaUser className="me-2" />Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your full name"
                        value={signupForm.name}
                        onChange={e => setSignupForm({ ...signupForm, name: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="auth-label"><FaEnvelope className="me-2" />Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your Gmail address"
                        value={signupForm.email}
                        onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="auth-label"><FaLock className="me-2" />Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Create a password"
                        value={signupForm.password}
                        onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                        required
                      />
                      <Form.Text muted>
                        At least 8 characters, at least one letter.
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label className="auth-label"><FaLock className="me-2" />Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm your password"
                        value={signupForm.confirmPassword}
                        onChange={e => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Button type="submit" variant="dark" className="w-100 fw-bold">
                      NEXT &rarr;
                    </Button>
                    <div className="text-center mt-2 small">
                      Already have an account?{" "}
                      <span className="auth-link" onClick={() => { setMode("login"); setStep(1); setError(""); }}>
                        Sign In
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="d-flex flex-column align-items-center mb-3">
                      <label className="profile-upload-label">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePicChange}
                          style={{ display: "none" }}
                        />
                        <div className="profile-pic-circle">
                          {preview ? (
                            <img src={preview} alt="Preview" className="profile-pic-img" />
                          ) : (
                            <FaCamera size={32} className="profile-pic-icon" />
                          )}
                        </div>
                      </label>
                      <small className="text-muted mt-2">Click to upload profile picture</small>
                    </div>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="auth-label">Gender</Form.Label>
                          <Form.Select
                            value={signupForm.gender}
                            onChange={e => setSignupForm({ ...signupForm, gender: e.target.value })}
                            required
                          >
                            <option value="">Select gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="auth-label">Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            value={signupForm.dateOfBirth}
                            onChange={e => setSignupForm({ ...signupForm, dateOfBirth: e.target.value })}
                            required
                            max={new Date().toISOString().split("T")[0]}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label className="auth-label">Mobile Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="07XXXXXXXX"
                        value={signupForm.mobileNumber}
                        onChange={handlePhoneInput}
                        required
                        maxLength={10}
                        inputMode="numeric"
                        pattern="\d*"
                      />
                      <Form.Text muted>
                        10 digits only, digits only.
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label className="auth-label">Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="Your address"
                        value={signupForm.address}
                        onChange={e => setSignupForm({ ...signupForm, address: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Row>
                      <Col>
                        <Button variant="outline-dark" className="w-100 fw-bold" onClick={prevStep}>
                          &larr; Back
                        </Button>
                      </Col>
                      <Col>
                        <Button type="submit" variant="dark" className="w-100 fw-bold">
                          SIGN UP
                        </Button>
                      </Col>
                    </Row>
                  </>
                )}
              </Form>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
