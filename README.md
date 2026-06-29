<img width="800" height="200" alt="VK Banner" src="https://github.com/user-attachments/assets/abe06d11-2165-44d5-bd2c-7dba05e3f84d" />

[![Node Version](https://img.shields.io/badge/Node-v24.18.0-brightgreen.svg)](https://nodejs.org/)
[![Angular Version](https://img.shields.io/badge/Angular-v20.x-red.svg)](https://angular.dev/)
[![Ionic Version](https://img.shields.io/badge/Ionic-v8.x-blue.svg)](https://ionicframework.com/)
[![Capacitor Version](https://img.shields.io/badge/Capacitor-v8.x-lightgrey.svg)](https://capacitorjs.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-v3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java Version](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.org/)
[![MySQL](https://img.shields.io/badge/MySQL-v5.7.44-blue.svg)](https://www.mysql.com/)

## Track your work

Virtual Knowledge is a comprehensive, enterprise-grade Software as a Service (SaaS) platform designed to streamline labor tracking and optimize project resource management. Built for modern corporate ecosystems, the application empowers organizations to monitor workforce allocation across multiple concurrent projects through a smart, intuitive weekly timesheet interface.

The platform eliminates administrative friction by allowing employees to log daily project hours, append specific execution details via granular item comments, and submit overarching weekly assessments through a centralized global comment system. By transforming raw time allocation into structured data metrics, Virtual Knowledge provides stakeholders with actionable insights into project costs, operational efficiency, and team velocity.

## Stay organized

- Weekly timesheet
  - Assigned projects and departments
  - Track time spent
  - Write comments
- Calendar
  - Minimalist component
  - Interaction with Timesheet
- Role management
  - Let admin manage settings for you      

## Table of Contents

- [Frontend Stack](#frontend-stack)
- [Backend Stack](#backend-stack)
- [Contribute](#contribute)
  - [Prerequisites](#prerequisites)
  - [Installation Guide](#installation-guide)

---

## Frontend Stack

The client architecture is built on top of a cross-platform mobile and web ecosystem using modern web technologies:

* **Core Framework:** Angular 20 (new control flow syntax like `@if` and `@for`).
* **UI Component Ecosystem:** Ionic Framework 8 for hybrid mobile layouts and custom enterprise web interface components.
* **Native Runtime Bridge:** Capacitor 8 (including Android and iOS platforms support, Haptics, Filesystem, and Keyboard native integration).
* **Styling & Theming:** Custom corporate components styled using SCSS alongside Ionic utility classes.
* **State & Data Utilities:** RxJS 7.8 for reactive programming and data streaming, `date-fns` 4.1 for managing ISO week configurations and date mutations, and `localforage` for performance-optimized client data persistence.
* **Security & Cryptography:** `crypto-js` 4.2 for secure frontend payload hashing.
* **Code Quality & Linting:** ESLint 9 with explicit Angular and TypeScript rulesets.

---

## Backend Stack

The server ecosystem leverages a robust, secure, and production-ready micro-architecture:

* **Language Runtime:** Java 17.
* **Core Framework:** Spring Boot 3.5.6.
* **Security & Access Control:** Spring Security with JSON Web Tokens (JWT via `jjwt` 0.11.5) for stateless API authorization.
* **Data Access & Mapping:** Spring Data JPA with Hibernate for ORM modeling, integrated with `dotenv-java` for secure, file-isolated environment variable bindings.
* **Validation:** JSR-380 / Spring Boot Starter Validation constraints for automated endpoint payload filtering.
* **Database Engine:** MySQL 5.7 containerized inside a local Docker network sandbox.
* **Testing Ecosystem:** JUnit Jupiter 5.10 and Mockito 5.5 for robust unit isolation testing.

---

## Contribute

Follow these setup instructions to prepare your Windows machine for local development and collaboration.

### Prerequisites

Ensure you have the following environments installed on your machine before triggering the build process:

* **NVM for Windows:** Node Version Manager to safely switch execution environments.
   
  Check [nvm-windows releases](https://github.com/coreybutler/nvm-windows/releases) and install the latest version.
  
  Commands (Powershell as Administrator):
  > nvm version
  ```bash
  nvm -v 
  ```
  > install the latest version of node.js
  ```bash
  nvm install latest 
  ```
  > install a specific version
  ```bash
  nvm install 24.18.0 
  ```
  > list of installed node versions
  ```bash
  nvm list 
  ```
  > use specific version
  ```bash
  nvm use 24.18.0 
  ```
  > current version used
  ```bash
  nvm current 
  ```
  > uninstall the latest version
  ```bash
  nvm uninstall latest 
  ```
* **Docker Desktop:** Required to provision the localized container data layers.

  Visit [Docker Desktop](https://www.docker.com/products/docker-desktop/) and download the latest version.
  
  Usefull commands:
  > run container from docker-comose.yaml in the repository path 
  ```bash
  docker compose up -d 
  ```
  > list active containers 
  ```bash
  docker ps
  ```
  > delete current containers 
  ```bash
  docker compose down
  ```
  
* **Java Development Kit (JDK) 17:** Set correctly in your system's `%JAVA_HOME%` variables.

  You can download JavaSE 17 from [Oracle](https://www.oracle.com/java/technologies/downloads/#java17)
  
* **Maven:** Built-in tool or custom system installation to compile the project dependencies.

  Download Apache Maven Binary zip archive from [Maven](https://maven.apache.org/download.cgi).

* **Angular:**
  Visit [Angular](https://angular.dev/) for more information.

  Installation commands:
  > install Angular cli 
  ```bash
  npm install -g @angular/cli
  ```

* **Ionic:**
  Visit [Ionic](https://ionicframework.com/) for more information.

  Installation commands:
  > install Ionic cli 
  ```bash
  npm install -g @ionic/cli
  ```
  

### Installation Guide

#### 1. Setup Environment Variables & Local Containers

> clone the repository
```bash
git clone https://github.com/1337KR3W/Virtualknowledge-Frontend.git
```
> access to the new folder
```bash
cd virtualknowledge
```
