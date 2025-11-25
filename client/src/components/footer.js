import React from "react";
import { Container, Typography, Link, Box } from "@mui/material";
import { Instagram, LinkedIn, Phone, Email, LocationOn } from "@mui/icons-material";

const Footer = () => {
  return (
    <footer>
      <Box sx={{ backgroundColor: "#111827", color: "#fff", pt: 8, pb: 4 }}>
        <Box sx={{ px: { xs: 2, md: 4 } }}>
          {/* Top Section with 4 columns */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
              gap: 4,
              mb: 6,
            }}
          >
            {/* Brand Info */}
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}
              >
                MAKEMEE
              </Typography>
              <Typography variant="body2" sx={{ color: "#9CA3AF", mb: 2 }}>
                A passionate Indian beauty brand founded with a dream of creating safe,
                sustainable, and effective beauty solutions that celebrate natural beauty.
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link
                  href="https://www.instagram.com/makeemee___/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "#9CA3AF", "&:hover": { color: "#fff" } }}
                >
                  <Instagram />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/makemee-cosmetics-pvt-ltd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "#9CA3AF", "&:hover": { color: "#fff" } }}
                >
                  <LinkedIn />
                </Link>
              </Box>
            </Box>

            {/* Company */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Company
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                <li>
                  <Link href="./" sx={{ color: "#9CA3AF", "&:hover": { color: "#fff" } , mb:1.2, textDecoration:"none" }}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="./" sx={{ color: "#9CA3AF", "&:hover": { color: "#fff" } , mb:1.2, textDecoration:"none" }}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" sx={{ color: "#9CA3AF", "&:hover": { color: "#fff" } , mb:1.2, textDecoration:"none" }}>
                    Contact
                  </Link>
                </li>
              </Box>
            </Box>

            {/* Support */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Support
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                <li>
                  <Link href="/faq" sx={{ color: "#9CA3AF", "&:hover": { color: "#fff" }, mb:1.2, textDecoration:"none" }}>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" sx={{ color: "#9CA3AF", "&:hover": { color: "#fff" }, mb:1.2, textDecoration:"none" }}>
                    Contact Us
                  </Link>
                </li>
              </Box>
            </Box>

            {/* Legal */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Legal
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                <li>
                  <Link href="/privacy-policy" sx={{ color: "#9CA3AF", "&:hover": { color: "#fff" }, mb:1.2, textDecoration:"none" }}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" sx={{ color: "#9CA3AF", "&:hover": { color: "#fff" }, mb:1.2, textDecoration:"none" }}>
                    Terms & Conditions
                  </Link>
                </li>
              </Box>
            </Box>
          </Box>

          {/* Contact Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 3,
              borderTop: "1px solid #374151",
              pt: 3,
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Email /> 
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                makemeecosmetics@gmail.com
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Phone />
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                +91 72638 38699
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOn />
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                A/P Derde Korhale, Tal. Kopargaon, Dist. Ahilyanagar, Maharashtra 423601
              </Typography>
            </Box>
          </Box>

          {/* Bottom Note */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
              © {new Date().getFullYear()} MakeMee. All rights reserved.
            </Typography>

            <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
              Made with ❤️ in India |
              <a
                href="https://brandmake.in"
                target="_blank"
                style={{ color: "#9CA3AF", textDecoration: "none", marginLeft: 4 }}
              >
                Brand Make
              </a>
            </Typography>
          </Box>
        </Box>
      </Box>
    </footer>
  );
};

export default Footer;
