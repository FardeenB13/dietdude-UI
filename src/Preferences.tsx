import { useState, useMemo } from "react"
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    InputAdornment,
    OutlinedInput,
} from "@mui/material"
import { Link as RouterLink } from "react-router-dom";

type FreqUnit = "days" | "weeks"

const Preferences = () => {
    const [dietary, setDietary] = useState<Record<string, boolean>>({
        Halal: false,
        Kosher: false,
        Vegetarian: false,
        Vegan: false,
        "Gluten-Free": false,
        "Dairy-Free": false,
        Keto: false,

    
    })

    const [budget, setBudget] = useState<string>("")
    const [freqNum, setFreqNum] = useState<string>("1")
    const [freqUnit, setFreqUnit] = useState<FreqUnit>("weeks")

    const tripsPerMonth = useMemo(() => {
        const n = parseInt(freqNum) || 1
        return freqUnit === "days"
            ? Math.round(30 / n)
            : Math.round((4 / n) * 10) / 10
    }, [freqNum, freqUnit])

    const monthlyBudget = useMemo(() => {
        const b = parseFloat(budget)
        if (!b || isNaN(b)) return null
        return Math.round(b * tripsPerMonth)
    }, [budget, tripsPerMonth])

    const handleDietaryChange = (label: string) => {
        setDietary((prev) => ({ ...prev, [label]: !prev[label] }))
    }

    const handleFreqNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        if (val === "" || (parseInt(val) >= 1 && parseInt(val) <= 99)) {
            setFreqNum(val)
        }
    }

    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        if (val === "" || parseFloat(val) >= 0) {
            setBudget(val)
        }
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#e9e9e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 8,
            }}
        >
            {/* LEFT BIG TITLE */}
            <Typography
                sx={{
                    fontSize: 120,
                    fontWeight: 800,
                    lineHeight: 1,
                    mr: 6,
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
                    mr: 6,
                }}
            />

            {/* RIGHT CONTENT */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>

                {/* DIETARY RESTRICTIONS */}
                <Box sx={cardStyle}>
                    <SectionTitle text="Dietary Restrictions" />
                    <FormGroup sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                        {Object.keys(dietary).map((label) => (
                            <FormControlLabel
                                key={label}
                                control={
                                    <Checkbox
                                        checked={dietary[label]}
                                        onChange={() => handleDietaryChange(label)}
                                        sx={{
                                            color: "black",
                                            "&.Mui-checked": { color: "black" },
                                        }}
                                    />
                                }
                                label={<Typography>{label}</Typography>}
                            />
                        ))}
                    </FormGroup>
                </Box>

                {/* GROCERY BUDGET */}
                <Box sx={cardStyle}>
                    <SectionTitle text="Grocery Budget" />
                    <OutlinedInput
                        value={budget}
                        onChange={handleBudgetChange}
                        type="number"
                        inputProps={{ min: 0 }}
                        placeholder="0"
                        startAdornment={
                            <InputAdornment position="start">
                                <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#111" }}>
                                    $
                                </Typography>
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">
                                <Typography sx={{ fontSize: 13, color: "#666" }}>per trip</Typography>
                            </InputAdornment>
                        }
                        sx={{
                            backgroundColor: "transparent",
                            "& input": {
                                fontSize: 28,
                                fontWeight: 700,
                                color: "#111",
                                py: 1,
                            },
                            "& fieldset": { borderColor: "#444" },
                            "&:hover fieldset": { borderColor: "#111" },
                            "&.Mui-focused fieldset": { borderColor: "#111" },
                        }}
                    />
                    {monthlyBudget !== null && (
                        <Typography
                            sx={{ fontSize: 12, color: "#666", mt: 1, textAlign: "right" }}
                        >
                            ~${monthlyBudget}/month
                        </Typography>
                    )}
                </Box>

                {/* SHOPPING FREQUENCY */}
                <Box sx={cardStyle}>
                    <SectionTitle text="Shopping Frequency" />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Typography sx={{ fontSize: 14, color: "#555", flexShrink: 0 }}>
                            Every
                        </Typography>

                        <OutlinedInput
                            value={freqNum}
                            onChange={handleFreqNumChange}
                            type="number"
                            inputProps={{ min: 1, max: 99 }}
                            sx={{
                                width: 72,
                                "& input": {
                                    fontSize: 22,
                                    fontWeight: 700,
                                    color: "#111",
                                    textAlign: "center",
                                    py: 1,
                                    px: 1,
                                },
                                "& fieldset": { borderColor: "#444" },
                                "&:hover fieldset": { borderColor: "#111" },
                                "&.Mui-focused fieldset": { borderColor: "#111" },
                            }}
                        />

                        <ToggleButtonGroup
                            value={freqUnit}
                            exclusive
                            onChange={(_, val) => val && setFreqUnit(val)}
                            size="small"
                        >
                            {(["days", "weeks"] as FreqUnit[]).map((unit) => (
                                <ToggleButton
                                    key={unit}
                                    value={unit}
                                    sx={{
                                        px: 2,
                                        textTransform: "lowercase",
                                        fontWeight: 600,
                                        fontSize: 13,
                                        borderColor: "#444",
                                        color: "#444",
                                        "&.Mui-selected": {
                                            backgroundColor: "#111",
                                            color: "#fff",
                                            "&:hover": { backgroundColor: "#000" },
                                        },
                                    }}
                                >
                                    {unit}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Box>

                    <Typography sx={{ fontSize: 12, color: "#666", mt: 1 }}>
                        {tripsPerMonth}x per month
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    component={RouterLink}
                    to="/Dashboard"
                    sx={{
                        mt: 2,
                        backgroundColor: "#111",
                        borderRadius: 0,
                        px: 5,
                        py: 1.5,
                        fontWeight: 600,
                        "&:hover": { backgroundColor: "#000" },
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
    width: 360,
}

const SectionTitle = ({ text }: { text: string }) => (
    <Typography sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}>
        {text}
    </Typography>
)

export default Preferences
