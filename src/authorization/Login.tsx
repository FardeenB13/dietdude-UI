import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const user = await api.login({ email, password });
            const userKey = user.id ? String(user.id) : user.email.toLowerCase();
            const firstLoginKey = `dietdude_seen_login_${userKey}`;
            const hasLoggedInBefore = localStorage.getItem(firstLoginKey) === "true";

            if (hasLoggedInBefore) {
                navigate("/Dashboard");
            } else {
                localStorage.setItem(firstLoginKey, "true");
                navigate("/Preferences");
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Login failed.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Paper sx ={{p: 4, width: 400}}>
            <Typography variant="h5" mb={2} textAlign="center">
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Password"
                    margin="normal"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && (
                    <Typography color="error" sx={{ mt: 1, fontSize: 14 }}>
                        {error}
                    </Typography>
                )}
                <Button fullWidth variant="contained" sx={{mt: 2}} type="submit" disabled={loading}>
                    Login
                </Button>
                <Typography textAlign="center" mt={2}>
                    Dont have an account? <Link to="/signup"> Sign Up </Link>
                </Typography>
            </form>
            </Paper>
        </Box>
    )
}
