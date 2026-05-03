import {
  Box,
  Typography,
  Avatar,
  Button,
  Stack,
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
  Chip,
  Collapse,
} from "@mui/material"

import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import SendRoundedIcon from "@mui/icons-material/SendRounded"
import TuneRoundedIcon from "@mui/icons-material/TuneRounded"
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded"
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded"
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded"
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded"
import React, { useEffect, useState, useRef } from "react"
import { Link as RouterLink } from "react-router-dom"

// ─── helpers ────────────────────────────────────────────────────────────────

const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
  return null
}

// ─── sub-components ─────────────────────────────────────────────────────────

const SectionTitle = ({ text }) => (
  <Typography sx={{
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.5)",
    mb: 2,
  }}>
    {text}
  </Typography>
)

// Safely resolve a display name from whatever shape the ingredient comes in
const getIngredientName = (ri) => {
  // { ingredient: { name: "Chicken", ... } }
  if (ri.ingredient && typeof ri.ingredient === "object") {
    return (
      ri.ingredient.name ??
      ri.ingredient.title ??
      // fallback: first string value in the object
      Object.values(ri.ingredient).find((v) => typeof v === "string") ??
      "Unknown"
    )
  }
  // { ingredient: "Chicken" }
  if (typeof ri.ingredient === "string") return ri.ingredient
  // { name: "Chicken" } — flat serializer
  if (ri.name) return ri.name
  return "Unknown"
}

// Try every key the serializer might use for the ingredient rows
const getIngredients = (recipe) =>
  recipe.recipeingredient_set ??
  recipe.recipe_ingredients ??
  recipe.ingredients ??
  []

const RecipeCard = ({ recipe }) => {
  const [open, setOpen] = useState(false)
  const ingredients = getIngredients(recipe)
  const matched = recipe.matched_ingredients ?? ingredients.length
  const total = recipe.total_ingredients ?? ingredients.length

  return (
    <Box sx={{ border: "2px solid #444", bgcolor: "#ddd", mb: 1.5 }}>
      {/* header row */}
      <Box
        onClick={() => setOpen((o) => !o)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.8,
          cursor: "pointer",
          "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#111", lineHeight: 1.3 }}>
            {recipe.name}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 0.6 }}>
            {recipe.cooking_time && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <AccessTimeRoundedIcon sx={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }} />
                <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}>
                  {recipe.cooking_time} min
                </Typography>
              </Stack>
            )}
            {recipe.servings && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <PeopleOutlineRoundedIcon sx={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }} />
                <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}>
                  {recipe.servings} servings
                </Typography>
              </Stack>
            )}
          </Stack>
        </Box>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Chip
            label={`${matched}/${total} ingredients`}
            size="small"
            sx={{ bgcolor: "#222", color: "#e9e9e9", fontWeight: 700, fontSize: 10, height: 22, borderRadius: 0 }}
          />
          {open
            ? <ExpandLessRoundedIcon sx={{ fontSize: 18, color: "#444" }} />
            : <ExpandMoreRoundedIcon sx={{ fontSize: 18, color: "#444" }} />
          }
        </Stack>
      </Box>

      {/* expanded body */}
      <Collapse in={open}>
        <Box sx={{ px: 2.5, pb: 2.5, borderTop: "1px solid rgba(0,0,0,0.15)" }}>
          <Typography sx={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
            textTransform: "uppercase", color: "rgba(0,0,0,0.4)", mt: 1.5, mb: 1,
          }}>
            Ingredients
          </Typography>

          {ingredients.length === 0 ? (
            <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.4)", fontStyle: "italic" }}>
              No ingredient data returned — ensure your serializer includes recipeingredient_set.
            </Typography>
          ) : (
            <Stack spacing={0.4}>
              {ingredients.map((ri, i) => (
                <Typography key={i} sx={{ fontSize: 13, color: "#222", lineHeight: 1.6 }}>
                  {ri.quantity ? <span style={{ color: "rgba(0,0,0,0.5)" }}>{ri.quantity} </span> : null}
                  {ri.unit ? <span style={{ color: "rgba(0,0,0,0.5)" }}>{ri.unit} </span> : null}
                  <strong>{getIngredientName(ri)}</strong>
                </Typography>
              ))}
            </Stack>
          )}

          {recipe.instructions && (
            <>
              <Typography sx={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
                textTransform: "uppercase", color: "rgba(0,0,0,0.4)", mt: 2.5, mb: 1,
              }}>
                Instructions
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#333", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                {recipe.instructions}
              </Typography>
            </>
          )}
        </Box>
      </Collapse>
    </Box>
  )
}

