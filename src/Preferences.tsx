import { Box, Typography, FormGroup, FormControlLabel, Checkbox, Button } from "@mui/material"

const Preferences = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#e9e9e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 8
            }}
        >

            {/* LEFT BIG TITLE */}
            <Typography
                sx={{
                    fontSize: 120,
                    fontWeight: 800,
                    lineHeight: 1,
                    mr: 6
                }}
            >
                Grocery<br />Preferences.
            </Typography>


            {/* DIVIDER */}
            <Box
                sx={{
                    width: 4,
                    height: 420,
                    backgroundColor: "#222",
                    mr: 6
                }}
            />


            {/* RIGHT CONTENT */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4
                }}
            >

                {/* BOX 1 */}
                <Box sx={cardStyle}>
                    <SectionTitle text="Dietary Restrictions" />
                    <Options>
                        {["Halal", "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free"].map((t) =>
                            <Check key={t} text={t} />
                        )}
                    </Options>
                </Box>

                {/* BOX 2 */}
                <Box sx={cardStyle}>
                    <SectionTitle text="Grocery Budget" />
                    <Options>
                        {["$0 – $50", "$50 – $100", "$100 – $150", "$150+"].map((t) =>
                            <Check key={t} text={t} />
                        )}
                    </Options>
                </Box>

                {/* BOX 3 */}
                <Box sx={cardStyle}>
                    <SectionTitle text="Shopping Frequency" />
                    <Options>
                        {[
                            "Multiple times a week",
                            "Once a week",
                            "Every 2 weeks",
                            "Once a month"
                        ].map((t) =>
                            <Check key={t} text={t} />
                        )}
                    </Options>
                </Box>

                <Button
                    variant="contained"
                    sx={{
                        mt: 2,
                        backgroundColor: "#111",
                        borderRadius: 0,
                        px: 5,
                        py: 1.5,
                        fontWeight: 600,
                        "&:hover": { backgroundColor: "#000" }
                    }}
                >
                    CONTINUE
                </Button>

            </Box>

        </Box>
    )
}

const cardStyle = {
    backgroundColor: "#cfcfcf",
    border: "2px solid black",
    borderRadius: 3,
    px: 4,
    py: 4,
    width: 360
}

const SectionTitle = ({ text }) => (
    <Typography
        sx={{
            fontWeight: 700,
            mb: 2,
            textAlign: "center"
        }}
    >
        {text}
    </Typography>
)

const Options = ({ children }) => (
    <FormGroup sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
        {children}
    </FormGroup>
)

const Check = ({ text }) => (
    <FormControlLabel
        control={
            <Checkbox
                sx={{
                    color: "black",
                    "&.Mui-checked": { color: "black" }
                }}
            />
        }
        label={<Typography>{text}</Typography>}
    />
)

export default Preferences