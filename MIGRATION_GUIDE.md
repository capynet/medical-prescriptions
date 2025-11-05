# Guía de Migración: Vue 3 → Nuxt 3

## 📋 Resumen de Cambios

Esta aplicación ha sido migrada de **Vue 3 + Vite** a **Nuxt 3** con las siguientes mejoras:

### Tecnologías Actualizadas

| Antes | Después | Razón |
|-------|---------|-------|
| Vue 3 + Vite | Nuxt 3 | Full-stack framework con SSR, mejores capacidades SEO |
| Element Plus | PrimeVue 4.3 | Biblioteca de componentes más popular en 2025 (280k+ descargas/semana, 90+ componentes) |
| Firebase Auth | Auth.js (NextAuth) | Autenticación moderna para Nuxt, mismo Google OAuth |
| Supabase Client | Prisma ORM | ORM type-safe, mejor DX, despliegue transparente en cualquier PostgreSQL |
| Firebase Functions | Nuxt Server Routes | API routes nativas de Nuxt |
| Pinia | Nuxt State | Manejo de estado nativo de Nuxt (usa Pinia internamente) |

---

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Configurar las siguientes variables:

```env
# Database - Usa tu Supabase PostgreSQL existente
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"

# Auth.js - Genera un secreto aleatorio
AUTH_SECRET="tu-secreto-aleatorio-aqui"
# Genera con: openssl rand -base64 32

# Google OAuth - Obtén de Google Cloud Console
GOOGLE_CLIENT_ID="tu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-client-secret"

# Emails permitidos (separados por comas)
ALLOWED_EMAILS="doctor1@ejemplo.com,doctor2@ejemplo.com"

# URL de la aplicación
NUXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita "Google+ API"
4. Crea credenciales OAuth 2.0
5. Agrega las URIs de redirección autorizadas:
   - `http://localhost:3000/api/auth/callback/google` (desarrollo)
   - `https://tu-dominio.com/api/auth/callback/google` (producción)
6. Copia el Client ID y Client Secret al archivo `.env`

### 3. Instalar Dependencias

```bash
npm install
# o
yarn install
```

### 4. Configurar la Base de Datos

#### Opción A: Migrar desde Supabase existente

Si ya tienes datos en Supabase, Prisma puede conectarse directamente:

```bash
# Generar el cliente de Prisma
npm run prisma:generate

# Crear las migraciones basadas en el esquema
npm run prisma:migrate

# (Opcional) Poblar con datos de ejemplo
npx tsx prisma/seed.ts
```

#### Opción B: Nueva instalación

```bash
# Crear las tablas en PostgreSQL
npm run prisma:push

# Poblar con datos de ejemplo
npx tsx prisma/seed.ts
```

### 5. Ejecutar la Aplicación

```bash
# Desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3000
```

---

## 📂 Nueva Estructura del Proyecto

```
medical-prescriptions/
├── .nuxt/                    # Generado por Nuxt (no versionar)
├── assets/                   # SCSS, CSS, imágenes
│   └── scss/
│       ├── main.scss
│       ├── _table.scss
│       ├── _filter.scss
│       └── _paginator.scss
├── components/              # Componentes Vue reutilizables
├── composables/             # Lógica reutilizable
│   ├── useDiagnosis.ts
│   ├── useMedicines.ts
│   ├── usePatients.ts
│   ├── usePDF.ts
│   └── usePrescriptions.ts
├── layouts/                 # Layouts de Nuxt
│   └── default.vue         # Layout principal con navegación
├── pages/                   # Páginas (file-based routing)
│   ├── index.vue           # Crear receta (/)
│   ├── login.vue           # Login (/login)
│   ├── patients/
│   │   └── index.vue       # Gestión de pacientes (/patients)
│   ├── prescriptions/
│   │   └── index.vue       # Histórico (/prescriptions)
│   └── vademecum/
│       └── index.vue       # Vademecum (/vademecum)
├── prisma/                  # Prisma ORM
│   ├── schema.prisma       # Esquema de la base de datos
│   └── seed.ts             # Datos iniciales
├── public/                  # Archivos estáticos
├── server/                  # Backend de Nuxt
│   └── api/                # API routes
│       ├── auth/           # Autenticación
│       ├── diagnosis/      # Endpoints de diagnósticos
│       ├── medicines/      # CRUD de medicamentos
│       ├── patients/       # CRUD de pacientes
│       ├── prescriptions/  # CRUD de recetas
│       ├── providers/      # Proveedores de salud
│       └── users/          # Usuarios
├── types/                   # TypeScript types
│   └── index.ts
├── app.vue                  # Componente raíz de Nuxt
├── nuxt.config.ts          # Configuración de Nuxt
├── package.json
├── prisma.schema
└── tsconfig.json

```

---

## 🔄 Cambios Principales en el Código

### Routing

**Antes (Vue Router):**
```typescript
// router/index.ts
const routes = [
  { path: '/', component: NewPrescriptionView },
  { path: '/prescriptions', component: PrescriptionsHistoryView },
]
```

**Después (File-based Routing):**
```
pages/
├── index.vue          → /
├── prescriptions/
│   └── index.vue      → /prescriptions
```

### Autenticación

**Antes (Firebase):**
```typescript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

const signIn = () => {
  signInWithPopup(auth, new GoogleAuthProvider())
}
```

**Después (Auth.js):**
```vue
<script setup>
const { signIn } = useAuth()

const handleSignIn = () => {
  signIn('google', { callbackUrl: '/' })
}
</script>
```

### Base de Datos

**Antes (Supabase Client):**
```typescript
const { data } = await supabase
  .from('patient')
  .select('*, provider(*), plan(*)')
  .eq('id', patientId)
```

