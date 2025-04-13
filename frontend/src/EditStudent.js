import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditStudent() {
  const { id } = useParams(); // Get student ID from URL
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch student data on component mount
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/edit/${id}`);
        setName(response.data.Name || '');
        setEmail(response.data.Email || '');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student:', error);
        setErrors({ fetch: 'Failed to load student data' });
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:8081/update/${id}`, { 
        Name: name, 
        Email: email 
      });
      navigate('/'); // Redirect to student list after success
    } catch (error) {
      console.error('Error updating student:', error);
      setErrors({ submit: 'Failed to update student. Please try again.' });
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

  if (errors.fetch) {
    return (
      <div className="alert alert-danger mx-auto mt-5" style={{ maxWidth: '800px' }}>
        {errors.fetch}
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center p-4">
      <div className="card shadow-lg" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Edit Student</h4>
        </div>
        <div className="card-body">
          {errors.submit && (
            <div className="alert alert-danger">{errors.submit}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditStudent;