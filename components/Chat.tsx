import { useState } from 'react';
import Button from 'components/Button';

const Chat = () => {
  const [messageInput, setMessageInput] = useState('');
  const [result, setResult] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch('/api/chat-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setMessageInput('');
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className="max-w-xl  p-4 bg-gray-100 rounded-md shadow-md flex flex-col h-80">
      <div className="mb-4 flex-grow h-48 overflow-y-auto">
        <div>
          {result
            .filter((message) => message.role !== 'system')
            .map((message, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-md ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300'
                  }`}
                >
                  {message.content}
                </span>
              </div>
            ))}
        </div>
      </div>
      <form onSubmit={onSubmit} className="mb-4">
        <div className="flex items-center">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            id="chat"
            name="message"
            placeholder="Enter a message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <Button type="submit" variation="primary">
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
