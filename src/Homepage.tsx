import React from 'react';
import { Container, Grid, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink} from "react-router-dom";

const HomePage = () => {
    return (
        <Container maxWidth="lg">
            <Grid
                container
                spacing={{ xs: 2, md: 8 }} // Dynamic spacing
                alignItems="center"
                sx={{ minHeight: '100vh' }}
            >
                {/* Left Side - Title */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Typography
                        variant="h1"
                        color="primary"
                        sx={{ fontSize: { xs: '4rem', sm: '6rem', md: '8rem' } }}
                    >
                        Diet <br /> Dude.
                    </Typography>
                </Grid>

                {/* Bio */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Box
                        sx={{
                            pl: { md: 4 },
                            borderLeft: { md: 4 },
                            borderColor: 'primary.main'
                        }}
                    >
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Eating well shouldn't feel like a math equation. Our platform
                            transforms your dietary needs and weekly budget into a
                            perfectly curated grocery list.
                        </Typography>

                        <Button
                            component = {RouterLink}
                            to = "/signup"
                            variant="contained"
                            size="large"
                            disableElevation // gives button a little pop
                            sx={{ borderRadius: 0, px: 4 }}
                        >
                        Start Planning 
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};
export default HomePage;