# Prisma Setup & Troubleshooting

## ✅ Instalación Completada

Las dependencias se han instalado correctamente con `pnpm install`.

## ⚠️ Problema con Prisma Binaries

Si ves el error:
```
Error: Failed to fetch sha256 checksum at https://binaries.prisma.sh/...
403 Forbidden
```

Este es un problema temporal con el servidor de binarios de Prisma o restricciones de red.

## 🔧 Soluciones

### Opción 1: Usar Variable de Entorno (Recomendado)

```bash
# En tu shell actual
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Luego ejecuta
pnpm prisma:generate
```

### Opción 2: Agregar al .env

Agrega al archivo `.env`:
```env
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
```

Luego ejecuta:
```bash
pnpm prisma:generate
```

### Opción 3: Esperar y Reintentar

El problema puede ser temporal. Espera unos minutos y reintenta:
```bash
pnpm prisma:generate
```

### Opción 4: Usar Binarios Locales

Si tienes los binarios en caché de una instalación previa:
```bash
rm -rf node_modules/.prisma
pnpm prisma:generate
```

## 📋 Verificar que Prisma está Funcionando

Una vez que `prisma generate` se ejecute exitosamente, verifica con:

```bash
pnpm prisma:studio
```

Esto abrirá Prisma Studio en tu navegador.

## 🗄️ Configurar la Base de Datos

Una vez que Prisma esté generado, configura tu base de datos:

```bash
# 1. Asegúrate de tener DATABASE_URL en tu .env
# 2. Ejecuta las migraciones
pnpm prisma:push

# 3. (Opcional) Pobla con datos de ejemplo
pnpm exec tsx prisma/seed.ts
```

## 🚀 Iniciar el Proyecto

Una vez configurado Prisma:

```bash
pnpm dev
```

## ❓ Si Nada Funciona

Intenta con una instalación limpia de Prisma:

```bash
# Remover node_modules y lockfile
rm -rf node_modules pnpm-lock.yaml

# Reinstalar con variable de entorno
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 pnpm install
```

## 📞 Soporte Adicional

- [Prisma GitHub Issues](https://github.com/prisma/prisma/issues)
- [Prisma Discord](https://pris.ly/discord)
- [Documentación de Prisma](https://www.prisma.io/docs)

---

**Nota**: Este problema es común en entornos con restricciones de red o proxies corporativos. La variable `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` es segura de usar en desarrollo.
