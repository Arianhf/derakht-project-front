# React Blog Page Application

This project is a React-based blog page designed for children's content, built using **Vite** for a fast development experience.

## Prerequisites

To run this project, ensure the following tools are installed on your system:

- **Node.js** (version 16 or higher recommended): [Download Node.js](https://nodejs.org/)
- **npm** or **yarn**: npm comes bundled with Node.js, or you can install Yarn separately: [Yarn Installation Guide](https://classic.yarnpkg.com/lang/en/docs/install/)

## Getting Started

Follow these steps to run the project locally:

### 1. Clone the Repository

First, clone the repository to your local machine using the following command:

```bash
git clone <repository-url>
```
Replace `<repository-url>` with the actual URL of the repository.

### 2. Navigate to the Project Directory

```bash
cd <project-directory>
```
Replace `<project-directory>` with the folder name where the project was cloned.

### 3. Install Dependencies

Install the necessary dependencies by running:

```bash
npm install
```
Or if you're using Yarn:

```bash
yarn install
```

This will download and set up all the required libraries for the project.

### 4. Start the Development Server

Run the following command to start the development server:

```bash
npm run dev
```
Or with Yarn:

```bash
yarn dev
```

You should see output similar to:

```
VITE vX.X.X  ready in X.Xs
🌐 Local: http://localhost:5173/
```

Open your browser and navigate to the provided URL (usually `http://localhost:5173/`). The app should now be running locally!

## Project Structure

Here are the key files and folders:

- **src/**: Contains all source code.
  - **components/**: React components used in the app.
  - **assets/**: Static files such as images.
  - **App.jsx**: Main app component.
  - **main.jsx**: Entry point for the app.
- **public/**: Publicly available files.
- **vite.config.js**: Vite configuration file.

## Scripts

Here are the main scripts available:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the project for production.
- `npm run preview`: Serves the production build locally for testing.

## Customization

If you want to modify the content or appearance:

1. **Edit Blog Data**:
   The blog data is stored in the `mockBlogs` array inside `src/components/BlogPage.jsx`. Modify this array to change the blog content.

2. **Change Styles**:
   - CSS for styling is located in `src/BlogPage.css`. Update this file to customize the design.

## Deployment

To deploy the app, you need to build it for production:

```bash
npm run build
```

This will generate a `dist/` folder containing the optimized production build. Deploy the contents of the `dist/` folder to any static hosting service like:

- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- [GitHub Pages](https://pages.github.com/)

## Troubleshooting

If you encounter any issues:

1. Ensure Node.js and npm/yarn are installed and up-to-date.
2. Delete the `node_modules` folder and reinstall dependencies:

   ```bash
   rm -rf node_modules
   npm install
   ```

3. Check for errors in the terminal or browser console and resolve them.

## Contributing

If you want to contribute to this project:

1. Fork the repository.
2. Create a new branch for your feature/bug fix.
3. Submit a pull request with a detailed description of your changes.

---

Feel free to reach out if you have any questions or need further assistance. Enjoy working with the React Blog Page Application!

