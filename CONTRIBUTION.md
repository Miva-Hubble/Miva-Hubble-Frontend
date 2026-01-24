# Miva-Hubble-Frontend

## Contribution Guide

All collaborators have direct access to the repository. Please follow these steps to contribute:

### 1. Clone the Repository
Clone the repository to your local machine:

```sh
git clone https://github.com/Miva-Hubble/Miva-Hubble-Frontend.git
cd Miva-Hubble-Frontend
```

### 2. Create a Branch
Always Create a new branch for your feature or fix:

```sh
git checkout -b feature/your-feature-name
```
Use clear, descriptive names (e.g., feature/navbar, fix/contact-form, update-readme)

### 3. Make Your Changes
Edit or add HTML, CSS, or JavaScript files as needed.

### 4. Commit Your Changes
Stage and commit your changes with a clear message:

```sh
git add .
git commit -m "Describe your changes"
```
Follow the convention:
Type: short description (e.g., Fix: broken link in footer, Feat: about page layout)

### 5. Pull Latest from dev (Avoid Merge Conflicts)
Before pushing your branch, always make sure your branch is up to date with the latest `dev` branch to avoid merge conflicts:

```sh
git pull origin dev
```

If conflicts occur:

- Resolve them manually.

- Test the changes.

- Commit the resolved files.

### 6. Push Your Branch
Push your branch to the shared repository:

```sh
git push origin feature/your-feature-name
```


### 7. Open a Pull Request (PR)
Navigate to the repository on GitHub.

Open a Pull Request from your branch e.g `feature/your-feature-name` → `dev`.

Include:

A clear title (e.g., Add carousel to homepage)

A brief description of your changes and purpose.

---
**Important Tips:**
- Always pull the latest changes from the `dev` branch before starting new work.

### Workflow summary
1. `git checkout dev`
2. `git pull origin dev`
3. `git checkout -b feature/navbar`
4.  make your changes
5. `git add .`
6. `git commit -m "Add: responsive navbar component"`
7. `git pull origin dev`
8. `git push origin feature/navbar`
9. open PR to dev

Happy Coding!
