import { Box, Typography, Avatar, Button, Card, CardContent, Chip,
        InputAdornment, Stack, TextField,
        Paper, } from "@mui/material"

import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import React, { useState } from 'react';
import { api, type Recipe } from "./api";

export default function DietDudeDashboard() {
  const [searchText, setSearchText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await api.listRecipes({
        search: searchText || prompt,
      });
      setRecipes(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load recipes.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        //bgcolor: "#212121",
        //color: "#ECECEC",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Box
        sx={{
          width: 0,
          display: "none",
        }}
      >

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
          <Box sx={{ maxWidth: 1200, ml : 0}}>
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
                  Enter restrictions, preferences, shopping frequency, or budget to generate meal ideas, grocery lists, and recipe-ready inspiration.
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
                    placeholder="Search meal plans, ingredients, restrictions, or recipes"
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

                  <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "flex-end" }}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={4}
                      placeholder="Example: I need 5 affordable dinners that are vegetarian, nut-free, and under $80 total."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          alignItems: "flex-start",
                          bgcolor: "#ffffff",
                          color: "#F1F1F1",
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

                    <Stack direction={{ xs: "row", md: "column" }} spacing={1.5} sx={{ minWidth: { md: 160 } }}>
                      <Button
                        endIcon={<SendRoundedIcon />}
                        variant="contained"
                        onClick={handleGeneratePlan}
                        disabled={loading}
                        sx={{
                          textTransform: "none",
                          borderRadius: 3,
                          py: 1.4,
                          bgcolor: "#10A37F",
                          color: "#08110F",
                          fontWeight: 700,
                          boxShadow: "none",
                          "&:hover": { bgcolor: "#19B58E", boxShadow: "none" },
                        }}
                      >
                        {loading ? "Generating..." : "Generate Plan"}
                      </Button>
                    </Stack>
                  </Stack>
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
                      <Box>
                        <Typography sx={{ fontSize: 24, fontWeight: 700 }}>Generated Plan</Typography>
                        <Typography sx={{ mt: 0.8, fontSize: 14, color: "rgba(0,0,0,0.95)" }}>
                          A chat-style response area for meals, grocery lists, and recipe links.
                        </Typography>
                        <Box sx={{ mt: 2, minHeight: 350 }}>
                          {error && (
                            <Typography sx={{ color: "error.main", mb: 1.5 }}>{error}</Typography>
                          )}

                          {!loading && recipes.length === 0 && !error && (
                            <Typography sx={{ fontSize: 14, color: "rgba(0,0,0,0.7)" }}>
                              Submit a query to fetch recipe matches.
                            </Typography>
                          )}

                          {recipes.map((recipe) => (
                            <Card key={recipe.id} sx={{ mb: 1.5, bgcolor: "#fff", border: "1px solid rgba(0,0,0,0.08)" }}>
                              <CardContent>
                                <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                                  {recipe.name}
                                </Typography>
                                <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.65)" }}>
                                  {recipe.cooking_time ? `${recipe.cooking_time} min` : "Cooking time N/A"}
                                  {" • "}
                                  {recipe.servings ? `${recipe.servings} servings` : "Servings N/A"}
                                </Typography>
                              </CardContent>
                            </Card>
                          ))}
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
                  >
                  </Card>

                  <Card
                    sx={{
                      borderRadius: 4,
                      bgcolor: "rgba(0,0,0,0.5)",
                      border: "1px solid rgba(0,0,0,0.5)",
                      boxShadow: "none",
                    }}
                  >
                  </Card>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};