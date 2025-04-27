import React from 'react';
import './AboutUs.css';
import logo from '../assets/logo.png'; // Replace with your logo file path

const Aboutus = () => {
    return (
        <div className="about-container">
            <header className="about-header">
                <img src={logo} alt="Live Art Logo" className="logo" />
                <h1>About Live Art</h1>
            </header>

            <main className="about-content">
                <p>
                    Welcome to <strong>Live Art</strong>, your trusted online clothing management system.
                    We blend fashion with technology to deliver a seamless, elegant, and efficient platform
                    for managing and browsing clothing products online. Whether you’re a customer looking
                    for the latest trends or an admin managing inventory, Live Art is designed with you in mind.
                </p>

                <p>
                    Our mission is to make fashion management beautiful and simple. We support a wide range
                    of clothing categories for both men and women, and our system allows real-time inventory
                    updates, product filtering, and easy checkouts.
                </p>

                <p>
                    Thank you for choosing Live Art — where fashion meets smart design.
                </p>
            </main>

            <footer className="about-footer">
                <p>&copy; {new Date().getFullYear()} Live Art. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Aboutus;
