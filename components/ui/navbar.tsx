import React from "react";
import Profile from "./profile";

export default function Navbar() {
    return (
        <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Seamless</h1>
        <Profile/>
        </div>
    )
}