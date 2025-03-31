import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemText, Typography, Box, Divider, Button, IconButton, useMediaQuery } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box
      sx={{
        width: 240,
        backgroundColor: "#2563eb",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: "white", mb: 3 }}>
          Concert Booking
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1 }}>
        <ListItem
          component={NavLink}
          to="/concerts"
          sx={{
            color: "white",
            "&.active": {
              borderLeft: "4px solid white",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
            pl: 2,
            mb: 1,
          }}
          onClick={handleDrawerToggle}
        >
          <ListItemText primary="Concert List" />
        </ListItem>
        <ListItem
          component={NavLink}
          to="/tickets"
          sx={{
            color: "white",
            "&.active": {
              borderLeft: "4px solid white",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
            pl: 2,
          }}
          onClick={handleDrawerToggle}
        >
          <ListItemText primary="My Tickets" />
        </ListItem>
      </List>
      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
      <Box sx={{ p: 2 }}>
        <Button
          variant="text"
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          fullWidth
          sx={{
            color: "white",
            justifyContent: "flex-start",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          sx={{ position: "absolute", top: 16, left: 16, color: "black" }}
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: isMobile ? "auto" : 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
