# 💊 Sistema de Recetas Médicas

Sistema web moderno para la gestión de recetas médicas, pacientes y vademecum farmacéutico.

## ✨ Características

- 📝 **Creación de Recetas**: Interfaz intuitiva para prescribir medicamentos
- 👥 **Gestión de Pacientes**: CRUD completo con búsqueda full-text
- 💊 **Vademécum**: Catálogo de medicamentos con nombre comercial y droga
- 📊 **Histórico**: Consulta de recetas con filtros avanzados
- 📄 **Generación de PDF**: Descarga de recetas individuales y reportes
- 🔐 **Autenticación**: Login seguro con Google OAuth
- 🏥 **Obras Sociales**: Soporte para múltiples proveedores y planes

## 🛠️ Stack Tecnológico

- **Frontend**: Nuxt 3 + Vue 3 + TypeScript
- **UI Components**: PrimeVue 4.3
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Auth.js (NextAuth)
- **PDF Generation**: jsPDF + jsPDF-AutoTable

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 22 LTS (recomendado) o 20+
- pnpm 9+ (instalar con `npm install -g pnpm` o `corepack enable`)
- PostgreSQL 15+
- Cuenta de Google Cloud (para OAuth)

### Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd medical-prescriptions
```

2. **Instalar dependencias**

```bash
pnpm install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
- `DATABASE_URL`: URL de conexión a PostgreSQL
- `AUTH_SECRET`: Secreto para Auth.js (genera con `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID`: Client ID de Google OAuth
- `GOOGLE_CLIENT_SECRET`: Client Secret de Google OAuth
- `ALLOWED_EMAILS`: Emails autorizados (separados por comas)

4. **Configurar la base de datos**

```bash
# Generar cliente de Prisma
pnpm prisma:generate

# Crear tablas
pnpm prisma:push

# Poblar con datos de ejemplo (opcional)
pnpm exec tsx prisma/seed.ts
```

5. **Ejecutar en desarrollo**

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📚 Documentación

- **[Guía de Migración](./MIGRATION_GUIDE.md)**: Detalles de la migración de Vue 3 a Nuxt 3
- **[Schema de Base de Datos](./prisma/schema.prisma)**: Definición del modelo de datos

## 🗂️ Estructura del Proyecto

```
├── assets/           # Estilos SCSS
├── components/       # Componentes Vue reutilizables
├── composables/      # Lógica de negocio reutilizable
├── layouts/          # Layouts de Nuxt
├── pages/            # Páginas (file-based routing)
├── prisma/           # Schema y migraciones de Prisma
├── public/           # Archivos estáticos
├── server/           # Backend API routes
│   └── api/          # Endpoints REST
├── types/            # TypeScript types
└── nuxt.config.ts    # Configuración de Nuxt
```

## 📡 API Endpoints

### Pacientes
- `GET /api/patients` - Listar pacientes (con búsqueda)
- `POST /api/patients` - Crear paciente
- `PUT /api/patients/:id` - Actualizar paciente
- `DELETE /api/patients/:id` - Eliminar paciente

### Medicamentos
- `GET /api/medicines` - Listar medicamentos
- `POST /api/medicines` - Crear medicamento
- `PUT /api/medicines/:id` - Actualizar medicamento
- `DELETE /api/medicines/:id` - Eliminar medicamento

### Recetas
- `GET /api/prescriptions` - Listar recetas (con filtros)
- `GET /api/prescriptions/:id` - Obtener receta específica
- `POST /api/prescriptions` - Crear receta

### Otros
- `GET /api/providers` - Listar obras sociales y planes
- `GET /api/diagnosis` - Listar diagnósticos
- `GET /api/users` - Listar usuarios/médicos

## 🔐 Autenticación

El sistema usa **Auth.js** con Google OAuth:

1. Los usuarios inician sesión con su cuenta de Google
2. Solo emails en `ALLOWED_EMAILS` tienen acceso
3. La sesión se mantiene server-side con cookies seguras
4. Todas las rutas excepto `/login` requieren autenticación

## 🗄️ Modelo de Datos

Tablas principales:

- **user**: Médicos/usuarios del sistema
- **patient**: Pacientes
- **vademecum**: Catálogo de medicamentos
- **prescription**: Recetas médicas
- **prescription_medicines**: Medicamentos por receta (tabla pivote)
- **provider**: Obras sociales
- **provider_plans**: Planes de obras sociales
- **diagnosis**: Diagnósticos predefinidos

Ver [schema.prisma](./prisma/schema.prisma) para detalles completos.

## 🧪 Comandos de Desarrollo

```bash
# Desarrollo
pnpm dev

# Build para producción
pnpm build

# Preview de producción
pnpm preview

# Linting
pnpm lint

# Base de datos
pnpm prisma:studio      # Abrir Prisma Studio
pnpm prisma:migrate     # Crear migración
pnpm prisma:push        # Aplicar schema sin migración
```

## 🚢 Despliegue

### Vercel (Recomendado)

```bash
vercel
```

### Netlify

```bash
netlify deploy --prod
```

### Docker

```bash
docker build -t medical-prescriptions .
docker run -p 3000:3000 medical-prescriptions
```

Asegúrate de configurar las variables de entorno en tu plataforma de deployment.

## 📝 Variables de Entorno en Producción

Configura las siguientes variables en tu plataforma:

- `DATABASE_URL`: URL de PostgreSQL en producción
- `AUTH_SECRET`: Secreto único (genera uno nuevo)
- `GOOGLE_CLIENT_ID`: Client ID de Google OAuth
- `GOOGLE_CLIENT_SECRET`: Client Secret de Google OAuth
- `ALLOWED_EMAILS`: Emails autorizados
- `NUXT_PUBLIC_APP_URL`: URL pública de tu aplicación

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y está protegido por derechos de autor.

## 🆘 Soporte

Para problemas técnicos:
1. Revisa la [Guía de Migración](./MIGRATION_GUIDE.md)
2. Consulta la documentación de [Nuxt](https://nuxt.com), [Prisma](https://prisma.io), o [PrimeVue](https://primevue.org)
3. Abre un issue en el repositorio

---

Desarrollado con ❤️ usando Nuxt 3
