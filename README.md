# GRG App (Proyecto Full-Stack)

Este repositorio contiene el código para una aplicación full-stack, separada en un backend y un frontend.

## Descripción

-   `user-app-backend`: Una API RESTful construida con Node.js, Express y TypeScript. Se encarga de la lógica de negocio y la comunicación con la base de datos.
-   `user-app-react`: Una aplicación de una sola página (SPA) construida con React y TypeScript. Consume los servicios del backend para proveer la interfaz de usuario.

## Primeros Pasos

A continuación se detallan los pasos para levantar el entorno de desarrollo local.

### Prerrequisitos

-   Node.js (v18 o superior)
-   npm

### Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd grg-app
    ```

2.  **Instalar dependencias del Backend:**
    ```bash
    cd user-app-backend
    npm install
    ```

3.  **Instalar dependencias del Frontend:**
    ```bash
    cd ../user-app-react
    npm install
    ```

### Ejecución

1.  **Iniciar el Backend:**
    ```bash
    cd user-app-backend
    npm start
    ```

2.  **Iniciar el Frontend:**
    ```bash
    cd user-app-react
    npm start
    ```
