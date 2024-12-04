import React, { useState } from 'react';
import '../styles/adminPanel.custom.css';

const Admin = () => {
  const [formData, setFormData] = useState({
    name: '',
    author: '',
    ageRecommendation: '',
    genre: '',
    type: '',
    format: '',
    language: '',
    price: '',
    stock: '',
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Creating FormData object
    const formDataToSend = new FormData();
    for (let key in formData) {
      formDataToSend.append(key, formData[key]);
    }
  
    try {
      // Adjust the URL to your actual PHP server location
      const response = await fetch('http://localhost:8000/addBook.php', {
        method: 'POST',
        body: formDataToSend,
      });
  
      const result = await response.json();
  
      if (result.success) {
        alert('Book added successfully!');
        setFormData({
          name: '',
          author: '',
          ageRecommendation: '',
          genre: '',
          type: '',
          format: '',
          language: '',
          price: '',
          stock: '',
          image: null,
        });
      } else {
        alert('Error adding book: ' + result.message);
      }
    } catch (error) {
      alert('Error connecting to the server.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel - Add Book</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        {[{ label: 'Book Name', name: 'name', type: 'text', required: true },
          { label: 'Author', name: 'author', type: 'text', required: true },
          { label: 'Age Recommendation', name: 'ageRecommendation', type: 'number' },
          { label: 'Price', name: 'price', type: 'number', required: true },
          { label: 'Stock', name: 'stock', type: 'number', required: true },
        ].map(({ label, name, type, required }) => (
          <div className="form-group" key={name}>
            <label>{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              className="form-input"
              required={required}
            />
          </div>
        ))}
        <div className="form-group">
          <label>Book Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="form-input"
            required
          >
            <option value="">Select Book Type</option>
            {['Picture Book', 'Educational Book', 'Activity Book', 'Interactive Book', "Children's Novel"].map(
              (type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              )
            )}
          </select>
        </div>
        <div className="form-group">
          <label>Book Format</label>
          <select
            name="format"
            value={formData.format}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="">Select Book Format</option>
            {['Board Book', 'Hardcover', 'Paperback'].map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Book Genre</label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            className="form-input"
            required
          >
            <option value="">Select Book Genre</option>
            {[
              'Holidays & Celebrations',
              'Fiction',
              'Emotions & Feelings',
              'Environmental Responsibility',
              'Bedtime Stories',
              'Special Educational Needs',
              'Family Life',
              'Religious Themes',
              'Historical Events',
            ].map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Language</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="">Select Language</option>
            {['Filipino', 'English'].map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Book Image</label>
          <input type="file" name="image" onChange={handleFileChange} className="form-input" />
        </div>
        <button type="submit" className="btn btn-primary">Add Book</button>
      </form>
    </div>
  );
};

export default Admin;
