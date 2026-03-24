import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fname: "",
        lname: "",
        email: "",
        password: "",
    });

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Paper sx={{ p: 4, width: 400 }}>
                <Typography variant="h5" mb={2} textAlign="center">
                    Sign Up
                </Typography>

                <form >
                    <TextField fullWidth label="First Name" margin="normal"
                        value={form.fname}
                        onChange={(e) => setForm({ ...form, fname: e.target.value })}
                    />
                    <TextField fullWidth label="Last Name" margin="normal"
                        value={form.lname}
                        onChange={(e) => setForm({ ...form, lname: e.target.value })}
                    />
                    <TextField fullWidth label="Email" margin="normal"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <TextField fullWidth label="Password" type="password" margin="normal"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />

                    <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
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