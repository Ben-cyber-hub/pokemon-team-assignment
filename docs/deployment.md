# Deployment Documentation

This document provides detailed information about the deployment process for the Pokemon Team Builder application.

## Deployment Strategy

The application uses a Continuous Integration/Continuous Deployment (CI/CD) workflow with GitHub Actions, deploying the built application to GitHub Pages.

## GitHub Actions Workflow

The deployment process is automated through a GitHub Actions workflow defined in `.github/workflows/main.yml`.

### Workflow Stages

1. **Test and Build**
   - Triggered on push to main or gh-pages branches, or pull requests to main
   - Sets up Node.js environment
   - Installs dependencies with `npm ci`
   - Runs tests with Jest
   - Builds the production React application
   - Uploads build artifacts for the deployment job

2. **Deploy**
   - Runs only if the test-and-build job succeeds and the branch is main
   - Downloads the build artifacts
   - Deploys to GitHub Pages using the peaceiris/actions-gh-pages action

### Environment Variables

The GitHub Actions workflow uses the following secrets:
- `REACT_APP_SUPABASE_URL`: Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Supabase anonymous API key

These are stored securely in the GitHub repository settings.

## Manual Deployment

If needed, manual deployment can be performed using the following steps:

1. Install the gh-pages package if not already installed:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Build the application:
    ```
    npm run build
    ```
3. Deploy to Github Pages
    ```
    npm run deploy
    ```

### Deployment Configuration
package.json Configuration

The following fields in package.json configure the deployment:

``` js
{
  "homepage": "https://yourusername.github.io/pokemon-team-assignment",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
``` 
### Post-Deployment Verification
After deployment, verify the following:

1. Application is accessible at the deployed URL
2. Authentication flow works correctly
3. API requests to PokeAPI are functioning
4. Supabase connections for team management are working
5. Responsive design works on different devices