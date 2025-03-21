import React from 'react';

const ApiTemplates = ({ onSelectTemplate }) => {
  const templates = [
    {
      name: 'Basic GET Request',
      method: 'GET',
      url: 'https://api.example.com/data',
      headers: [{ key: 'Accept', value: 'application/json' }],
      body: ''
    },
    {
      name: 'Create Resource (POST)',
      method: 'POST',
      url: 'https://api.example.com/resources',
      headers: [
        { key: 'Content-Type', value: 'application/json' },
        { key: 'Accept', value: 'application/json' }
      ],
      body: JSON.stringify({
        name: 'Example',
        description: 'Description here'
      }, null, 2)
    },
    {
      name: 'Update Resource (PUT)',
      method: 'PUT',
      url: 'https://api.example.com/resources/1',
      headers: [
        { key: 'Content-Type', value: 'application/json' },
        { key: 'Accept', value: 'application/json' }
      ],
      body: JSON.stringify({
        id: 1,
        name: 'Updated Example',
        description: 'Updated description'
      }, null, 2)
    },
    {
      name: 'Authentication Request',
      method: 'POST',
      url: 'https://api.example.com/auth/login',
      headers: [{ key: 'Content-Type', value: 'application/json' }],
      body: JSON.stringify({
        username: 'user@example.com',
        password: 'password123'
      }, null, 2)
    }
  ];

  return (
    <div className="api-templates">
      <h3>API Templates</h3>
      <div className="template-grid">
        {templates.map((template, index) => (
          <div key={index} className="template-card" onClick={() => onSelectTemplate(template)}>
            <h4>{template.name}</h4>
            <div className="template-method">{template.method}</div>
            <div className="template-url">{template.url}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiTemplates;