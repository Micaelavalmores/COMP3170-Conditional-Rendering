import React, { useState } from 'react';
import "./BookForm.css"

function BookForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    url: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Book</h2>

      <label>
        Title<br />
        <input
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Author<br />
        <input
          name="author"
          type="text"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Book Cover URL<br />
        <input
          name="url"
          type="url"
          value={formData.url}
          onChange={handleChange}
          required
        />
      </label>

      <div style={{ marginTop: '16px' }}>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

export default BookForm;
