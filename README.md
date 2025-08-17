# React Chatbot UI

A modern, responsive chatbot interface built with React and Next.js, designed to integrate with n8n RAG agents.

## Features

- 🎨 Modern, responsive design with dark/light mode support
- 💬 Real-time chat interface with message bubbles
- 📱 Mobile-friendly with collapsible sidebar
- 💾 Persistent chat history using localStorage
- ⚡ Loading indicators and smooth animations
- 🔗 n8n webhook integration for AI responses
- 🗂️ Multiple chat sessions with create/delete functionality
- ⏰ Message timestamps
- 🎯 TypeScript support for better development experience

## Installation

1. Clone or download the project
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Configure your n8n webhook URL in `.env.local`:
   \`\`\`
   NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-webhook-url.com/webhook/chat
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## n8n Integration

The chatbot sends POST requests to your n8n webhook with the following payload:

\`\`\`json
{
  "message": "User's message content",
  "chatId": "unique-chat-id",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
\`\`\`

Your n8n workflow should return a JSON response with:

\`\`\`json
{
  "response": "AI agent's response message"
}
\`\`\`

## Project Structure

\`\`\`
├── app/
│   ├── components/
│   │   ├── ChatArea.tsx      # Main chat interface
│   │   ├── Sidebar.tsx       # Chat history sidebar
│   │   ├── MessageBubble.tsx # Individual message component
│   │   └── TypingIndicator.tsx # Loading animation
│   ├── context/
│   │   └── ChatContext.tsx   # Global state management
│   ├── globals.css           # Global styles and design tokens
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page component
├── package.json
├── .env.local               # Environment variables
└── README.md
\`\`\`

## Customization

### Styling
The app uses CSS custom properties for theming. Modify the design tokens in `app/globals.css` to customize colors, spacing, and other design elements.

### n8n Webhook
Update the webhook URL in `.env.local` and modify the request/response handling in `ChatContext.tsx` if your n8n workflow expects a different payload format.

### Features
- Add user authentication
- Implement file upload capabilities
- Add voice message support
- Integrate with different AI providers
- Add message search functionality

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **date-fns** - Date formatting
- **uuid** - Unique ID generation

## License

MIT License - feel free to use this project for personal or commercial purposes.