// ─── chat message ────────────────────────────────────────────────────────────

const ChatMessage = ({ role, text }) => (
  <Box sx={{
    display: "flex",
    justifyContent: role === "user" ? "flex-end" : "flex-start",
    mb: 1.5,
  }}>
    <Box sx={{
      maxWidth: "82%",
      px: 2,
      py: 1.5,
      border: "2px solid #444",
      bgcolor: role === "user" ? "#222" : "#ddd",
      color: role === "user" ? "#e9e9e9" : "#111",
    }}>
      <Typography sx={{ fontSize: 13, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
        {text}
      </Typography>
    </Box>
  </Box>
)

// ─── main component ──────────────────────────────────────────────────────────

export default function DietDudeDashboard() {
  const [groceryList, setGroceryList] = useState("")
  const [groceryLoading, setGroceryLoading] = useState(true)
  const [groceryError, setGroceryError] = useState("")
  const [searchText, setSearchText] = useState("")
  const [recipes, setRecipes] = useState([])
  const [recipesLoading, setRecipesLoading] = useState(true)
  const [recipesError, setRecipesError] = useState("")
  const [messages, setMessages] = useState([])
  const [prompt, setPrompt] = useState("")
  const [askLoading, setAskLoading] = useState(false)
  const [askError, setAskError] = useState("")
  const chatEndRef = useRef(null)

  // fetch grocery list
  useEffect(() => {
    ; (async () => {
      setGroceryLoading(true)
      setGroceryError("")
      try {
        const res = await fetch("/api/grocery-list/latest/", { credentials: "include" })
        const data = await res.json().catch(() => ({}))
        if (res.status === 404) { setGroceryList(""); return }
        if (!res.ok) throw new Error(data?.detail || "Failed to load grocery list.")
        setGroceryList(data.raw_text || "")
      } catch (err) {
        setGroceryError(err.message)
      } finally {
        setGroceryLoading(false)
      }
    })()
  }, [])

  // fetch matching recipes
  useEffect(() => {
    ; (async () => {
      setRecipesLoading(true)
      setRecipesError("")
      try {
        const res = await fetch("/api/grocery-list/latest/matching-recipes/", { credentials: "include" })
        const data = await res.json().catch(() => ({}))
        if (res.status === 404) { setRecipes([]); return }
        if (!res.ok) throw new Error(data?.detail || "Failed to load recipes.")
        setRecipes(Array.isArray(data) ? data : data.results ?? [])
      } catch (err) {
        setRecipesError(err.message)
      } finally {
        setRecipesLoading(false)
      }
    })()
  }, [])

  // scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, askLoading])

  // ask Gemini
  const handleAsk = async () => {
    const question = prompt.trim()
    if (!question || askLoading) return
    setMessages((prev) => [...prev, { role: "user", text: question }])
    setPrompt("")
    setAskLoading(true)
    setAskError("")
    try {
      const res = await fetch("/api/ai/ask/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken") || "",
        },
        credentials: "include",
        body: JSON.stringify({ question }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.detail || "Gemini request failed.")
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer }])
    } catch (err) {
      setAskError(err.message)
    } finally {
      setAskLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAsk() }
  }

  const filteredGrocery = searchText.trim()
    ? groceryList.split("\n").filter((l) => l.toLowerCase().includes(searchText.toLowerCase())).join("\n")
    : groceryList

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#e9e9e9", fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      {/* NAV */}
      <Box sx={{ px: { xs: 3, md: 6 }, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #222" }}>
        <Typography sx={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.04em", color: "#111" }}>
          DietDude
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            startIcon={<TuneRoundedIcon />}
            component={RouterLink}
            to="/Preferences"
            variant="outlined"
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              textTransform: "none", borderRadius: 0, px: 2.5, py: 1,
              fontSize: 13, fontWeight: 700, color: "#111", borderColor: "#222", borderWidth: 2,
              "&:hover": { borderColor: "#000", borderWidth: 2, bgcolor: "#222", color: "#e9e9e9" },
            }}
          >
            Preferences Quiz
          </Button>
          <Avatar sx={{ width: 36, height: 36, bgcolor: "#222", color: "#e9e9e9", fontWeight: 800, fontSize: 13, borderRadius: 0 }}>
            DD
          </Avatar>
        </Stack>
      </Box>

      {/* BODY */}
      <Box sx={{
        display: "flex", justifyContent: "center",
        px: { xs: 3, md: 8 }, py: { xs: 5, md: 8 },
        gap: { xs: 5, lg: 8 },
        flexDirection: { xs: "column", lg: "row" },
        alignItems: { lg: "flex-start" },
      }}>
        {/* LEFT — editorial title */}
        <Box sx={{ flexShrink: 0 }}>
          <Typography sx={{ fontSize: { xs: 56, md: 80, lg: 108 }, fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.045em", color: "#111" }}>
            Diet<br />Dude<br />Dash<br />board.
          </Typography>
          <Typography sx={{ mt: 3, fontSize: 13, color: "rgba(0,0,0,0.5)", maxWidth: 260, lineHeight: 1.7 }}>
            Build meal plans and grocery lists around your dietary restrictions, preferences, and budget.
          </Typography>
          <Button
            component={RouterLink}
            to="/Preferences"
            variant="contained"
            sx={{
              mt: 3, bgcolor: "#111", color: "#e9e9e9",
              borderRadius: 0, px: 3, py: 1.3,
              fontWeight: 700, fontSize: 12, letterSpacing: "0.07em", textTransform: "uppercase",
              boxShadow: "none", "&:hover": { bgcolor: "#000", boxShadow: "none" },
            }}
          >
            Take the Quiz →
          </Button>
        </Box>

        {/* DIVIDER */}
        <Box sx={{ display: { xs: "none", lg: "block" }, width: 4, alignSelf: "stretch", minHeight: 500, bgcolor: "#222", flexShrink: 0 }} />

        {/* RIGHT — cards */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, maxWidth: 640 }}>

          {/* GROCERY LIST */}
          <Box sx={cardStyle}>
            <SectionTitle text="Generated Grocery List" />
            <TextField
              fullWidth placeholder="Filter items..." variant="outlined" size="small"
              value={searchText} onChange={(e) => setSearchText(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ color: "#555", fontSize: 18 }} /></InputAdornment> }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#ddd", borderRadius: 0, fontSize: 13,
                  "& fieldset": { borderColor: "#444", borderWidth: 2 },
                  "&:hover fieldset": { borderColor: "#111", borderWidth: 2 },
                  "&.Mui-focused fieldset": { borderColor: "#111", borderWidth: 2 },
                },
                "& .MuiInputBase-input::placeholder": { color: "rgba(0,0,0,0.4)", opacity: 1 },
              }}
            />
            <Box sx={{ minHeight: 160 }}>
              {groceryLoading && (
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 4 }}>
                  <CircularProgress size={16} sx={{ color: "#111" }} />
                  <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.5)" }}>Loading grocery list…</Typography>
                </Stack>
              )}
              {groceryError && !groceryLoading && (
                <Box sx={{ p: 2, border: "2px solid #111", bgcolor: "#ddd" }}>
                  <Typography sx={{ fontSize: 13, color: "#111", fontWeight: 600 }}>{groceryError}</Typography>
                </Box>
              )}
              {!groceryLoading && !groceryList && !groceryError && (
                <Box sx={{ py: 5, display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed rgba(0,0,0,0.2)" }}>
                  <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.4)", textAlign: "center" }}>
                    No grocery list yet.<br />Complete the quiz to generate one.
                  </Typography>
                </Box>
              )}
              {!groceryLoading && groceryList && (
                <Box sx={{ bgcolor: "#ddd", border: "2px solid #444", p: 2.5, whiteSpace: "pre-wrap" }}>
                  <Typography sx={{ fontSize: 13, lineHeight: 1.9, color: "#111" }}>
                    {filteredGrocery || "No items match your search."}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* MATCHING RECIPES */}
          <Box sx={cardStyle}>
            <SectionTitle text="Recipes You Can Make" />
            <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.45)", mb: 2 }}>
              Recipes whose ingredients are all covered by your grocery list.
            </Typography>
            {recipesLoading && (
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 4 }}>
                <CircularProgress size={16} sx={{ color: "#111" }} />
                <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.5)" }}>Loading recipes…</Typography>
              </Stack>
            )}
            {recipesError && !recipesLoading && (
              <Box sx={{ p: 2, border: "2px solid #111", bgcolor: "#ddd" }}>
                <Typography sx={{ fontSize: 13, color: "#111", fontWeight: 600 }}>{recipesError}</Typography>
              </Box>
            )}
            {!recipesLoading && !recipesError && recipes.length === 0 && (
              <Box sx={{ py: 4, display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed rgba(0,0,0,0.2)" }}>
                <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.4)", textAlign: "center" }}>
                  No matching recipes yet.<br />Generate a grocery list first.
                </Typography>
              </Box>
            )}
            {!recipesLoading && recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </Box>

          {/* ASK DIETDUDE AI */}
          <Box sx={cardStyle}>
            <SectionTitle text="Ask DietDude AI" />
            <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.45)", mb: 2 }}>
              Ask anything about your grocery list, nutrition, meal ideas, or swaps.
            </Typography>

            {messages.length > 0 && (
              <Box sx={{
                maxHeight: 340, overflowY: "auto", mb: 2, px: 0.5,
                "&::-webkit-scrollbar": { width: 4 },
                "&::-webkit-scrollbar-thumb": { bgcolor: "#aaa" },
              }}>
                {messages.map((m, i) => <ChatMessage key={i} role={m.role} text={m.text} />)}
                {askLoading && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                    <CircularProgress size={14} sx={{ color: "#111" }} />
                    <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>DietDude is thinking…</Typography>
                  </Box>
                )}
                {askError && (
                  <Box sx={{ p: 1.5, border: "2px solid #111", bgcolor: "#ddd", mb: 1.5 }}>
                    <Typography sx={{ fontSize: 12, color: "#111", fontWeight: 600 }}>{askError}</Typography>
                  </Box>
                )}
                <div ref={chatEndRef} />
              </Box>
            )}

            <Box sx={{ position: "relative" }}>
              <TextField
                fullWidth multiline minRows={2}
                placeholder={'e.g. "Can I substitute chicken breast with tofu?" (Shift+Enter for new line)'}
                value={prompt} onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown} disabled={askLoading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    alignItems: "flex-start", bgcolor: "#ddd", fontSize: 13, borderRadius: 0, pr: 6,
                    "& fieldset": { borderColor: "#444", borderWidth: 2 },
                    "&:hover fieldset": { borderColor: "#111", borderWidth: 2 },
                    "&.Mui-focused fieldset": { borderColor: "#111", borderWidth: 2 },
                  },
                  "& .MuiInputBase-input::placeholder": { color: "rgba(0,0,0,0.35)", opacity: 1 },
                }}
              />
              <IconButton
                size="small" onClick={handleAsk} disabled={!prompt.trim() || askLoading}
                sx={{
                  position: "absolute", right: 10, bottom: 10,
                  bgcolor: prompt.trim() && !askLoading ? "#111" : "rgba(0,0,0,0.12)",
                  color: prompt.trim() && !askLoading ? "#e9e9e9" : "rgba(0,0,0,0.3)",
                  borderRadius: 0,
                  "&:hover": { bgcolor: prompt.trim() ? "#000" : "rgba(0,0,0,0.12)" },
                  transition: "all 0.15s",
                }}
              >
                <SendRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  )
}

const cardStyle = {
  backgroundColor: "#cfcfcf",
  border: "2px solid black",
  borderRadius: 0,
  px: 4,
  py: 4,
}