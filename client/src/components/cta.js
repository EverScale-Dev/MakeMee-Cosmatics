import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export const Cta = () => {
  return (
    <Box
      sx={{
        backgroundImage: "url(doodle-bg.png)",
        backgroundColor: "#ffe9e9f0",
        height: "300px",
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        overflow: "hidden",
        borderRadius: 2,
        my: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box sx={{ py: 5 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 2,
            fontWeight: "bold",
          }}
        >
          For Bulk Order Please Click Below !!  
        </Typography>

        <Link href="/bulkOrder" passHref>
              <Button
                size="small"
                sx={{
                  color: "white",
                  background:
                    "linear-gradient(45deg, #D32F2F 30%, #C00000 90%)",
                  borderRadius: 25,
                  boxShadow: "0 3px 5px 2px rgba(192, 0, 0, .3)",
                  padding: "10px 20px",
                  fontWeight: "bold",
                  transition: "0.3s ease",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #B71C1C 30%, #8B0000 90%)",
                    transform: "scale(1.05)",
                    boxShadow: "0 5px 15px 2px rgba(128, 0, 0, .4)",
                  },
                }}
              >
                Bulk Order
              </Button>
            </Link>
      </Box>
    </Box>
  );
};
