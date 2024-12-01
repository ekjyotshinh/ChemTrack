<p align="center">
   <img src="./assets/banner.png"/>
</p>

# ChemTrack
A chemical inventory manager with QR code scanning built for schools.

## Table of Contents
- [Introduction](#introduction)
- [Contributors](#contributors)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Running the Project](#running-the-project)
  - [Backend](#running-the-backend)
  - [Frontend](#running-the-frontend)

## Introduction
ChemTrack is a project designed to manage chemical inventories. It includes a backend API built with Go and a frontend application built with React Native and Expo.

## Contributors
- Rahul Gupta
- Ekjyot Shinh
- Ajaydeep Singh
- Katy Chan
- Mari Moslehi
- Harmanjot Singh
- Romin Akoliya
- Kevin Esquivel

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Go (v1.16 or higher)
- Expo CLI (`npm install -g expo-cli`)

## Setup

### Backend
1. Navigate to the `backend` directory:
    ```sh
    cd backend
    ```
2. Install Go dependencies:
    ```sh
    go mod tidy
    ```
3. Set up environment variables:
    - Create a `.env` file in the `backend` directory and add your environment variables.

### Frontend
1. Navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```
2. Install Node.js dependencies:
    ```sh
    npm install
    ```
    or
    ```sh
    yarn install
    ```

## Running the Project

### Running the Backend
1. Navigate to the [backend] directory:
    ```sh
    cd backend
    ```
2. Start the backend server:
    ```sh
    go run main.go
    ```
3. The backend server should now be running on `http://localhost:8080`.

### Running the Frontend
1. Navigate to the [frontend] directory:
    ```sh
    cd frontend
    ```
2. Start the Expo development server:
    ```sh
    npm start
    ```
    or
    ```sh
    yarn start
    ```
3. Follow the instructions in the terminal to run the app on an emulator, simulator, or physical device.

## API Endpoints
Refer to the ```http://localhost:8080/swagger/index.html#/``` for a list of available API endpoints and their usage.


<img src="./assets/Animation.gif" alt="Swagger API Gif"/>



## Additional Information
- For more details on the project structure and code, refer to the individual files and directories.
- Ensure that you have the necessary environment variables set up for both the backend and frontend to function correctly.