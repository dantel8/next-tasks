# Task Manager - Next.js + TypeScript + PrimeReact

Una aplicación completa de gestión de tareas construida con Next.js, TypeScript, PrimeReact, Zustand, y SQLite.

## 🚀 Características

- ✅ **CRUD completo** de tareas (Crear, Leer, Actualizar, Eliminar)
- 🎨 **UI moderna** con PrimeReact y Tailwind CSS
- 📱 **Responsive** y adaptable a móviles
- 🔍 **Búsqueda** en tiempo real
- 🎯 **Filtros** por estado (Todas, Pendientes, Completadas)
- ✨ **Validación de formularios** con Zod y React Hook Form
- 💾 **Persistencia** con SQLite (better-sqlite3)
- 🎭 **Gestión de estado** con Zustand
- 🎪 **Iconos** con Lucide React
- 📝 **TypeScript** para type safety

## 🛠️ Tecnologías

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **PrimeReact** - Componentes UI
- **Tailwind CSS** - Estilos
- **Zustand** - State Management
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Lucide React** - Iconos

### Backend
- **Next.js API Routes** - REST API
- **better-sqlite3** - Base de datos SQLite

## 📋 Requisitos Previos

- Node.js 18+ 
- pnpm, npm, o yarn

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone <tu-repo-url>
cd next-tasks
```

2. Instala las dependencias:
```bash
pnpm install
# o
npm install
```

3. Crea el archivo de variables de entorno:
```bash
cp .env.local.example .env.local
```

## 🚀 Ejecución

### Modo Desarrollo
```bash
pnpm dev
# o
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Modo Producción
```bash
pnpm build
pnpm start
```

## 📁 Estructura del Proyecto

```
next-tasks/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── tasks/
│   │   │       ├── route.ts          # GET, POST /api/tasks
│   │   │       └── [id]/route.ts     # PUT, DELETE /api/tasks/:id
│   │   ├── layout.tsx                # Layout con PrimeReact CSS
│   │   ├── page.tsx                  # Página principal
│   │   └── globals.css               # Estilos globales
│   ├── components/
│   │   ├── TaskList.tsx              # Lista con filtros y búsqueda
│   │   ├── TaskItem.tsx              # Item individual
│   │   └── TaskForm.tsx              # Formulario crear/editar
│   ├── lib/
│   │   └── db.ts                     # Acceso a SQLite
│   └── store/
│       └── taskStore.ts              # Store Zustand
├── .env.local.example                # Ejemplo de variables
└── package.json
```

## 🎯 API Endpoints

- `GET /api/tasks` - Obtener todas las tareas
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

## 📝 Variables de Entorno

```env
DATABASE_FILE=./data.db
NEXT_PUBLIC_API_URL=
```

## 👨‍💻 Autor

Dante Lugo

