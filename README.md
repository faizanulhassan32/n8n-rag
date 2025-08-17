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
   NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/chatv3
   NEXT_PUBLIC_FILE_UPLOAD_WEBHOOK_URL=http://localhost:5678/webhook-test/upload-files
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
