# Plataforma de Aprendizaje Matemático Riguroso

Esta plataforma de aprendizaje interactivo de matemáticas está construida con Next.js (App Router), Tailwind CSS, KaTeX y el modelo de IA Gemini. Además, cuenta con un sistema flexible de carga de contenidos que permite servir los cursos desde el disco local o de manera remota desde un repositorio de GitHub.

---

## Carga de Contenidos desde GitHub (Paso a Paso)

El código de la aplicación ya está configurado con un resolvedor dinámico en `src/utils/content.ts`. Para habilitar la carga de cursos y lecciones desde tu repositorio de GitHub, sigue estos pasos:

### Paso 1: Crear o Preparar el Repositorio de Contenidos
Puedes usar el mismo repositorio del proyecto (`epontoni/learning-platform`) o uno exclusivo para contenidos. Asegúrate de que en la raíz del repositorio o de la rama seleccionada exista una carpeta llamada `content` con la estructura jerárquica esperada:

```
content/
├── cursos/
│   ├── courses-index.json
│   ├── algebra/
│   │   ├── course-meta.json
│   │   ├── unidad-1/
│   │   │   ├── unit-meta.json
│   │   │   └── 01-introduccion.mdx
│   │   └── unidad-2/
│   │       ├── unit-meta.json
│   │       └── 01-espacios.mdx
│   ├── calculo/
│   │   ├── course-meta.json
│   │   └── unidad-1/
│   │       ├── unit-meta.json
│   │       ├── 01-limites.mdx
│   │       └── 02-derivadas.mdx
│   └── numeros/
│       ├── course-meta.json
│       └── unidad-1/
│           ├── unit-meta.json
│           └── 01-modular.mdx
```

### Paso 2: Configurar las Variables de Entorno
Abre tu archivo local `.env.local` en la raíz del proyecto Next.js y define las siguientes variables:

```env
# 1. Cambia el origen de 'local' a 'github'
CONTENT_SOURCE=github

# 2. Especifica tu usuario/nombre-de-repositorio
GITHUB_CONTENT_REPO=epontoni/learning-platform

# 3. Especifica la rama (ej: main o master)
GITHUB_CONTENT_BRANCH=main

# 4. Agrega un Token de Acceso Personal (PAT) de GitHub (Opcional pero RECOMENDADO)
# Para evitar límites de tasa (rate limits) de la API pública de GitHub.
GITHUB_TOKEN=ghp_tuTokenDeAccesoPersonalDeGitHubAqui
```

> [!NOTE]
> Para generar un token de GitHub, ve a **Settings** > **Developer Settings** > **Personal Access Tokens** > **Tokens (classic)** en tu cuenta de GitHub, presiona **Generate new token**, dale un nombre descriptivo y selecciona únicamente el permiso de lectura `repo` (si es un repositorio privado) o ningún permiso específico (si es público).

### Paso 3: Iniciar o Reiniciar el Servidor de Desarrollo
Si el servidor de Next.js ya está corriendo, presiona `Ctrl + C` en tu terminal y vuelve a ejecutar:

```bash
npm run dev
```

La plataforma ahora llamará directamente a la API de contenido raw de GitHub, descargando y cacheando las lecciones dinámicamente en cada petición.

---

## Desarrollo Local

Si deseas volver a trabajar con archivos locales en tu disco duro, simplemente cambia la variable en tu `.env.local`:

```env
CONTENT_SOURCE=local
```

El servidor detectará el cambio y reanudará la lectura física de la carpeta local `./content/`.
