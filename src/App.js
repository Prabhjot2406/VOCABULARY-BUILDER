import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [vocabulary, setVocabulary] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentlySearched, setRecentlySearched] = useState([]);

  // Load saved vocabulary from local storage on initial render
  useEffect(() => {
    const savedVocabulary = localStorage.getItem('vocabulary');
    const savedRecentlySearched = localStorage.getItem('recentlySearched');
    
    if (savedVocabulary) {
      setVocabulary(JSON.parse(savedVocabulary));
    }
    
    if (savedRecentlySearched) {
      setRecentlySearched(JSON.parse(savedRecentlySearched));
    }
  }, []);

  // Save vocabulary to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
  }, [vocabulary]);

  // Save recently searched to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('recentlySearched', JSON.stringify(recentlySearched));
  }, [recentlySearched]);

  const addWord = () => {
    if (word.trim() === '') return;
    
    const timestamp = new Date();
    const newWord = {
      word: word,
      definition: definition || 'No definition provided',
      examples: generateExamples(word),
      timestamp: timestamp
    };
    
    setVocabulary([newWord, ...vocabulary]);
    updateRecentlySearched(word);
    
    // Clear the input fields
    setWord('');
    setDefinition('');
  };

  const updateRecentlySearched = (searchedWord) => {
    const updatedRecent = [
      searchedWord,
      ...recentlySearched.filter(w => w !== searchedWord)
    ].slice(0, 10); // Keep only the 10 most recent searches
    
    setRecentlySearched(updatedRecent);
  };

  // Helper function to generate example sentences for a word
  const generateExamples = (word) => {
    // In a real app, this would connect to an API or use more sophisticated generation
    const templates = [
      `"My headache was pretty bad, but this tea really helped ${word} the pain," Sarah said as she relaxed on the couch.`,
      `"Hey mom, I know you're stressed about the party - let me help ${word} the situation by taking care of the decorations!"`,
      `"This movie night is definitely going to ${word} my bad mood after that rough day at work," Tom laughed as he grabbed the popcorn.`
    ];
    
    return templates;
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const then = new Date(timestamp);
    const diffInMinutes = Math.floor((now - then) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  const filteredVocabulary = vocabulary.filter(item => 
    item.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <header>
        <h1>Vocabulary Builder</h1>
        <p>Add words to your vocabulary and get AI-generated example sentences.</p>
      </header>

      <div className="content-container">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="word-input">Word</label>
            <input
              id="word-input"
              type="text"
              placeholder="Enter a word..."
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="definition-input">Definition (optional)</label>
            <textarea
              id="definition-input"
              placeholder="Enter the definition..."
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
            />
          </div>

          <button className="add-button" onClick={addWord}>Add Word</button>

          <div className="recently-searched">
            <h2>Recently Searched</h2>
            <ul>
              {recentlySearched.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="dictionary-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="word-list">
            {filteredVocabulary.map((item, index) => (
              <div className="word-card" key={index}>
                <h2>{item.word}</h2>
                <span className="timestamp">{formatTimeAgo(item.timestamp)}</span>
                <p className="definition">{item.definition}</p>
                <ul className="examples">
                  {item.examples.map((example, i) => (
                    <li key={i}>{example}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;