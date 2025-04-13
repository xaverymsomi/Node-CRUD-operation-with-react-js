import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function DeleteStudent() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/edit/${id}`);
        setStudent(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8081/delete/${id}`);
      navigate('/', { state: { message: 'Student deleted successfully' } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete student');
    }
  };

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
        <button 
          className="btn btn-sm btn-outline-secondary ms-3"
          onClick={() => navigate('/')}
        >
          Back to List
        </button>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="alert alert-warning mx-auto mt-5" style={{ maxWidth: '800px' }}>
        Student not found
        <button 
          className="btn btn-sm btn-outline-secondary ms-3"
          onClick={() => navigate('/')}
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center p-4">
      <div className="card shadow-lg" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="card-header bg-danger text-white">
          <h4 className="mb-0">Confirm Deletion</h4>
        </div>
        <div className="card-body">
          <div className="alert alert-warning">
            <strong>Warning!</strong> You are about to permanently delete this student record.
          </div>

          <div className="mb-4 p-3 border rounded">
            <h5>Student Details</h5>
            <p><strong>Name:</strong> {student.Name}</p>
            <p><strong>Email:</strong> {student.Email}</p>
          </div>

          <div className="d-flex justify-content-between">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
            >
              <i className="bi bi-trash-fill me-2"></i>Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteStudent;