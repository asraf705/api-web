import React from 'react';
import './ApiTemplates.css';

const ApiTemplates = ({ onSelectTemplate }) => {
  const templates = {
    github: {
      category: 'GitHub',
      apis: [
        {
          name: 'List Repositories',
          method: 'GET',
          url: 'https://api.github.com/users/{username}/repos',
          headers: [
            { key: 'Accept', value: 'application/vnd.github.v3+json' }
          ]
        },
        {
          name: 'Get User Info',
          method: 'GET',
          url: 'https://api.github.com/users/{username}',
          headers: [
            { key: 'Accept', value: 'application/vnd.github.v3+json' }
          ]
        }
      ]
    },
    weather: {
      category: 'OpenWeatherMap',
      apis: [
        {
          name: 'Current Weather',
          method: 'GET',
          url: 'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={apiKey}',
          headers: []
        }
      ]
    },
    twitter: {
      category: 'Twitter',
      apis: [
        {
          name: 'User Timeline',
          method: 'GET',
          url: 'https://api.twitter.com/2/users/{user_id}/tweets',
          headers: [
            { key: 'Authorization', value: 'Bearer {token}' }
          ]
        }
      ]
    }
  };

  return (
    <div className="api-templates">
      <h3>API Templates</h3>
      <div className="templates-grid">
        {Object.entries(templates).map(([key, category]) => (
          <div key={key} className="template-category">
            <h4>{category.category}</h4>
            <div className="template-list">
              {category.apis.map((api, index) => (
                <div key={index} className="template-item" onClick={() => onSelectTemplate(api)}>
                  <div className="template-name">{api.name}</div>
                  <div className="template-method">{api.method}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiTemplates;