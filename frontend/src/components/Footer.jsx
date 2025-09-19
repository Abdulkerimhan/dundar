import React from "react";
import "./Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn, FaTelegramPlane, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© 2025 FTSLine – Tüm Hakları Saklıdır.</p>
      <div className="socials">
        <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube /></a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
        <a href="https://t.me" target="_blank" rel="noreferrer"><FaTelegramPlane /></a>
        <a href="https://tiktok.com" target="_blank" rel="noreferrer"><FaTiktok /></a>
      </div>
    </footer>
  );
}
