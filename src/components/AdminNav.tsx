import React from 'react'

const AdminNav = () => {
    return (
        <nav className="Admin_nav">
            <h1 className="logo">CAT Race</h1>
            <ul>
                <li><a href="/add-admin">Add Admin</a></li>
                <li><a href="/add-quiz">Add Quiz</a></li>
                <li><a href="/add-circle">Add Circle</a></li>
            </ul>
        </nav>
    )
}

export default AdminNav
