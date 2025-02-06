"use client";

import { useRouter } from "next/navigation";

// Firebase imports
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Ensure correct import of Firestore instance

// MUI imports
import { TextField, Button, Container, Typography } from "@mui/material";

// Custom imports
import { useAuth } from "../context/AuthContext";

import { useState } from "react";

const Login = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await login(email, password);
      const user = userCredential.user;

      console.log("User logged in:", user.uid); // Debugging

      // Fetch user role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        console.log("User data from Firestore:", userData); // Debugging

        if (userData.role === "customer") {
          router.push("/customer-dashboard");
        } else if (userData.role === "agent") {
          router.push("/agent-dashboard");
        } else {
          setError("Unknown user role: " + userData.role);
        }
      } else {
        setError("User role not found in Firestore");
        console.log("User document does not exist in Firestore");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "100px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          variant="outlined"
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          margin="normal"
          variant="outlined"
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
