# PathForge architecture

The current pages remain in `app/` so existing routes and styles keep working. New work follows a feature-first boundary:

- `app/` owns route composition and App Router conventions. Route groups are ready for marketing, auth, and authenticated layouts.
- `components/` holds reusable visual primitives (`ui/`), layout building blocks (`layout/`), and future domain presentation modules.
- `features/` owns business rules and backend-facing repository contracts. It must not depend on route components.
- `data/` owns mock catalog content; replace it with API adapters without changing page UI.
- `store/` contains small cross-route UI state only. Persisted learner progress remains behind `lib/` adapters until a backend is introduced.
- `hooks/` contains reusable client behavior; `types/` owns domain types shared by features, data, and UI.

## Migration rule

When extending a current route, extract only the changed part into `components/<domain>` and move its business logic to `features/<domain>`. This preserves working presentation code while steadily reducing page-level complexity.
