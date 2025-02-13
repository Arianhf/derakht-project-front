import React from "react";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold">Login Page</h1>
            <form className="mt-4">
                <input type="text" placeholder="Username" className="border p-2 rounded-md" />
                <input type="password" placeholder="Password" className="border p-2 rounded-md mt-2" />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md mt-2">Login</button>
            </form>
        </div>
    );
}
