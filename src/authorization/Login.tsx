import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Paper sx ={{p: 4, width: 400}}>
            <Typography variant="h5" mb={2} textAlign="center">
                Login
            </Typography>
            <form>
                <TextField fullWidth label="Email" margin="normal">
                    value={email}
                    setEmail = {email}
                </TextField>
                <TextField fullWidth label="Password" margin="normal">
                    value={password}
                </TextField>
                <Button fullWidth variant="contained" sx={{mt: 2}} type="submit">
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
