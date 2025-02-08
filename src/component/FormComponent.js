import React, { useState, useEffect } from 'react';

const FormComponent = ({ formData, setFormData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>Especificação</h1>
      <form>
        <div className="form-grid">
          <label>
            Nome Cliente:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Analista:
            <input
              type="text"
              name="analist"
              value={formData.analist}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Job:
            <input
              type="text"
              name="job"
              value={formData.job}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Pré-Venda:
            <input
              type="text"
              name="sales"
              value={formData.sales}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Low Coder:
            <input
              type="text"
              name="lowCoder"
              value={formData.lowCoder}
              onChange={handleInputChange}
            />
          </label>

        </div>
      </form>

    </div>
  );
};

export default FormComponent;
