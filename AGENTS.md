# AGENTS.md - Development Guidelines for ChronosTask

This file contains development guidelines and commands for agentic coding agents working on this Next.js time tracking application.

## Project Overview

ChronosTask is a minimalista time tracking application built with:

- **Next.js 16.1.6** (App Router)
- **React 19.2.3** with TypeScript
- **Tailwind CSS v4** for styling
- **Bun** as the package manager and runtime
- **shadcn/ui** component library (New York style)
- **next-themes** for dark/light mode support

## Development Commands

### Core Commands

```bash
# Start development server with Turbopack (recommended)
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Run ESLint
bun run lint
```

### Testing

This project currently doesn't have a formal test setup. When implementing tests:

- Add test scripts to package.json following the pattern `"test": "bun test"` or `"test": "jest"`
- For single test runs, use patterns like `"test:file": "bun test path/to.test.ts"`

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode enabled** - All types must be properly defined
- **Path aliases**: Use `@/` prefix for imports from `src/` directory
- **Target**: ES2017 with modern bundler resolution
- **JSX**: React-JSX transform (no need to import React in every file for JSX)

### Import Organization

```typescript
// 1. React/Next.js imports
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. Third-party libraries
import { clsx } from "clsx";
import { IconPlayerPlay } from "@tabler/icons-react";

// 3. Internal imports (use @/ aliases)
import { Button } from "@/components/ui/button";
import { Timer } from "@/types/timer";
import { formatTime } from "@/lib/time";
```

### Component Guidelines

#### Component Structure

```typescript
"use client"; // Add for client components with hooks/state

import { useState, memo } from "react";

// Props interface should be exported for reuse
interface ComponentProps {
  // Use descriptive prop names
  isActive: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

// Use memo for performance-critical components
const Component = memo(function Component({
  isActive,
  onToggle,
  children,
}: ComponentProps) {
  // Component logic here

  return (
    <div className="transition-all duration-300">
      {/* JSX content */}
    </div>
  );
});

export { Component };
```

#### Styling Conventions

- **Tailwind CSS only** - No inline styles or CSS modules
- **Use `cn()` utility** from `@/lib/utils` for conditional classes
- **Consistent spacing**: Use Tailwind's spacing scale consistently
- **Transitions**: Prefer `transition-all duration-300` for smooth interactions
- **Responsive design**: Mobile-first approach with `md:`, `lg:` prefixes

```typescript
import { cn } from "@/lib/utils";

const className = cn(
  "base-classes",
  isActive && "active-classes",
  "transition-all duration-300",
);
```

### TypeScript Best Practices

#### Type Definitions

- Export interfaces from dedicated type files (e.g., `@/types/timer.ts`)
- Use `interface` for object shapes, `type` for unions/primitives
- Prefer readonly properties where appropriate
- Use descriptive generic parameter names (`T`, `TProps`, etc.)

#### Error Handling

- Use proper TypeScript error types
- Implement error boundaries where appropriate
- Handle async errors with try-catch or `.catch()`

```typescript
const handleAsyncOperation = async () => {
  try {
    const result = await someAsyncOperation();
    // Handle success
  } catch (error) {
    console.error("Operation failed:", error);
    // Handle error gracefully
  }
};
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `TimerCard.tsx`, `CreateTimerForm.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useKeyboardShortcuts.ts`)
- **Utilities**: camelCase (e.g., `time.ts`, `utils.ts`)
- **Types**: camelCase (e.g., `timer.ts`, `app-state.ts`)
- **Pages**: `page.tsx` (Next.js App Router convention)
- **Layouts**: `layout.tsx` (Next.js App Router convention)

### State Management Patterns

- Use React Context for global state (see `@/context/timer-context.tsx`)
- Local state with `useState` for component-specific state
- Custom hooks for complex state logic (see `@/hooks/useTimers.ts`)
- Server components for static content, client components for interactivity

### ESLint Configuration

- Uses Next.js recommended ESLint configuration
- Core Web Vitals and TypeScript rules enabled
- Global ignores for Next.js build outputs (`.next/`, `out/`, etc.)

### Keyboard Shortcuts

- Use the `useKeyboardShortcuts` hook for consistent keyboard handling
- Follow existing patterns: Space (play/pause), Escape (close), Backspace (reset)
- Ignore shortcuts when user is typing in inputs/textareas

### Performance Considerations

- Use `memo()` for components that re-render unnecessarily
- Implement proper cleanup in useEffect
- Use ` Suspense` boundaries for loading states
- Optimize images and assets appropriately

### Internationalization

- Current language: Spanish (es)
- Metadata and UI text should be in Spanish
- Keep this consistent unless explicitly changing the target language

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
│   └── ui/          # shadcn/ui components
├── context/         # React Context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
└── types/           # TypeScript type definitions
```

## Environment Notes

- **Package Manager**: Bun (use `bun run` for scripts)
- **Node Modules**: Uses `.gitignore` standard exclusions
- **Build Output**: `.next/` directory (ignored by git)
- **Static Assets**: `public/` directory

## Common Patterns

### API Routes

When adding API routes, place them in `src/app/api/` following Next.js 13+ App Router conventions.

### Component Props

Always destructure props explicitly rather than using `props.something`.

### Event Handlers

Use descriptive handler names: `handleToggleTimer`, `handleDeleteTimer`, etc.

### Constants

Define constants at the top of files or in dedicated constants files. Use `UPPER_SNAKE_CASE` for exported constants.

## Dependencies

- Add new dependencies using `bun add package-name`
- Development dependencies: `bun add -d package-name`
- Prefer the same packages already in use (e.g., Tabler icons, not Heroicons)

Remember to run `bun run lint` after making changes to ensure code quality.
