import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.signUp(form);
            navigate("/login");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Sign up failed.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Paper sx={{ p: 4, width: 400 }}>
                <Typography variant="h5" mb={2} textAlign="center">
                    Sign Up
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="First Name" margin="normal"
                        value={form.first_name}
                        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    />
                    <TextField fullWidth label="Last Name" margin="normal"
                        value={form.last_name}
                        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    />
                    <TextField fullWidth label="Email" margin="normal"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <TextField fullWidth label="Password" type="password" margin="normal"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />

                    {error && (
                        <Typography color="error" sx={{ mt: 1, fontSize: 14 }}>
                            {error}
                        </Typography>
                    )}
                    <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit" disabled={loading}>
                        Sign Up
                    </Button>

                    <Typography textAlign="center" mt={2}>
                        Already have an account? <Link to="/login">Login</Link>
                    </Typography>
                </form>
            </Paper>
        </Box>
    );
}