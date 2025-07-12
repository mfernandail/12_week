# Week N° 12

## Step by step, line by line — becoming a Full Stack Developer in one year.

📅 Week 12 in progress – Enhancing the Movie Search App built in Week 11 by adding a Favorites feature.

### 🧠 What I’m learning this week:

- Reusing and extending existing codebases.
- Managing state with JavaScript to track favorite movies.
- Updating and persisting data using `localStorage`.
- Creating reusable components (e.g., movie cards with action buttons).
- Handling user interactions (like adding/removing favorites).

---

### 💻 Mini Project: Movie Favorites App ⭐️

A web app that builds upon the Week 11 project, allowing users to search for movies and mark their favorites. It uses the OMDb API to fetch movie data and adds local state management for storing and displaying favorite selections.

🔁 Base code is taken from **Week 11 – Movie Search App**.

Features include:

- All functionality from the Week 11 project  
- “Add to Favorites” and “Remove from Favorites” buttons  
- Local persistence using `localStorage`  
- Visual indicator for saved favorites  
- Toggle view between all movies and favorite movies  

🔑 API key continues to be handled conditionally via a local `config.js` file only during development (`localhost`).