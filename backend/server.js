const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

app.use(express.json());

app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_crud"
})

app.get("/", (req, res) => {
    const sql = "SELECT * FROM student";
    db.query(sql, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    })
});

app.post("/create", (req, res) => {
    console.log(req);
    
    const sql = "INSERT INTO student (`Name`, `Email`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email
    ]
    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    })
});

app.get("/edit/:id", (req, res) => {
    console.log("Received request for ID:", req.params.id);  // Debug log
    const id = req.params.id;
    
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    const sql = "SELECT * FROM student WHERE id = ?";
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error('Database error:', err);  // More detailed error
            return res.status(500).json({ 
                error: "Database error",
                details: err.message 
            });
        }
        console.log("Query results:", data);  // Debug log
        if (data.length === 0) {
            return res.status(404).json({ error: "Student not found" });
        }
        return res.json(data[0]);
    });
});

// Update student
app.put("/update/:id", (req, res) => {
    const studentId = req.params.id;
    const { Name, Email } = req.body;
    
    if (!Name || !Email) {
        return res.status(400).json({ error: "Name and Email are required" });
    }

    const sql = "UPDATE student SET `Name` = ?, `Email` = ? WHERE id = ?";
    const values = [Name, Email, studentId];
    
    db.query(sql, values, (err, data) => {
        if (err) {
            console.error('Error updating student:', err);
            return res.status(500).json({ error: "Failed to update student" });
        }
        if (data.affectedRows === 0) {
            return res.status(404).json({ error: "Student not found" });
        }
        return res.json({ message: "Student updated successfully" });
    });
});

// Delete student
app.delete("/delete/:id", (req, res) => {
    const studentId = req.params.id;
    const sql = "DELETE FROM student WHERE id = ?";
    
    db.query(sql, [studentId], (err, data) => {
        if (err) {
            console.error('Error deleting student:', err);
            return res.status(500).json({ error: "Failed to delete student" });
        }
        if (data.affectedRows === 0) {
            return res.status(404).json({ error: "Student not found" });
        }
        return res.json({ message: "Student deleted successfully" });
    });
});


app.listen(8081, () => {
    console.log("listening");
})