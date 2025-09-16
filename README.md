
# 📌 Proyecto de Gestión para Maxikiosco GRG 

Este es un proyecto personal desarrollado para el comercio de mi padre, un **Maxikiosco con servicio de Pago Fácil y Western Union**.  
El objetivo principal es **facilitar y digitalizar las tareas diarias**, reemplazando procesos que antes se realizaban en papel o en planillas de cálculo.  

---

## 🚀 Funcionalidades principales  

### 🔐 Autenticación de usuarios  
- Registro e inicio de sesión con usuario y contraseña.  
- Contraseñas encriptadas y gestión de sesión mediante **JWT y tokens**.  
- Usuarios con distintos roles
- Acceso diferenciado según el tipo de usuario.  

### 💵 Cierres de caja  
- Cierres diarios para los sectores:  
  - **Kiosco**  
  - **Pago Fácil / Western Union**  
- Historial de cierres almacenado en base de datos.  
- Lógica basada en la planilla de Excel que se utilizaba previamente, pero con persistencia y accesibilidad desde la web.  

### 🧮 Calculadoras de facturas  
- Implementación de **3 calculadoras** en base a los tipos de facturas que recibe el comercio:  
  - **Factura B**  
  - **Factura A**  
  - **Factura A de bebidas**  
- Cada una contempla los distintos impuestos correspondientes.  

### 💳 Solicitudes de retiro de dinero  
- Gestión de solicitudes que los clientes envían por WhatsApp (retiro de débito, Mercado Pago o Western Union).  
- Sistema con **estados** que imita el proceso en papel:  
  - Creación de la solicitud.  
  - “Disponible para retiro” (tilde ✅).  
  - “Retirado” (tachado).  

### 🌍 Cotizador de divisas  
- Cotizador propio integrado en la aplicación.  
- Envía un **JSON con headers y payload** a la web de Western Union, simulando un navegador.  
- Obtiene las cotizaciones exactas de diferentes países y calcula automáticamente los costos del servicio.  
- Mucho más rápido y preciso que el cotizador oficial de Western Union.  

### 📝 Notas colaborativas  
- Creación, edición y eliminación de notas.  
- Posibilidad de compartir notas con otros usuarios del sistema.  
- Etiquetas para mejorar la organización y búsqueda.  

---

## 🎯 Objetivo del proyecto  
La aplicación nació para resolver problemas concretos del día a día en el comercio:  
- Mejorar la **persistencia y trazabilidad** de los datos.  
- Optimizar procesos que antes se hacían en papel o Excel.  
- Centralizar las distintas tareas administrativas en un solo sistema web.  

---


## Descripción

-   `user-app-backend`: Una API RESTful construida con Node.js, Express y TypeScript. Se encarga de la lógica de negocio y la comunicación con la base de datos.
-   `user-app-react`: Una aplicación de una sola página (SPA) construida con React y TypeScript. Consume los servicios del backend para proveer la interfaz de usuario.

## Primeros Pasos

A continuación se detallan los pasos para levantar el entorno de desarrollo local.

### Prerrequisitos

-   Node.js (v18 o superior)
-   npm
-   mongoDB
-   git

### Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone git@github.com:ignaciogiacotto/grg-app.git
    cd grg-app
    ```

2.  **Instalar dependencias del Backend:**
    ```bash
    cd user-app-backend
    npm install
    ```

3.  **Instalar dependencias del Frontend:**
    ```bash
    cd user-app-react
    npm install
    ```

4.  **Configurar Variables de Entorno**

    1.  
        Abrir carpeta user-app-backend en IDE (VS Code, Cursor, etc.)
        Crear archivo con nombre .env
        Escribir: 
        MONGO_URI=mongodb://localhost:27017/ (Conexion a DB)
        JWT_SECRET=(crear clave que desee)

    2.  
        Abrir carpeta user-app-react en IDE (VS Code, Cursor, etc.)
        Crear archivo con nombre .env
        Escribir: 
        REACT_APP_API_URL=http://localhost:4000 (Conexion a backend)


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

3.  **Iniciar base de datos**
    Iniciar nueva consola y ejecutar:
    ```bash
    mongod
    ```