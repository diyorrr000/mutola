import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer glass pill-shape">
            <div className="container footer-content">
                <p>&copy; {new Date().getFullYear()} Mutolaa Platformasi. Barcha huquqlar himoyalangan.</p>
                <div className="footer-author">
                    <span>Muallif:</span>
                    <strong>Qamarova Gulnoza</strong>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
