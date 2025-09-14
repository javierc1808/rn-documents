# React Native Challenge

## 1. Development Approach
Before writing any code, I defined the **key processes** needed to complete the task effectively:

1. **Define processes** → identify requirements and break them down into clear tasks.  
2. **Execute tasks** → implement the essential features to deliver a **functional MVP**.  
3. **Refine** → improve structure, optimize code, polish visuals, and ensure test coverage.  

This approach avoids falling into the trap of “perfection” and ensures delivering value on time while maintaining technical quality.

---

## 2. Principles & Philosophy
- **Robustness and maintainability** over premature optimization.  
- **Extensibility:** code is structured to make it easy to add new features.  
- **Tests as safety nets:** they don’t eliminate all errors but help catch them early and give confidence when changing code.  
- **Early value delivery:** ship a minimum viable product before spending too much on fine-tuning.  

---

## 3. Tech Stack
I chose **Expo** as the foundation since it is currently recommended by the React Native team for starting new projects:

- Fast development.  
- Mature and stable toolset.  
- Easy deployment to both iOS and Android.  

---

## 4. Third-Party Libraries
### Contents
- [@shopify/flash-list](#shopifyflash-list)
- [expo-haptics](#expo-haptics)
- [@faker-js/faker](#faker-jsfaker)
- [@expo/vector-icons](#expovector-icons)
- [@tanstack/react-query](#tanstacksreact-query)
- [zustand](#zustand)
- [date-fns](#date-fns)
- [@react-native-async-storage/async-storage](#react-native-async-storageasync-storage)
- [expo-notifications](#expo-notifications)
- [@testing-library/react-native + jest](#testing-libraryreact-native--jest)
- [react-native-toast-message](#react-native-toast-message)
- [react-hook-form](#react-hook-form)
- [@hookform/resolvers](#hookformresolvers)
- [zod](#zod)

---

### @shopify/flash-list

**Why**  
High‑performance virtualized list for React Native. Better FPS, memory usage, and render times than `FlatList`, especially for **large datasets** and complex cells. Smoother scroll and less jank on both platforms.

**Alternatives**  
- `FlatList` (RN core) — ✅ simple, no extra deps; ❌ worse for long/variable lists.  
- `RecyclerListView` — ✅ blazing performance; ❌ steeper API/learning curve.  
- `MasonryFlashList` — ✅ masonry‑style grids; ❌ niche use‑case.

**When to switch**  
- Small/static lists → `FlatList` is enough and reduces deps.  
- Need extreme control for very variable cells → `RecyclerListView`.

**Snippet**
```tsx
import { FlashList } from '@shopify/flash-list';
<FlashList
  data={documents}
  renderItem={({ item }) => <DocCard doc={item} />}
  estimatedItemSize={90}
/>
```

---

### expo-haptics

**Why**  
Native haptics with **Expo** (works in Expo Go). Improves UX by adding tactile feedback for key actions (pull‑to‑refresh, create document, etc.).

**Alternatives**  
- `react-native-haptic-feedback` — ✅ popular; ❌ requires prebuild/eject in Expo.  
- Platform‑native APIs — ❌ more maintenance.

**When to switch**  
- Bare/Prebuild app without Expo Go → `react-native-haptic-feedback` can be more granular on some devices.

**Snippet**
```ts
import * as Haptics from 'expo-haptics';
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
```

---

### @faker-js/faker

**Why**  
Create **mock data** (names, dates, urls) for demos, tests, and empty states without relying on the backend.

**Alternatives**  
- `chance`, `casual` — ✅ lightweight; ❌ less active ecosystems.  
- Static JSON fixtures — ✅ zero deps; ❌ less realistic/varied.

**When to switch**  
- Concerned about **bundle size** → use targeted imports (e.g., `@faker-js/faker/locale/en`) or static fixtures.  
- In tight unit tests → hand‑rolled minimal mocks for maximum control.

**Snippet**
```ts
import { faker } from '@faker-js/faker';
const doc = { id: faker.string.uuid(), name: faker.commerce.productName() };
```

---

### @expo/vector-icons

**Why**  
**Icon** pack integrated with Expo (Ionicons, Material, etc.). Works out of the box with Expo Go; no extra native config.

**Alternatives**  
- `react-native-vector-icons` — base lib Expo wraps; use directly in Bare.  
- `lucide-react-native`, `phosphor-react-native` — modern icon sets.  
- `react-native-svg` + custom icons — maximum control, more work.

**When to switch**  
- Highly customized brand design → custom SVGs or Lucide/Phosphor.

**Snippet**
```tsx
import { Ionicons } from '@expo/vector-icons';
<Ionicons name="document-text-outline" size={20} />
```

---

### @tanstack/react-query

**Why**  
**Server‑state** management: caching, retries, invalidations, background refresh, pull‑to‑refresh. Simplifies fetching/sync and reduces boilerplate.

**Alternatives**  
- **SWR** — simple HTTP‑cache inspired API.  
- **RTK Query** — integrated with Redux Toolkit.  
- **Fetch + Context** — minimalistic but you’ll re‑implement cache/retry/error handling.

**When to switch**  
- Heavy Redux usage → RTK Query.  
- Very small app → SWR or direct fetch.

**Snippet**
```ts
const { data, refetch, isLoading } = useQuery({ queryKey: ['docs'], queryFn: fetchDocs });
```

---

### zustand

**Why**  
**Lightweight** global state for UI (view mode, filters, modals). Keeps non‑server state out of React Query.

**Alternatives**  
- **Jotai** — atomic state, ergonomic.  
- **Redux Toolkit** — enterprise‑standard, more ceremony.  
- **Recoil** — atomic model, smaller adoption.

**When to switch**  
- Need time‑travel/debugger/strict structure → Redux Toolkit.  
- Prefer atom composition → Jotai.

**Snippet**
```ts
import { create } from 'zustand';
export const useUI = create<{ view:'list'|'grid'; setView:(v:any)=>void }>((set)=> ({
  view: 'list', setView: (v)=> set({ view: v })
}));
```

---

### date-fns

**Why**  
**Tree‑shakeable** date utilities. Supports **relative time** (“1 day ago”) and locales.

**Alternatives**  
- **Day.js** — Moment‑like API, small.  
- **Luxon** — powerful `Intl`/time‑zones support.  
- **Intl.RelativeTimeFormat** — native relative formatting, limited helpers.

**When to switch**  
- Heavy timezone needs → Luxon.  
- Very small app → `Intl.RelativeTimeFormat` + a tiny util.

**Snippet**
```ts
import { formatDistanceToNow } from 'date-fns';
formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true });
```

---

### @react-native-async-storage/async-storage

**Why**  
Simple persistence **compatible with Expo Go**. Used for preferences and/or basic cache (via persistQueryClient if needed).

> **Why not MMKV?** It’s **faster** and more memory‑efficient, but **requires prebuild/eject** and **doesn’t work in Expo Go**. Using MMKV slows iteration (native build times) and hurts the Expo Managed DX

**Alternatives**  
- **MMKV** — 🔥 performance; ❌ prebuild, no Expo Go.  
- **react-native-encrypted-storage** — encryption for sensitive data (Bare/Prebuild).

**Snippet**
```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
// Use with persistQueryClient if desired
```

---

### expo-notifications

**Why**  
**Local** notifications and push with Expo support. For this challenge: surface realtime events (e.g., new document via WS). Works with Expo Go for locals (with setup).

**Alternatives**  
- **Notifee** — powerful UI; ❌ native setup.  
- **OneSignal** — SaaS push; ❌ heavier SDK/external setup.

**When to switch**  
- Advanced channels/actions → Notifee.  
- Large‑scale push + dashboard → OneSignal.

**Snippet**
```ts
import * as Notifications from 'expo-notifications';
await Notifications.scheduleNotificationAsync({ content: { title: 'New doc' }, trigger: null });
```

---

### @testing-library/react-native + jest

**Why**  
**Unit and UI** tests close to user interactions. `Jest` as runner/mocks; RTL for queries by text/roles.

**Alternatives**  
- **Detox** — device/emulator E2E.  
- **Vitest** — fast; requires extra setup for RN.  
- **React Test Renderer** — very low level, less realistic.

**When to switch**  
- Critical E2E flows → Detox.  
- Monorepo web+rn, speed focus → consider Vitest with proper setup.

**Snippet**
```ts
import { render, screen } from '@testing-library/react-native';
test('renders list', () => {
  render(<DocumentsScreen />);
  expect(screen.getByText(/Documents/i)).toBeTruthy();
});
```

---

### react-native-toast-message

**Why**  
**Toast notifications** for React Native with **Expo Go** support. Provides user feedback for actions (success, error, info) with customizable styling and positioning.

**Alternatives**  
- **react-native-simple-toast** — ✅ lightweight; ❌ limited customization.  
- **react-native-toast-notifications** — ✅ more features; ❌ heavier bundle.  
- **Custom modal/toast** — ✅ full control; ❌ more development time.

**When to switch**  
- Need advanced animations → custom implementation.  
- Very simple use case → `react-native-simple-toast`.

**Snippet**
```tsx
import Toast from 'react-native-toast-message';
<Toast />
// Usage: Toast.show({ type: 'success', text1: 'Document saved!' });
```

---

### react-hook-form

**Why**  
**Performant** form library with minimal re-renders. Built-in validation, error handling, and TypeScript support. Reduces boilerplate compared to controlled components.

**Alternatives**  
- **Formik** — ✅ popular, mature; ❌ more re-renders, larger bundle.  
- **React Hook Form** — ✅ performance; ❌ steeper learning curve.  
- **Controlled components** — ✅ simple; ❌ lots of boilerplate for complex forms.

**When to switch**  
- Very simple forms → controlled components.  
- Heavy form validation needs → consider Formik with Yup.

**Snippet**
```tsx
import { useForm } from 'react-hook-form';
const { control, handleSubmit, formState: { errors } } = useForm();
```

---

### @hookform/resolvers

**Why**  
**Validation resolvers** for react-hook-form. Integrates with popular validation libraries (Zod, Yup, Joi) for type-safe form validation.

**Alternatives**  
- **Built-in validation** — ✅ simple; ❌ limited features.  
- **Custom validation** — ✅ full control; ❌ more development time.  
- **Yup resolver** — ✅ mature; ❌ larger bundle than Zod.

**When to switch**  
- Simple validation needs → built-in validation.  
- Complex validation rules → consider Yup for more features.

**Snippet**
```tsx
import { zodResolver } from '@hookform/resolvers/zod';
const form = useForm({ resolver: zodResolver(schema) });
```

---

### zod

**Why**  
**TypeScript-first** schema validation. Compile-time type inference, runtime validation, and excellent developer experience. Lightweight and tree-shakeable.

**Alternatives**  
- **Yup** — ✅ mature, feature-rich; ❌ larger bundle, less TypeScript integration.  
- **Joi** — ✅ powerful validation; ❌ Node.js focused, larger bundle.  
- **io-ts** — ✅ functional approach; ❌ steeper learning curve.

**When to switch**  
- Need advanced validation features → Yup.  
- Functional programming preference → io-ts.  
- Very simple validation → built-in validation.

**Snippet**
```ts
import { z } from 'zod';
const schema = z.object({ name: z.string().min(1), email: z.string().email() });
```

> Many of these features could be implemented from scratch, but using well-tested libraries improves efficiency and maintainability, applying the principle of **reliable code reuse**.

---

## 5. Project Structure
```
/src
  /app               # Main navigation (expo-router or screens)
  /components        # Reusable UI
  /features/documents
    api/             # http.ts, ws.ts, queries.ts
    model/           # types.ts (Document, DTOs)
    ui/              # Screens and components: List, Grid, Detail, Modal
  /lib               # queryClient, storage, theme, notifications
  /stores            # Zustand stores (viewMode, sort, modal)
  /hooks             # Custom hooks
  /test              # Unit and UI tests
```

---

## 6. Installation & Usage
### Requirements
- Node.js >= 20  
- Yarn or npm  

### Environment variables
Create a `.env` file at the root of the project with:

```env
EXPO_PUBLIC_API_URL=https://api-test-server.com
EXPO_PUBLIC_WS_URL=wss://ws-test-server.com
```

### Main scripts
```bash
# Install dependencies
yarn install

# Start project
yarn start

# Run on iOS
yarn ios

# Run on Android
yarn android

# Lint & typecheck
yarn lint
yarn typecheck

# Run tests
yarn test
```

---

## 7. Best Practices Applied
- Strict TypeScript mode.  
- ESLint + Prettier + Husky + lint-staged.  
- Clear separation between **infrastructure** (HTTP, WS) and **domain** (types, business logic).  
- Small, frequent Git commits.  
- CI (GitHub Actions) running lint, typecheck, and tests on every PR.  

---

## 8. Next Steps
With more time, I would add:
- **End-to-end testing** with Maestro.  
- Improved accessibility (labels, focus management).  
- Skeleton loaders and transition animations.  
- Deep linking and real push notifications.  

---

## 9. Author
👨‍💻 Javier Carroz  
- [LinkedIn](https://www.linkedin.com/in/javier-carroz-5b75b1ab)  
