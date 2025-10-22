# Artisan Canvas: AI Design Studio

[cloudflarebutton]

Artisan Canvas: AI Design Studio is a sophisticated web application designed for creating stunning visual content, particularly posters, with the assistance of AI-powered tools. It provides a highly intuitive and visually appealing interface, combining a robust design canvas with an intelligent AI Assistant and a central Media Library. The application's core functionality revolves around allowing users to manipulate design elements (text, shapes, images) on a canvas, with the AI Assistant interpreting natural language commands to perform complex design operations, suggest improvements, and generate content. The application is built on Cloudflare Workers and Durable Objects, ensuring scalability and responsiveness.

## Key Features

*   **AI-Powered Design Assistance**: Leverage intelligent AI to generate content, suggest improvements, and execute complex design operations through natural language commands.
*   **Intuitive Design Canvas**: A robust and visually appealing workspace for creating and manipulating visual content.
*   **Comprehensive Media Library**: A centralized repository for managing and utilizing design assets like images, icons, and textures.
*   **Interactive Element Manipulation**: Tools for adding, selecting, moving, resizing, and styling text, shapes, and images directly on the canvas.
*   **Real-time AI Interaction**: Seamless integration with the AI Assistant for dynamic design changes and content generation.
*   **Scalable Backend**: Powered by Cloudflare Workers and Durable Objects for high performance and reliability.
*   **Stunning UI/UX**: Crafted with obsessive attention to visual excellence, smooth animations, and responsive design.

## Important Note on AI Usage

Although this project has AI capabilities, there is a limit on the number of requests that can be made to the AI servers across all user apps in a given time period. Please be mindful of your usage.

## Technology Stack

Artisan Canvas is built with a modern and robust technology stack, leveraging Cloudflare's powerful edge platform:

**Frontend:**
*   **React**: A declarative, component-based JavaScript library for building user interfaces.
*   **Vite**: A fast build tool that provides an instant development server and bundles your code for production.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
*   **Shadcn/UI**: A collection of beautifully designed components built with Radix UI and Tailwind CSS.
*   **Framer Motion**: A production-ready motion library for React to power animations and micro-interactions.
*   **Zustand**: A small, fast, and scalable bear-bones state-management solution.
*   **React Router DOM**: For declarative routing in React applications.
*   **Lucide React**: A collection of beautiful and customizable open-source icons.
*   **Other UI/Utility Libraries**: `clsx`, `tailwind-merge`, `class-variance-authority`, `date-fns`, `zod`, `react-hook-form`, `@hookform/resolvers`, `@radix-ui/react-*` (various Radix UI primitives), `@dnd-kit/core`, `@dnd-kit/sortable`, `html2canvas`, `react-colorful`, `react-resizable`, `use-gesture`.

**Backend (Cloudflare Workers):**
*   **Hono**: A small, fast, and powerful web framework for the edge.
*   **Cloudflare Agents SDK**: For stateful agent management with persistent Durable Objects.
*   **Model Context Protocol (MCP) Client**: For real server integration with AI models.
*   **OpenAI SDK**: For AI model integration via Cloudflare AI Gateway.
*   **Durable Objects**: For persistent state management and conversation history.

**Tooling:**
*   **TypeScript**: For type safety and an extensible architecture.
*   **Bun**: A fast all-in-one JavaScript runtime.
*   **Autoprefixer & PostCSS**: For handling CSS vendor prefixes and transformations.

## Setup and Installation

To get the Artisan Canvas project up and running on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd artisan-canvas-ai-design-studio
    ```

2.  **Install dependencies:**
    This project uses `bun` as its package manager.
    ```bash
    bun install
    ```

3.  **Configure Environment Variables:**
    The project requires specific environment variables for the Cloudflare AI Gateway and other services. Create a `.dev.vars` file in the root directory (for local development) or configure them in your Cloudflare Worker settings.
    ```
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="your-cloudflare-api-key"
    SERPAPI_KEY="your-serpapi-key" # Optional, for web_search tool
    OPENROUTER_API_KEY="your-openrouter-api-key" # Optional, if using OpenRouter models
    ```
    *Replace placeholders with your actual keys and IDs.*

4.  **Generate Cloudflare Worker Types:**
    This step ensures that your TypeScript environment is aware of Cloudflare Worker types and Durable Object bindings.
    ```bash
    bun run cf-typegen
    ```

## Development

To start the development server and begin working on the project:

```bash
bun run dev
```
This will start the Vite development server, typically on `http://localhost:3000`, and the page will auto-update as you edit the files.

## Deployment

The Artisan Canvas application is designed to be deployed on Cloudflare Workers.

1.  **Build the project for production:**
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare Workers:**
    Ensure you have `wrangler` installed and configured with your Cloudflare account.
    ```bash
    bun run deploy
    ```
    This command will build your Worker and deploy it to Cloudflare.

[cloudflarebutton]