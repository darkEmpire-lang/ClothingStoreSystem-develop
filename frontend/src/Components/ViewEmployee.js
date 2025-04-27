import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer"; 

function ViewEmployee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:4058/api/employee/${id}`).then((response) => {
      setEmployee(response.data);
    });
  }, [id]);

  return (
    <div>
      <Header/>
    <div className="container mt-5">
      
      <h3>Employee Details</h3>
      <p><strong>Name:</strong> {employee.name}</p>
      <p><strong>Age:</strong> {employee.age}</p>
      <p><strong>Department:</strong> {employee.department}</p>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Mobile:</strong> {employee.mobile}</p>
      <p><strong>Status:</strong> {employee.status}</p>
      <p><strong>Salary:</strong> ${employee.salary}</p>
    </div>
    <Footer/>
    </div>
  );
}

export default ViewEmployee;
