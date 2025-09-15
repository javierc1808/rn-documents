# RN-Documents

# React Native Challenge

## 1. Enfoque del desarrollo
Antes de escribir código, definí los **procesos clave** para cumplir con la tarea de forma efectiva:

1. **Definir procesos** → identificar requisitos y dividir en tareas claras.  
2. **Ejecutar tareas** → completar las funcionalidades esenciales para entregar un **MVP funcional**.  
3. **Refinar** → mejorar la estructura, optimizar el código, pulir visuales y garantizar cobertura de pruebas.  

Este enfoque evita caer en la trampa de la “perfección” y asegura entregar valor a tiempo, sin dejar de lado la calidad técnica.

---

## 2. Principios y filosofía
- **Robustez y mantenibilidad** sobre optimización prematura.  
- **Extensibilidad:** el código está pensado para que sea fácil agregar nuevas funciones.  
- **Pruebas como seguridad:** no eliminan todos los errores, pero ayudan a detectarlos rápido y dar confianza al hacer cambios.  
- **Valor temprano:** entregar un producto mínimo viable antes de optimizar en exceso.

---

## 3. Stack técnico
Se eligió **Expo** como base, recomendado por el equipo de React Native para iniciar proyectos:

- Desarrollo rápido.  
- Suite de herramientas madura y estable.  
- Despliegue sencillo en iOS y Android.  

---

## 4. Librerías de terceros
### Contenido
- [@shopify/flash-list](#shopifyflash-list-1)
- [expo-haptics](#expo-haptics-1)
- [@faker-js/faker](#faker-jsfaker-1)
- [@expo/vector-icons](#expovector-icons-1)
- [@tanstack/react-query](#tanstacksreact-query-1)
- [zustand](#zustand-1)
- [date-fns](#date-fns-1)
- [@react-native-async-storage/async-storage](#react-native-async-storageasync-storage-1)
- [expo-notifications](#expo-notifications-1)
- [@testing-library/react-native + jest](#testing-libraryreact-native--jest-1)
- [react-native-toast-message](#react-native-toast-message-1)
- [react-hook-form](#react-hook-form-1)
- [@hookform/resolvers](#hookformresolvers-1)
- [zod](#zod-1)

---

### @shopify/flash-list

**Por qué**  
Lista virtualizada de alto rendimiento para React Native. Mejora FPS, consumo de memoria y tiempo de render vs `FlatList`, sobre todo con **datasets grandes** y celdas complejas. Scroll más suave y menos jank.

**Alternativas**  
- `FlatList` (core) — ✅ simple, sin deps extra; ❌ rinde peor en listas largas/variadas.  
- `RecyclerListView` — ✅ muy performante; ❌ API más compleja.  
- `MasonryFlashList` — ✅ grids “masonry”; ❌ casos específicos.

**Cuándo cambiar**  
- Lista pequeña/estática → `FlatList` basta y reduce deps.  
- Control extremo de celdas muy variables → `RecyclerListView`.

**Snippet**
```tsx
import { FlashList } from '@shopify/flash-list';
<FlashList
  data={documents}
  renderItem={({ item }) => <DocCard doc={item} />}
/>
```

---

### expo-haptics

**Por qué**  
Haptics nativo con **Expo** (funciona en Expo Go). Mejora UX con feedback táctil en acciones clave (pull‑to‑refresh, crear documento, etc.).

**Alternativas**  
- `react-native-haptic-feedback` — ✅ muy usado; ❌ requiere prebuild/eject en Expo.  
- APIs nativas por plataforma — ❌ más mantenimiento.

**Cuándo cambiar**  
- Proyecto Bare/Prebuild sin Expo Go → `react-native-haptic-feedback` puede ser más granular en algunos dispositivos.

**Snippet**
```ts
import * as Haptics from 'expo-haptics';
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
```

---

### @faker-js/faker

**Por qué**  
Generar **datos de prueba** (nombres, fechas, urls) para demos, tests y estados vacíos sin depender del backend.

**Alternativas**  
- `chance`, `casual` — ✅ livianas; ❌ ecosistema menos activo.  
- JSON estáticos — ✅ cero deps; ❌ menos realismo/variabilidad.

**Cuándo cambiar**  
- Si preocupa el **bundle size** → imports dirigidos (p. ej., `@faker-js/faker/locale/es`) o fixtures JSON.  
- En tests unitarios → mocks a mano para control al 100%.

**Snippet**
```ts
import { faker } from '@faker-js/faker';
const doc = { id: faker.string.uuid(), name: faker.commerce.productName() };
```

---

### @expo/vector-icons

**Por qué**  
Paquete de **iconos** integrado con Expo (Ionicons, Material, etc.). Funciona en Expo Go sin configuración nativa.

**Alternativas**  
- `react-native-vector-icons` — base que Expo incluye; en Bare lo usarías directo.  
- `lucide-react-native`, `phosphor-react-native` — sets modernos.  
- `react-native-svg` + iconos propios — máximo control, más trabajo.

**Cuándo cambiar**  
- Diseño de marca altamente personalizado → SVG propios o Lucide/Phosphor.

**Snippet**
```tsx
import { Ionicons } from '@expo/vector-icons';
<Ionicons name="document-text-outline" size={20} />
```

---

### @tanstack/react-query

**Por qué**  
Gestión de **estado del servidor**: cache, reintentos, invalidaciones, refresh en background, pull‑to‑refresh. Simplifica fetching/sync y reduce boilerplate.

**Alternativas**  
- **SWR** — API simple inspirada en cache HTTP.  
- **RTK Query** — integrado con Redux Toolkit.  
- **Fetch + Context** — minimalista, reimplementas cache/errores/reintentos.

**Cuándo cambiar**  
- Uso pesado de Redux → RTK Query.  
- App muy pequeña → SWR o fetch directo.

**Snippet**
```ts
const { data, refetch, isLoading } = useQuery({ queryKey: ['docs'], queryFn: fetchDocs });
```

---

### zustand

**Por qué**  
Estado global **ligero** para UI (modo vista, filtros, modales). Mantiene fuera de React Query el estado no‑remoto.

**Alternativas**  
- **Jotai** — estado atómico, ergonómico.  
- **Redux Toolkit** — estándar enterprise, más ceremonia.  
- **Recoil** — modelo atómico, menor adopción.

**Cuándo cambiar**  
- Necesitas time‑travel/debugger/estructura estricta → Redux Toolkit.  
- Prefieres átomos y composición → Jotai.

**Snippet**
```ts
import { create } from 'zustand';
export const useUI = create<{ view:'list'|'grid'; setView:(v:any)=>void }>((set)=> ({
  view: 'list', setView: (v)=> set({ view: v })
}));
```

---

### date-fns

**Por qué**  
Utilidades de fechas **tree‑shakeable**. Soporta **formato relativo** (“hace 1 día”) y locales.

**Alternativas**  
- **Day.js** — API tipo Moment, liviano.  
- **Luxon** — potente con `Intl` y zonas horarias.  
- **Intl.RelativeTimeFormat** — nativo para relativas, limitado.

**Cuándo cambiar**  
- Requieres zonas horarias avanzadas → Luxon.  
- App muy pequeña → `Intl.RelativeTimeFormat` + util simple.

**Snippet**
```ts
import { formatDistanceToNow } from 'date-fns';
formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true });
```

---

### @react-native-async-storage/async-storage

**Por qué**  
Persistencia simple **compatible con Expo Go**. Se usa para preferencias y/o cache básico (vía persistQueryClient si se desea).

> **Por qué no MMKV:** es más **rápido** y eficiente, pero **requiere prebuild/eject** y **no funciona en Expo Go**. Usar MMKV enlentece la iteración (tiempos de compilación nativa) y complica el flujo Expo Managed;

**Alternativas**  
- **MMKV** — 🔥 performance; ❌ prebuild, sin Expo Go.  
- **react-native-encrypted-storage** — cifrado para datos sensibles (Bare/Prebuild).

**Snippet**
```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
// Usar con persistQueryClient si se desea
```

---

### expo-notifications

**Por qué**  
Notificaciones **locales** y push con soporte Expo. Para el reto: mostrar eventos en tiempo real (p. ej., nuevo documento vía WS). Funciona con Expo Go para locales (con setup).

**Alternativas**  
- **Notifee** — UI potente; ❌ requiere nativo.  
- **OneSignal** — push SaaS; ❌ SDK más pesado, setup externo.

**Cuándo cambiar**  
- Requisitos avanzados de canales/acciones → Notifee.  
- Push a escala con panel SaaS → OneSignal.

**Snippet**
```ts
import * as Notifications from 'expo-notifications';
await Notifications.scheduleNotificationAsync({ content: { title: 'Nuevo documento' }, trigger: null });
```

---

### @testing-library/react-native + jest

**Por qué**  
Pruebas **unitarias y de UI** cercanas a cómo interactúa el usuario. `Jest` como runner/mocks; RTL para queries por texto/roles.

**Alternativas**  
- **Detox** — E2E sobre dispositivo/emulador.  
- **Vitest** — rápido; con RN requiere setup extra.  
- **React Test Renderer** — nivel bajo, menos realista.

**Cuándo cambiar**  
- Flujos críticos end‑to‑end → Detox.  
- Monorepo web+rn, foco en velocidad → considerar Vitest con setup.

**Snippet**
```ts
import { render, screen } from '@testing-library/react-native';
test('renderiza lista', () => {
  render(<DocumentsScreen />);
  expect(screen.getByText(/Documents/i)).toBeTruthy();
});
```

---

### react-native-toast-message

**Por qué**  
**Notificaciones toast** para React Native con soporte **Expo Go**. Proporciona feedback al usuario para acciones (éxito, error, info) con estilos y posicionamiento personalizables.

**Alternativas**  
- **react-native-simple-toast** — ✅ liviano; ❌ personalización limitada.  
- **react-native-toast-notifications** — ✅ más funciones; ❌ bundle más pesado.  
- **Modal/toast personalizado** — ✅ control total; ❌ más tiempo de desarrollo.

**Cuándo cambiar**  
- Necesitas animaciones avanzadas → implementación personalizada.  
- Caso de uso muy simple → `react-native-simple-toast`.

**Snippet**
```tsx
import Toast from 'react-native-toast-message';
<Toast />
// Uso: Toast.show({ type: 'success', text1: '¡Documento guardado!' });
```

---

### react-hook-form

**Por qué**  
Librería de **formularios performante** con re-renders mínimos. Validación integrada, manejo de errores y soporte TypeScript. Reduce boilerplate comparado con componentes controlados.

**Alternativas**  
- **Formik** — ✅ popular, maduro; ❌ más re-renders, bundle más grande.  
- **React Hook Form** — ✅ performance; ❌ curva de aprendizaje más pronunciada.  
- **Componentes controlados** — ✅ simple; ❌ mucho boilerplate para formularios complejos.

**Cuándo cambiar**  
- Formularios muy simples → componentes controlados.  
- Necesidades de validación pesadas → considerar Formik con Yup.

**Snippet**
```tsx
import { useForm } from 'react-hook-form';
const { control, handleSubmit, formState: { errors } } = useForm();
```

---

### @hookform/resolvers

**Por qué**  
**Resolvers de validación** para react-hook-form. Integra con librerías de validación populares (Zod, Yup, Joi) para validación de formularios type-safe.

**Alternativas**  
- **Validación integrada** — ✅ simple; ❌ funciones limitadas.  
- **Validación personalizada** — ✅ control total; ❌ más tiempo de desarrollo.  
- **Yup resolver** — ✅ maduro; ❌ bundle más grande que Zod.

**Cuándo cambiar**  
- Necesidades de validación simples → validación integrada.  
- Reglas de validación complejas → considerar Yup para más funciones.

**Snippet**
```tsx
import { zodResolver } from '@hookform/resolvers/zod';
const form = useForm({ resolver: zodResolver(schema) });
```

---

### zod

**Por qué**  
Validación de esquemas **TypeScript-first**. Inferencia de tipos en tiempo de compilación, validación en runtime y excelente experiencia de desarrollador. Liviano y tree-shakeable.

**Alternativas**  
- **Yup** — ✅ maduro, rico en funciones; ❌ bundle más grande, menos integración TypeScript.  
- **Joi** — ✅ validación potente; ❌ enfocado en Node.js, bundle más grande.  
- **io-ts** — ✅ enfoque funcional; ❌ curva de aprendizaje más pronunciada.

**Cuándo cambiar**  
- Necesitas funciones avanzadas de validación → Yup.  
- Preferencia por programación funcional → io-ts.  
- Validación muy simple → validación integrada.

**Snippet**
```ts
import { z } from 'zod';
const schema = z.object({ name: z.string().min(1), email: z.string().email() });
```

> Se podrían implementar varias de estas funciones desde cero, pero usar librerías probadas mejora la eficiencia y la mantenibilidad, aplicando el principio de **reutilización de código confiable**.

---

## 5. Estructura del proyecto
```
/app/                    # Navegación Expo Router
/src/
  /api/                 # Capa de API
  /components/          # Componentes UI reutilizables
  /constant/            # Constantes y datos mock
  /context/             # Proveedores de React Context
  /hooks/               # Hooks personalizados
  /models/              # Tipos TypeScript y enums
  /navigation/          # Configuración de navegación
  /services/            # Lógica de negocio y servicios
  /stores/              # Gestión de estado Zustand
  /test/                # Archivos de prueba y utilidades
/assets/                # Assets estáticos
```

---

## 6. Instalación y ejecución
### Requisitos
- Node.js >= 20
- Yarn o npm

### Variables de entorno
Crea un archivo `.env` en la raíz del proyecto con:

```env
EXPO_PUBLIC_API_URL=https://api-servidor-pruebas.com
EXPO_PUBLIC_WS_URL=wss://ws-servidor-pruebas.com
```

### Scripts principales
```bash
# Instalar dependencias
yarn install

# Iniciar proyecto
yarn start

# Ejecutar en iOS
yarn ios

# Ejecutar en Android
yarn android

# Lint y typecheck
yarn lint
yarn typecheck

# Ejecutar pruebas
yarn test
```

---

## 7. Buenas prácticas aplicadas
- TypeScript estricto.  
- ESLint + Prettier + Husky + lint-staged.  
- Separación entre infraestructura (HTTP, WS) y dominio (tipos, lógica de negocio).  
- Git con commits pequeños y frecuentes.  
- CI (GitHub Actions) con lint, typecheck y tests en cada PR.  

---

## 8. Próximos pasos
Si hubiera más tiempo, se podrían implementar:
- Pruebas **end-to-end** con Maestro.  
- Mejoras de accesibilidad (labels, focus management).  
- Skeleton loaders y animaciones de transición.  
- Deep linking y notificaciones push reales.  

---

## 9. Autor
👨‍💻 Javier Carroz  
- [LinkedIn](https://www.linkedin.com/in/javier-carroz-5b75b1ab)  
