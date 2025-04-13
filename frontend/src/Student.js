import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Student() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8081/');
        
        // Validate and normalize the response data
        let data = response.data;
        
        // If data is null/undefined, use empty array
        if (!data) data = [];
        
        // If data isn't an array, wrap it in one
        if (!Array.isArray(data)) data = [data];
        
        // Ensure each item has Name and Email fields
        data = data.map(item => ({
          Name: item.Name || 'Unknown',
          Email: item.Email || 'No email',
          id: item.id || Math.random().toString(36).substr(2, 9) // Add unique key if missing
        }));
        
        setStudents(data);
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to load students. Please try again later.');
        setLoading(false);
        setStudents([]);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-auto mt-5" style={{ maxWidth: '800px' }}>
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center p-4">
      <div className="card shadow-lg w-100" style={{ maxWidth: '800px' }}>
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Student Management</h4>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="card-title mb-0">Students List</h5>
            <Link to='/create' className="btn btn-success">
              <i className="bi bi-plus-circle me-2"></i>Add Student
            </Link>
          </div>
          
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.Name}</td>
                      <td>{student.Email}</td>
                      <td>
                        <Link to={`edit/${student.id}`} className="btn btn-sm btn-outline-primary me-2">
                          <i className="bi bi-pencil"></i> Edit
                        </Link>
                        <Link to={`delete/${student.id}`} className="btn btn-sm btn-outline-danger">
                          <i className="bi bi-trash"></i> Delete
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-4">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Student;