**Después (Prisma):**
```typescript
// En server/api/patients/[id].get.ts
const patient = await prisma.patient.findUnique({
  where: { id },
  include: { provider: true, plan: true }
})
```

### API Calls

**Antes (Supabase directo desde el cliente):**
```typescript
const patients = await supabase.from('patient').select('*')
```

**Después (API Routes + Composables):**
```typescript
// Composable
const { searchPatients } = usePatients()
const result = await searchPatients('Juan')

// Internamente llama a /api/patients
```

### Componentes UI

**Antes (Element Plus):**
```vue
<el-button type="primary" @click="save">Guardar</el-button>
<el-table :data="patients">
  <el-table-column prop="fullName" label="Nombre" />
</el-table>
```

**Después (PrimeVue):**
```vue
<Button label="Guardar" @click="save" />
<DataTable :value="patients">
  <Column field="fullName" header="Nombre" />
</DataTable>
```

---

## 🗄️ Esquema de Base de Datos (Prisma)

El esquema de Prisma (`prisma/schema.prisma`) define las siguientes tablas:

- **user**: Usuarios/médicos del sistema
- **provider**: Obras sociales (OSDE, Swiss Medical, etc.)
- **provider_plans**: Planes de cada obra social
- **patient**: Pacientes
- **vademecum**: Catálogo de medicamentos
- **diagnosis**: Diagnósticos predefinidos
- **prescription**: Recetas médicas
- **prescription_medicines**: Relación medicamentos-recetas

Todas las tablas usan UUIDs como primary key y tienen timestamps automáticos.

---

## 📡 API Routes

Todas las rutas de API están en `/server/api/`:

### Pacientes
- `GET /api/patients?search=Juan&limit=20&offset=0`
- `POST /api/patients` - Crear paciente
- `PUT /api/patients/:id` - Actualizar paciente
- `DELETE /api/patients/:id` - Eliminar paciente

### Medicamentos
- `GET /api/medicines?search=Ibuprofeno`
- `POST /api/medicines`
- `PUT /api/medicines/:id`
- `DELETE /api/medicines/:id`

### Recetas
- `GET /api/prescriptions?dateFrom=2025-01-01&patientName=Juan`
- `GET /api/prescriptions/:id`
- `POST /api/prescriptions`

### Otros
- `GET /api/providers` - Obras sociales y sus planes
- `GET /api/diagnosis` - Diagnósticos disponibles
- `GET /api/users` - Usuarios del sistema

---

## 🔐 Autenticación y Autorización

- Todas las páginas excepto `/login` requieren autenticación
- Se valida que el email del usuario esté en `ALLOWED_EMAILS`
- El middleware de Auth.js se ejecuta automáticamente
- La sesión se maneja server-side con cookies seguras

---

## 📦 Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Prisma
npm run prisma:migrate      # Crear migración
npm run prisma:studio       # Abrir Prisma Studio
npm run prisma:generate     # Generar cliente
npm run prisma:push         # Push schema sin migración

# Linting
npm run lint
npm run lint:fix
```

---

## 🚢 Despliegue

### Vercel (Recomendado para Nuxt)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Configurar variables de entorno en Vercel Dashboard:
- `DATABASE_URL`
- `AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `ALLOWED_EMAILS`
- `NUXT_PUBLIC_APP_URL`

### Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD ["node", ".output/server/index.mjs"]
```

---

## 🔧 Solución de Problemas

### Error: "Prisma Client no generado"
```bash
npm run prisma:generate
```

### Error: "Cannot find module '@prisma/client'"
```bash
npm install
npm run prisma:generate
```

### Error de conexión a la base de datos
Verifica que `DATABASE_URL` esté correctamente configurado en `.env`

### Error de autenticación
1. Verifica que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` estén correctos
2. Verifica las URIs de redirección en Google Cloud Console
3. Regenera `AUTH_SECRET`: `openssl rand -base64 32`

---

## 📝 Migración de Datos Existentes

Si tienes datos en Firebase o Supabase legacy:

1. Los datos de Supabase son compatibles con Prisma
2. Ejecuta las migraciones de Prisma sobre tu DB existente
3. Prisma adaptará el esquema sin perder datos (usa migraciones)

```bash
# Revisar cambios que se aplicarán
npm run prisma:migrate -- --create-only

# Aplicar migración
npm run prisma:migrate
```

---

## 🎯 Características Nuevas vs Antiguas

| Característica | Antes | Ahora |
|----------------|-------|-------|
| Crear Receta | ✅ | ✅ |
| Histórico de Recetas | ✅ | ✅ |
| Filtros Avanzados | ✅ | ✅ |
| Gestión de Pacientes | ✅ | ✅ |
| Gestión de Vademecum | ✅ | ✅ |
| Generar PDF Individual | ✅ | ✅ |
| Generar Reporte PDF | ✅ | ✅ |
| Búsqueda Full-text | ✅ | ✅ |
| Autenticación Google | ✅ | ✅ |
| SSR (Server-Side Rendering) | ❌ | ✅ |
| Type-safe Database Queries | ❌ | ✅ |
| API Routes Integradas | ❌ | ✅ |
| Mejor SEO | ❌ | ✅ |
| Deploy Simplificado | ⚠️ | ✅ |

---

## 📚 Recursos

- [Documentación de Nuxt 3](https://nuxt.com/docs)
- [Documentación de PrimeVue](https://primevue.org/)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de Auth.js](https://authjs.dev/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)

---

## 👥 Soporte

Para problemas o preguntas:
1. Revisa esta guía de migración
2. Consulta la documentación oficial de cada tecnología
3. Abre un issue en el repositorio

---

**¡Migración completada con éxito! 🎉**
