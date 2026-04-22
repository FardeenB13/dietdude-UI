import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
    CircularProgress,
    Alert,
} from "@mui/material"

import { api } from "./api"

type FreqUnit = "days" | "weeks"

// Diet choices that also exist in the backend DIET_CHOICES
// Keys are display labels; values are the backend enum strings.
const DIET_OPTIONS: { label: string; value: string }[] = [
    { label: "No Restriction", value: "none" },
    { label: "Vegetarian",     value: "vegetarian" },
    { label: "Vegan",          value: "vegan" },
    { label: "Halal",          value: "halal" },
    { label: "Keto",           value: "keto" },
]

const Preferences = () => {
    const navigate = useNavigate()

    // ── Local state ─────────────────────────────────────────────────────────
    const [diet,     setDiet]     = useState<string>("none")
    const [budget,   setBudget]   = useState<string>("")
    const [freqNum,  setFreqNum]  = useState<string>("1")
    const [freqUnit, setFreqUnit] = useState<FreqUnit>("weeks")

    const [loading, setLoading]   = useState(false)
    const [error,   setError]     = useState<string | null>(null)

    useEffect(() => {
        fetch("/api/csrf/", { credentials: "include" })
    }, [])

    // ── Derived display values ───────────────────────────────────────────────
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

    // ── Handlers ─────────────────────────────────────────────────────────────
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

    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) {
            return parts.pop()!.split(";").shift()
        }
        return null
    }

    const handleContinue = async () => {
    setError(null)
    setLoading(true)

    const csrfToken = getCookie("csrftoken")

    try {
        const response = await fetch("/api/user/preferences/", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken || "",
            },
            credentials: "include",
            body: JSON.stringify({
                diet,
                budget: budget || "0",
                shopping_frequency_value: parseInt(freqNum) || 1,
                shopping_frequency_unit: freqUnit,
            }),
        })

        if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            const message =
                data?.detail ||
                Object.values(data).flat().join(" ") ||
                "Failed to save preferences."
            setError(message)
            return
        }

        navigate("/Dashboard")
    } catch {
        setError("Network error. Please try again.")
    } finally {
        setLoading(false)
    }
}

    // ── Render ───────────────────────────────────────────────────────────────
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

                {error && (
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* DIETARY RESTRICTIONS */}
                <Box sx={cardStyle}>
                    <SectionTitle text="Dietary Restrictions" />
                    <FormGroup sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                        {DIET_OPTIONS.map(({ label, value }) => (
                            <FormControlLabel
                                key={value}
                                control={
                                    <Checkbox
                                        checked={diet === value}
                                        onChange={() => setDiet(value)}
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
                    onClick={handleContinue}
                    disabled={loading}
                    sx={{
                        mt: 2,
                        backgroundColor: "#111",
                        borderRadius: 0,
                        px: 5,
                        py: 1.5,
                        fontWeight: 600,
                        "&:hover": { backgroundColor: "#000" },
                        "&.Mui-disabled": { backgroundColor: "#555", color: "#aaa" },
                    }}
                >
                    {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "CONTINUE"}
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
