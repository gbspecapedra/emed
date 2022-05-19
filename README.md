<p align="center">eMED</p>
<p align="center">Medical Clinic Management System</p>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/gisabernardess/emed">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/gisabernardess/emed">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/gisabernardess/emed">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/gisabernardess/emed">
  <img alt="Github license" src="https://img.shields.io/github/license/gisabernardess/emed">
</p>

<p align="center">
  <a href="#-project">Project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-project-specification">Project Specification</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-how-to-use">How To Use</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-license">License</a>&nbsp;
</p>

## 💬 Project

Final project of the Specialization Course in Web Application Development at the Pontifical Catholic University of Minas Gerais as a partial requirement to obtain the title of specialist.

The project aims to develop a software application for a web system for medical clinics, in order to model and develop intelligent environments to improve care in medical clinics.

## 🚀 Technologies

Project developed with the main following technologies:

- [Create Next App](https://nextjs.org/docs/api-reference/create-next-app)
- [Chakra UI](https://chakra-ui.com/)
- [Node.js](https://nodejs.org/en/)
- [Adonis.js](https://adonisjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

## 🔖 Project Specification

### Specification

You can view the specification [here](https://github.com/gisabernardess/emed/wiki/specification)

### Layout

You can view the layout of the project in the <a href="" rel="nofollow">web</a> version only. You need to have a <a href="https://www.figma.com/" rel="nofollow">Figma</a> account to access it.

## ℹ️ How To Use

To clone and run this application, you'll need [Git](https://git-scm.com), [Yarn](https://legacy.yarnpkg.com), [Node.js](https://nodejs.org/en/) >= 16.15, [Docker](https://docs.docker.com/desktop/) and [Docker-Compose](https://docs.docker.com/compose/). From your command line:

### 🖥️ Web

```bash
# Clone the repository
$ git clone https://github.com/gisabernardess/emed.git

# Go into the repository
$ cd emed/web

# Install dependencies
$ yarn

# Run the development server
$ yarn dev

# Navigate to http://localhost:3000
# The app will automatically reload if you change any of the source files.
```

### ⚙️ Server

```bash
# Clone the repository
$ git clone https://github.com/gisabernardess/emed-service.git

# Go into the repository
$ cd emed-service

# Install dependencies
$ yarn

# Start docker container for MySQL
$ docker-compose up -d

# Create the .env file in the repository using the sample file .env.example

# Run the development server
$ yarn dev

# Run the migrations & seeders
$ yarn reset-db

# Navigate to http://localhost:3333
# The app will automatically reload if you change any of the source files.
```

## 📝 License

This project is under the MIT license. See the <a href="https://github.com/gisabernardess/emed/blob/main/LICENSE" rel="nofollow">LICENSE</a> for more information.

---

<p align="center">Made with ♥ by Gisele Silva 👋 <a href="https://www.linkedin.com/in/gisabernardess/" rel="nofollow">Get in touch!</a></p>
