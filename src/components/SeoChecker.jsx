import React, { useState } from 'react';
import './SeoChecker.css';

const SeoChecker = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const analyzeSEO = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(url);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const seoResults = {
        title: {
          content: doc.title,
          length: doc.title.length,
          score: calculateTitleScore(doc.title),
        },
        metaDescription: {
          content: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
          length: doc.querySelector('meta[name="description"]')?.getAttribute('content')?.length || 0,
          score: calculateMetaScore(doc.querySelector('meta[name="description"]')?.getAttribute('content')),
        },
        headings: analyzeHeadings(doc),
        images: analyzeImages(doc),
        keywords: analyzeKeywords(html),
        links: analyzeLinks(doc),
        performance: {
          score: 0,
          suggestions: []
        }
      };

      setResults(seoResults);
    } catch (error) {
      setResults({
        error: 'Failed to analyze website. Please check the URL and try again.'
      });
    }

    setLoading(false);
  };

  const calculateTitleScore = (title) => {
    if (!title) return 0;
    const length = title.length;
    if (length >= 50 && length <= 60) return 100;
    if (length >= 40 && length < 50) return 80;
    if (length > 60 && length <= 70) return 80;
    return 60;
  };

  const calculateMetaScore = (meta) => {
    if (!meta) return 0;
    const length = meta.length;
    if (length >= 150 && length <= 160) return 100;
    if (length >= 140 && length < 150) return 80;
    if (length > 160 && length <= 170) return 80;
    return 60;
  };

  const analyzeHeadings = (doc) => {
    const headings = {
      h1: Array.from(doc.getElementsByTagName('h1')),
      h2: Array.from(doc.getElementsByTagName('h2')),
      h3: Array.from(doc.getElementsByTagName('h3')),
    };

    return {
      count: {
        h1: headings.h1.length,
        h2: headings.h2.length,
        h3: headings.h3.length,
      },
      score: calculateHeadingsScore(headings),
      suggestions: generateHeadingSuggestions(headings),
    };
  };

  const calculateHeadingsScore = (headings) => {
    let score = 100;
    if (headings.h1.length !== 1) score -= 30;
    if (headings.h2.length === 0) score -= 20;
    if (headings.h3.length === 0) score -= 10;
    return Math.max(0, score);
  };

  const generateHeadingSuggestions = (headings) => {
    const suggestions = [];
    if (headings.h1.length === 0) {
      suggestions.push('Add an H1 heading to your page');
    } else if (headings.h1.length > 1) {
      suggestions.push('Use only one H1 heading per page');
    }
    if (headings.h2.length === 0) {
      suggestions.push('Add H2 headings to structure your content');
    }
    return suggestions;
  };

  const analyzeImages = (doc) => {
    const images = Array.from(doc.getElementsByTagName('img'));
    const imagesWithoutAlt = images.filter(img => !img.alt);

    return {
      total: images.length,
      withoutAlt: imagesWithoutAlt.length,
      score: calculateImageScore(images.length, imagesWithoutAlt.length),
      suggestions: generateImageSuggestions(imagesWithoutAlt.length),
    };
  };

  const calculateImageScore = (total, withoutAlt) => {
    if (total === 0) return 100;
    return Math.max(0, 100 - (withoutAlt / total * 100));
  };

  const generateImageSuggestions = (withoutAlt) => {
    if (withoutAlt === 0) return [];
    return [`Add alt text to ${withoutAlt} image${withoutAlt > 1 ? 's' : ''}`];
  };

  const analyzeKeywords = (html) => {
    const text = html.toLowerCase().replace(/<[^>]*>/g, ' ');
    const words = text.match(/\b\w+\b/g) || [];
    const wordCount = {};
    
    words.forEach(word => {
      if (word.length > 3) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / words.length) * 100).toFixed(2)
      }));
  };

  const analyzeLinks = (doc) => {
    const links = Array.from(doc.getElementsByTagName('a'));
    const internal = links.filter(link => {
      try {
        return new URL(link.href).hostname === new URL(url).hostname;
      } catch {
        return false;
      }
    });

    return {
      total: links.length,
      internal: internal.length,
      external: links.length - internal.length,
      score: calculateLinkScore(links.length, internal.length),
    };
  };

  const calculateLinkScore = (total, internal) => {
    if (total === 0) return 60;
    const ratio = internal / total;
    if (ratio >= 0.4 && ratio <= 0.6) return 100;
    if (ratio >= 0.3 && ratio <= 0.7) return 80;
    return 60;
  };

  return (
    <div className="seo-checker">
      <h2>SEO Checker</h2>
      <form onSubmit={analyzeSEO}>
        <div className="url-input">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze SEO'}
          </button>
        </div>
      </form>

      {results && !results.error && (
        <div className="seo-results">
          <div className="result-section">
            <h3>Title Tag</h3>
            <div className="score-badge" style={{ backgroundColor: results.title.score >= 80 ? '#10b981' : '#f59e0b' }}>
              Score: {results.title.score}
            </div>
            <p>Length: {results.title.length} characters</p>
            <p>Content: {results.title.content}</p>
          </div>

          <div className="result-section">
            <h3>Meta Description</h3>
            <div className="score-badge" style={{ backgroundColor: results.metaDescription.score >= 80 ? '#10b981' : '#f59e0b' }}>
              Score: {results.metaDescription.score}
            </div>
            <p>Length: {results.metaDescription.length} characters</p>
            <p>Content: {results.metaDescription.content || 'Not found'}</p>
          </div>

          <div className="result-section">
            <h3>Headings</h3>
            <div className="score-badge" style={{ backgroundColor: results.headings.score >= 80 ? '#10b981' : '#f59e0b' }}>
              Score: {results.headings.score}
            </div>
            <p>H1: {results.headings.count.h1}</p>
            <p>H2: {results.headings.count.h2}</p>
            <p>H3: {results.headings.count.h3}</p>
            {results.headings.suggestions.map((suggestion, index) => (
              <div key={index} className="suggestion">{suggestion}</div>
            ))}
          </div>

          <div className="result-section">
            <h3>Images</h3>
            <div className="score-badge" style={{ backgroundColor: results.images.score >= 80 ? '#10b981' : '#f59e0b' }}>
              Score: {results.images.score.toFixed(0)}
            </div>
            <p>Total Images: {results.images.total}</p>
            <p>Images without alt text: {results.images.withoutAlt}</p>
            {results.images.suggestions.map((suggestion, index) => (
              <div key={index} className="suggestion">{suggestion}</div>
            ))}
          </div>

          <div className="result-section">
            <h3>Keyword Analysis</h3>
            <table className="keyword-table">
              <thead>
                <tr>
                  <th>Keyword</th>
                  <th>Count</th>
                  <th>Density</th>
                </tr>
              </thead>
              <tbody>
                {results.keywords.map((keyword, index) => (
                  <tr key={index}>
                    <td>{keyword.word}</td>
                    <td>{keyword.count}</td>
                    <td>{keyword.density}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="result-section">
            <h3>Links Analysis</h3>
            <div className="score-badge" style={{ backgroundColor: results.links.score >= 80 ? '#10b981' : '#f59e0b' }}>
              Score: {results.links.score}
            </div>
            <p>Total Links: {results.links.total}</p>
            <p>Internal Links: {results.links.internal}</p>
            <p>External Links: {results.links.external}</p>
          </div>
        </div>
      )}

      {results?.error && (
        <div className="error-message">
          {results.error}
        </div>
      )}
    </div>
  );
};

export default SeoChecker;