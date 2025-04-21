import React from "react";
import Profile from "./profile";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
    return (
        <div className="flex items-center justify-between p-4 border-b">
        <div></div>
        <div className="flex items-center gap-4">
            <Profile/>
            <LogoutButton />
        </div>
        </div>
    )
}