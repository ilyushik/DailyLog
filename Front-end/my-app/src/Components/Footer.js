import "./Footer.css"
import {Link} from "react-router-dom";
import React from "react";

export function Footer() {
    return (
        <footer className="footer">
            <p>Created by: <div className={`link-block`}>
                <Link to="https://www.linkedin.com/in/illia-kamarali-052822243/">Illia Kamarali</Link>,
                <Link to="https://www.linkedin.com/in/bohdan-khokhlov-02794a246/"> Bohdan Khokhlov</Link>
            </div></p>
        </footer>
    )
}