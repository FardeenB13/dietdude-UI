import {
  Box,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Stack,
  TextField,
  Paper,
} from "@mui/material"

import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import React, { useEffect, useState } from "react"

export default function DietDudeDashboard() {
  const [searchText, setSearchText] = useState("")
  const [prompt, setPrompt] = useState("")
  const [groceryList, setGroceryList] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadLatestGroceryList = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await fetch("/api/grocery-list/latest/", {
          method: "GET",
          credentials: "include",
        })

        const data = await response.json().catch(() => ({}))

        if (response.status === 404) {
          setGroceryList("")
          return
        }

        if (!response.ok) {
          throw new Error(data?.detail || "Failed to load grocery list.")
        }

        setGroceryList(data.raw_text || "")
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load grocery list."
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadLatestGroceryList()
  }, [])

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Box sx={{ width: 0, display: "none" }}>
        <Box sx={{ mt: "auto", p: 2, borderTop: "1px solid rgba(0,0,0,0.95)" }}>
          <Card
            sx={{
              bgcolor: "rgba(0,0,0,0.04)",
              borderRadius: 4,
              boxShadow: "none",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <CardContent>
              <Typography sx={{ fontSize: 15, fontWeight: 700 }}>Diet Dude</Typography>
              <Typography sx={{ mt: 1, fontSize: 12, lineHeight: 1.7, color: "rgba(0,0,0,0.58)" }}>
                Personalized meal ideas, grocery planning, and dietary guidance in one place.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            px: { xs: 2, md: 4 },
            py: 2,
            borderBottom: "1px solid rgba(0,0,0,0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: { xs: 22, md: 30 }, fontWeight: 700, letterSpacing: "-0.03em" }}>
              Diet Dude Dashboard
            </Typography>
            <Typography sx={{ mt: 0.75, fontSize: 14, color: "rgba(0,0,0,0.5)" }}>
              Build meal plans and grocery lists around dietary restrictions, preferences, and budget.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              variant="contained"
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                textTransform: "none",
                borderRadius: 3,
                px: 2,
                py: 1,
                bgcolor: "rgba(0,0,0,0.95)",
                color: "#F3F3F3",
                boxShadow: "none",
                "&:hover": { bgcolor: "rgba(0,0,0,0.95)", boxShadow: "none" },
              }}
            >
              Quiz
            </Button>
            <Avatar sx={{ bgcolor: "rgba(16,163,127,0.22)", color: "#212121", fontWeight: 700 }}>
              DD
            </Avatar>
          </Stack>
        </Box>

        <Box sx={{ flex: 1, px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
          <Box sx={{ maxWidth: 1200, ml: 0 }}>
            <Stack spacing={4}>
              <Box sx={{ textAlign: "left" }}>
                <Chip
                  label="AI meal planning for real-life diets"
                  sx={{
                    bgcolor: "rgba(16,163,127,0.12)",
                    color: "#212121",
                    borderRadius: 999,
                    fontWeight: 600,
                    border: "1px solid rgba(16,163,127,0.22)",
                  }}
                />
                <Typography
                  sx={{
                    mt: 3,
                    fontSize: { xs: 30, md: 52 },
                    lineHeight: 1.05,
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                  }}
                >
                  What should Diet Dude help you plan today?
                </Typography>
                <Typography
                  sx={{
                    mt: 2,
                    maxWidth: 760,
                    ml: 0,
                    fontSize: { xs: 14, md: 16 },
                    lineHeight: 1.8,
                    color: "rgba(0,0,0,0.56)",
                  }}
                >
                  Your latest grocery list is generated from the preferences you selected in the quiz.
                </Typography>
              </Box>

              <Card
                sx={{
                  p: { xs: 1.5, md: 2 },
                  borderRadius: 4,
                  bgcolor: "#ffffff",
                  border: "4px solid rgba(0,0,0,0.1)",
                  boxShadow: "0 18px 50px rgba(0,0,0,0.05)",
                }}
              >
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    placeholder="Your grocery list is generated automatically after submitting the quiz"
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon sx={{ color: "rgba(0,0,0,0.95)" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#ffffff",
                        color: "#000000",
                        "& fieldset": { borderColor: "rgba(0,0,0,0.95)" },
                        "&:hover fieldset": { borderColor: "rgba(0,0,0,0.95)" },
                        "&.Mui-focused fieldset": { borderColor: "#10A37F" },
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "rgba(0,0,0,3.0)",
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    placeholder="This section can later be used for follow-up prompts. For now, the grocery list comes from your saved quiz preferences."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        alignItems: "flex-start",
                        bgcolor: "#ffffff",
                        color: "#111111",
                        borderRadius: 3,
                        "& fieldset": { borderColor: "rgba(0,0,0,0.95)" },
                        "&:hover fieldset": { borderColor: "rgba(0,0,0,0.95)" },
                        "&.Mui-focused fieldset": { borderColor: "rgba(16,163,127,0.5)" },
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "rgba(0,0,0,0.5)",
                        opacity: 1,
                      },
                    }}
                  />
                </Stack>
              </Card>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "16fr 1fr" },
                  gap: 3,
                }}
              >
                <Card
                  sx={{
                    borderRadius: 6,
                    bgcolor: "rgba(0,0,0,0.03)",
                    border: "4px solid rgba(0,0,0,0.08)",
                    boxShadow: "none",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                      <Box sx={{ width: "100%" }}>
                        <Typography sx={{ fontSize: 24, fontWeight: 700 }}>Generated Grocery List</Typography>
                        <Typography sx={{ mt: 0.8, fontSize: 14, color: "rgba(0,0,0,0.95)" }}>
                          Generated from your most recently submitted quiz preferences.
                        </Typography>

                        <Box sx={{ mt: 2, minHeight: 350 }}>
                          {loading && (
                            <Typography sx={{ fontSize: 14, color: "rgba(0,0,0,0.7)" }}>
                              Loading grocery list...
                            </Typography>
                          )}

                          {error && !loading && (
                            <Typography sx={{ color: "error.main", mb: 1.5 }}>{error}</Typography>
                          )}

                          {!loading && !groceryList && !error && (
                            <Typography sx={{ fontSize: 14, color: "rgba(0,0,0,0.7)" }}>
                              No grocery list has been generated yet. Complete the quiz to create one.
                            </Typography>
                          )}

                          {!loading && groceryList && (
                            <Paper
                              sx={{
                                p: 2.5,
                                bgcolor: "#fff",
                                border: "1px solid rgba(0,0,0,0.08)",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              <Typography sx={{ fontSize: 15, lineHeight: 1.8, color: "#111" }}>
                                {groceryList}
                              </Typography>
                            </Paper>
                          )}
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                <Stack spacing={3}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      bgcolor: "rgba(0,0,0,0.5)",
                      border: "1px solid rgba(0,0,0,0.95)",
                      boxShadow: "none",
                    }}
                  />
                  <Card
                    sx={{
                      borderRadius: 4,
                      bgcolor: "rgba(0,0,0,0.5)",
                      border: "1px solid rgba(0,0,0,0.5)",
                      boxShadow: "none",
                    }}
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}