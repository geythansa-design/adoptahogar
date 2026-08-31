# 🐾 AdoptaHogar

## Descripción del proyecto

**AdoptaHogar** es una aplicación web desarrollada para facilitar el proceso de adopción responsable de mascotas. La plataforma permite consultar mascotas disponibles, visualizar su información, realizar solicitudes de adopción y administrar dichas solicitudes mediante un panel de control.

El proyecto busca conectar mascotas que necesitan un hogar con personas interesadas en brindarles cuidado y una familia responsable.

## 🎯 Objetivo

Desarrollar una aplicación web que permita gestionar de manera sencilla el proceso de adopción de mascotas, desde la publicación y consulta de mascotas hasta la gestión de solicitudes de adopción.

## ✨ Funcionalidades principales

* Página principal de AdoptaHogar.
* Catálogo de mascotas.
* Filtrado de mascotas por tipo:

  * 🐶 Perros.
  * 🐱 Gatos.
* Visualización de información detallada de cada mascota.
* Registro e inicio de sesión de usuarios.
* Gestión de usuarios mediante autenticación.
* Dashboard para usuarios con rol de refugio.
* Administración de mascotas.
* Visualización de solicitudes de adopción.
* Aprobación o rechazo de solicitudes.
* Actualización del estado de las mascotas.
* Identificación del género de las mascotas para mostrar correctamente los estados:

  * Adoptado.
  * Adoptada.
* Una mascota adoptada deja de estar disponible para nuevas solicitudes.
* Navegación entre las diferentes secciones de la aplicación.

## 🛠️ Tecnologías utilizadas

* **Next.js 14**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Supabase**
* **PostgreSQL**
* **Supabase Auth**
* **Git**
* **GitHub**
* **Vercel**

## 👥 Roles de usuario

La aplicación contempla diferentes tipos de usuarios.

### Usuario

Puede:

* Registrarse.
* Iniciar sesión.
* Explorar mascotas.
* Consultar información de las mascotas.
* Realizar solicitudes de adopción.

### Refugio

Puede:

* Iniciar sesión.
* Acceder al dashboard.
* Administrar sus mascotas.
* Consultar solicitudes de adopción.
* Aprobar o rechazar solicitudes.
* Gestionar el estado de las mascotas.

## 🐾 Gestión de mascotas

Cada mascota puede contar con información como:

* Nombre.
* Tipo.
* Sexo.
* Edad.
* Descripción.
* Imagen.
* Estado.

Los estados permiten diferenciar entre mascotas disponibles y mascotas que ya han sido adoptadas.

Cuando una mascota pasa al estado **Adoptada** o **Adoptado**, deja de estar disponible para iniciar una nueva solicitud de adopción.

## 📋 Gestión de solicitudes

Los usuarios pueden realizar solicitudes para adoptar mascotas disponibles.

Desde el dashboard, el refugio puede consultar las solicitudes y decidir si las aprueba o las rechaza.

Cuando una adopción es aprobada, el estado correspondiente de la mascota puede actualizarse para indicar que ya fue adoptada.

## 🔐 Autenticación

La aplicación utiliza **Supabase Authentication** para gestionar el registro e inicio de sesión de los usuarios.

Las rutas que requieren autenticación cuentan con protección mediante middleware.

## 🗄️ Base de datos

La aplicación utiliza **Supabase** como plataforma de backend y base de datos.

La información de las mascotas y las solicitudes se almacena en la base de datos y se consulta desde la aplicación para mostrar información actualizada.

## 📁 Estructura general

La aplicación utiliza el sistema de rutas del **App Router de Next.js**.

Algunas de las principales secciones son:

```text
src/
├── app/
│   ├── dashboard/
│   ├── explorar/
│   ├── login/
│   ├── mascotas/
│   ├── registro/
│   └── solicitud/
├── lib/
└── public/
    └── mascotas/
```

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/geythansa-design/adoptahogar.git
```

### 2. Entrar al proyecto

```bash
cd adoptahogar
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar las variables de entorno

Crear un archivo `.env.local` con las variables necesarias para conectar la aplicación con Supabase.

### 5. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

### 6. Abrir la aplicación

```text
http://localhost:3000
```

## 🌐 Repositorio

El código fuente y el historial de desarrollo se encuentran en GitHub:

**AdoptaHogar:**
https://github.com/geythansa-design/adoptahogar

El proyecto cuenta con historial de commits que registra las diferentes etapas y mejoras realizadas durante su desarrollo.

## 📌 Estado del proyecto

Proyecto desarrollado como parte del **Proyecto Integrador – Aplicaciones Web**.

La aplicación cuenta con las funcionalidades principales para explorar mascotas, gestionar usuarios, administrar solicitudes de adopción y actualizar el estado de las mascotas.

## 👩‍💻 Autora

**Shirley Sánchez Tovar**

Instituto Tecnológico Rumiñahui (ISTER)
