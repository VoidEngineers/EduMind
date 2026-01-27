# EduMind - Tailwind CSS & shadcn/ui Setup

## Installation Instructions

Since Node.js/pnpm is not currently in your PATH, please run these commands in your terminal:

### 1. Install Dependencies

```bash
cd /Users/ravinbandara/Desktop/Ravin/EduMind/apps/web

# Install Tailwind CSS and related dependencies
pnpm add -D tailwindcss postcss autoprefixer tailwindcss-animate

# Install shadcn/ui dependencies
pnpm add class-variance-authority clsx tailwind-merge lucide-react

# Install Radix UI primitives (for shadcn/ui components)
pnpm add @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-select @radix-ui/react-dialog @radix-ui/react-slider @radix-ui/react-progress
```

### 2. Install shadcn/ui CLI (Optional)

If you want to use the shadcn/ui CLI to add more components later:

```bash
pnpm add -D shadcn-ui
```

### 3. Verify Installation

```bash
# Type check
pnpm run type-check

# Start dev server
pnpm run dev
```

## What's Been Configured

✅ **Tailwind CSS v3** - Modern utility-first CSS framework
✅ **PostCSS** - CSS processing with autoprefixer
✅ **Path Aliases** - `@/` points to `src/` directory
✅ **CSS Variables** - Full theming system with dark mode
✅ **shadcn/ui Config** - Ready for component installation
✅ **Utils Function** - `cn()` for class name merging

## Next Steps

After running the installation commands above, I will:

1. Create core shadcn/ui components (Button, Card, Input, etc.)
2. Create a test component to verify everything works
3. Test dark mode functionality
4. Verify responsive design

## Files Created/Modified

- ✅ `tailwind.config.ts` - Tailwind configuration
- ✅ `postcss.config.js` - PostCSS configuration
- ✅ `components.json` - shadcn/ui configuration
- ✅ `vite.config.ts` - Added path alias
- ✅ `tsconfig.app.json` - Added path alias
- ✅ `src/index.css` - Tailwind directives + theme variables
- ✅ `src/lib/utils.ts` - Class name utility function

## Troubleshooting

If you encounter any issues:

- Make sure you're in the correct directory
- Ensure pnpm is installed: `npm install -g pnpm`
- Clear cache if needed: `pnpm store prune`
