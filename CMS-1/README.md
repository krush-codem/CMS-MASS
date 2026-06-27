### The 5 Prompts to Recreate This Project

If you want an AI (like me) to build a platform like this from scratch, use these 5 prompts in sequence. Each prompt represents a distinct phase of
development.

#### Prompt 1: Project Initialization & The Design System

│ "Create a new Vite + React project with React Router. Do not use Tailwind; instead, write a comprehensive, premium index.css file. I want a
│ 'productivity and deep work' aesthetic using an earth-tone color palette (variables like --black-forest , --copperwood , --sunlit-clay , --
cornsilk
│ , and --surface ). Define robust reusable CSS classes for .card-elevated , .btn-primary , .badge-code , and .input-field . Set up the global
│ layout with a sophisticated Navbar and a dark, multi-column Footer with a 'Leave a message' form."

#### Prompt 2: Database Schema & Supabase Integration

│ "Set up the Supabase integration. Create a supabaseClient.js config file. Then, write the SQL schema to create three tables in Supabase:
│
│ 1. articles (id, title, slug, excerpt, main_image_url, lead_author, status, is_editorial_pick, created_at, layout_blocks as JSONB).
│ 2. categories (id, name, description, slug).
│ 3. resources (id, title, type, link, description).
│ Finally, write a mock data script or file in the React project that exports dummy data for these tables so I can develop the UI while the database is
│ empty."

#### Prompt 3: Building the Public Core & Reusable Components

│ "Build a highly responsive, reusable <ArticleCard /> component that accepts an article object and displays a hero image (with a smooth hover zoom),
a
│ tiny uppercase category label, a bold title, the author's avatar/name, and a formatted date. Using this card, build the Home.jsx page with a 'Top
│ Frameworks' grid and a 'Recently Added' grid. Then, build the Articles.jsx archive page that fetches all published articles from Supabase and
│ includes a real-time text search input and a category filter dropdown."

#### Prompt 4: The Dynamic Article Reader & Resources Library

│ "Build the Article.jsx page which uses React Router's useParams to fetch a specific article by its slug from Supabase. The article content is
│ stored in a JSON array called layout_blocks . Write a renderer that iterates through this array and renders different UI elements based on the block
│ type (e.g., 'text' renders a paragraph, 'heading' renders an H2, 'author_spotlight' renders a special boxed bio). Also, build a Resources.jsx page
│ that fetches from the resources table and organizes items into visual tabs (Books, PDF Worksheets, Digital Tools)."

#### Prompt 5: The Private Admin Dashboard & Content Composer

│ "Build the private Admin section inside a src/pages/admin folder. First, build Dashboard.jsx —a master hub featuring quick-action cards and a
robust
│ data table listing all existing articles with 'Edit' and 'Delete' buttons. Next, build ArticleEditor.jsx , a comprehensive form that allows the user
│ to create a new article, define its title, slug, excerpt, and category, and includes a dynamic builder to add, edit, or remove blocks in the
│ layout_blocks JSON array before saving the payload to Supabase."
