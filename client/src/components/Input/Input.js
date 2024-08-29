import React from 'react';
import './Input.css';

const Input = ({ setMessage, sendMessage, message }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(e);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        className="input"
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={({ target: { value } }) => setMessage(value)}
        onKeyDown={event => event.key === 'Enter' ? handleSubmit(event) : null}
      />
      <button className="sendButton" onClick={e => sendMessage(e)}>Send</button>
    </form>
  );
};

export default Input;
