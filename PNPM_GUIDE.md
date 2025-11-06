# pnpm Package Manager Migration

Este proyecto usa **pnpm** como gestor de paquetes.

## ¿Por qué pnpm?

- **Más rápido**: Instalación hasta 2x más rápida que npm/yarn
- **Ahorro de espacio**: Sistema de almacenamiento centralizado (content-addressable)
- **Estricto**: Manejo correcto de peer dependencies
- **Monorepo-ready**: Excelente soporte para workspaces

## Instalación de pnpm

```bash
# Con npm
npm install -g pnpm

# O habilitar con corepack (recomendado)
corepack enable
```

## Comandos Básicos

```bash
# Instalar dependencias
pnpm install

# Agregar dependencia
pnpm add <package>

# Agregar dependencia de desarrollo
pnpm add -D <package>

# Ejecutar script
pnpm <script-name>
# Ejemplo: pnpm dev, pnpm build

# Actualizar dependencias
pnpm update

# Eliminar dependencia
pnpm remove <package>
```

## Migración desde yarn/npm

Si vienes de yarn o npm, estos son los equivalentes:

| npm/yarn | pnpm |
|----------|------|
| `npm install` / `yarn` | `pnpm install` |
| `npm run dev` / `yarn dev` | `pnpm dev` |
| `npm add pkg` / `yarn add pkg` | `pnpm add pkg` |
| `npx command` | `pnpm exec command` |
| `npm run script` / `yarn script` | `pnpm script` |

## Configuración

Este proyecto incluye un archivo `.npmrc` con configuraciones optimizadas para pnpm:

```
# Performance optimizations
shamefully-hoist=true
public-hoist-pattern[]=*prisma*
public-hoist-pattern[]=*@prisma*

# Dependencies
strict-peer-dependencies=false
auto-install-peers=true

# Resolution
resolution-mode=highest
```

## Archivos de Lock

- ✅ `pnpm-lock.yaml` - Lock file de pnpm (versionado en git)
- ❌ `yarn.lock` - Eliminado (ignorado en .gitignore)
- ❌ `package-lock.json` - No usado (ignorado en .gitignore)

## Scripts del Proyecto

Todos los scripts en `package.json` funcionan con pnpm:

```bash
pnpm dev              # Desarrollo
pnpm build            # Build para producción
pnpm preview          # Preview del build
pnpm lint             # Lint del código
pnpm prisma:studio    # Abrir Prisma Studio
pnpm prisma:migrate   # Crear migración
```

## Troubleshooting

### Error: "No lockfile found"
```bash
pnpm install
```

### Error: "peer dependencies"
Ya está configurado `auto-install-peers=true` en `.npmrc`

### Caché corrupto
```bash
pnpm store prune
pnpm install
```

---

Para más información, visita la [documentación oficial de pnpm](https://pnpm.io/).
