# State Management Flow - XAI Prediction Component

## Overview

The component uses a **layered state management architecture** with React Context at the top level coordinating multiple custom hooks.

## State Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     XAIPrediction                            │
│                    (Main Component)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   XAIErrorBoundary                           │
│              (Catches runtime errors)                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     XAIProvider                              │
│                  (Context Provider)                          │
│                                                              │
│  Initializes and provides all state via useXAIState():      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  10 Custom Hooks (State Sources)                   │    │
│  │                                                     │    │
│  │  1. useStudentRiskPrediction() ─────► prediction   │    │
│  │  2. useModelHealth() ───────────────► modelHealth  │    │
│  │  3. useToast() ──────────────────────► toast       │    │
│  │  4. useFormDraft() ──────────────────► form        │    │
│  │  5. useActionPlan() ─────────────────► actionPlan  │    │
│  │  6. useUIActions() ──────────────────► ui          │    │
│  │  7. useCustomActionModal() ──────────► modal       │    │
│  │  8. useSearchFilter() ────────────────► filter     │    │
│  │  9. useAriaAnnouncements() ───────────► aria       │    │
│  │                                                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Returns: { prediction, modelHealth, toast, form,           │
│             actionPlan, ui, modal, filter, aria }            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              XAIPredictionContent                            │
│          (Consumes context via useXAI())                     │
│                                                              │
│  const { prediction, form, ui, ... } = useXAI()             │
│                                                              │
│  Renders based on state:                                    │
│  ├─ if (!healthy) → ModelDownFallback                       │
│  ├─ if (loading) → PredictionResultsSkeleton                │
│  ├─ if (!prediction) → PredictionForm                       │
│  └─ if (prediction) → PredictionResults                     │
└─────────────────────────────────────────────────────────────┘
```

## State Categories

### 1. **Server State** (React Query)

Managed by TanStack Query in hooks:

```typescript
useStudentRiskPrediction() {
  useMutation({
    mutationFn: xaiService.predictRisk,
    // Automatic: loading, error, data states
    // Automatic: caching, retries, deduplication
  })
}

useModelHealth() {
  useQuery({
    queryKey: ['model-health'],
    queryFn: xaiService.checkHealth,
    refetchInterval: 30000, // Poll every 30s
    // Automatic: loading, error, data states
  })
}
```

**What React Query Handles**:

- ✅ Loading states
- ✅ Error states
- ✅ Caching (5 min stale time)
- ✅ Background refetching
- ✅ Automatic retries
- ✅ Request deduplication

### 2. **Client State** (useState)

Managed by custom hooks:

```typescript
useFormDraft() {
  const [formData, setFormData] = useState(initialData)

  // Auto-saves to localStorage with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('draft', JSON.stringify(formData))
    }, 2000)
    return () => clearTimeout(timer)
  }, [formData])
}

useToast() {
  const [toast, setToast] = useState({ show: false, message: '', type: '' })

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast.show])
}

useUIActions() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [shareLink, setShareLink] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)
  // ... handlers for export, share, theme toggle
}
```

### 3. **Derived State** (Computed)

Calculated from other state:

```typescript
useActionPlan(riskLevel) {
  const [actionPlan, setActionPlan] = useState([])

  // Derived: Generate plan based on risk level
  useEffect(() => {
    if (riskLevel) {
      const plan = generateActionPlan(riskLevel)
      setActionPlan(plan)
    }
  }, [riskLevel])

  // Derived: Calculate progress
  const getProgress = () => {
    const completed = actionPlan.filter(a => a.isCompleted).length
    return Math.round((completed / actionPlan.length) * 100)
  }
}
```

### 4. **Ephemeral State** (UI only)

Short-lived state for UI interactions:

```typescript
useSearchFilter() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  // No persistence, resets on unmount
}

useCustomActionModal() {
  const [showModal, setShowModal] = useState(false)
  const [newActionItem, setNewActionItem] = useState({ title: '', ... })
  // Modal state, cleared when closed
}
```

## State Flow Example: Submitting a Prediction

```
User fills form
      │
      ▼
handleInputChange()
      │
      ▼
form.setFormData() ──────────────────► localStorage (auto-save)
      │
      ▼
User clicks "Predict"
      │
      ▼
handleSubmit()
      │
      ├─► aria.announceLoading() ──────► Screen reader: "Analyzing..."
      │
      └─► prediction.predict(formData)
              │
              ▼
          React Query useMutation
              │
              ├─► Sets isLoading = true
              │       │
              │       ▼
              │   Component re-renders
              │       │
              │       ▼
              │   Shows PredictionResultsSkeleton
              │
              ├─► Calls xaiService.predictRisk()
              │       │
              │       ▼
              │   Zod validates request
              │       │
              │       ▼
              │   fetch() to backend
              │       │
              │       ▼
              │   Backend responds
              │       │
              │       ▼
              │   Zod validates response
              │
              ├─► Sets prediction data
              │       │
              │       ▼
              │   Component re-renders
              │       │
              │       ▼
              │   Shows PredictionResults
              │
              ├─► Triggers useEffect in useAriaAnnouncements
              │       │
              │       ▼
              │   aria.setAriaAnnouncement("Prediction complete...")
              │       │
              │       ▼
              │   toast.showSuccess("Prediction complete!")
              │
              └─► Triggers useEffect in useActionPlan
                      │
                      ▼
                  Generates action plan based on risk level
                      │
                      ▼
                  Saves to localStorage
```

## State Persistence

### localStorage (Persisted)

```typescript
useFormDraft:
  Key: 'xai-form-draft'
  Data: StudentRiskRequest
  Cleared: On successful prediction or manual clear

useActionPlan:
  Key: 'action-plan-{studentId}'
  Data: { actionPlan: ActionItem[], completionStatus: {...} }
  Cleared: Never (persists across sessions)
```

### React Query Cache (In-memory)

```typescript
Predictions:
  Key: ['prediction', studentId]
  TTL: 5 minutes (staleTime)
  GC: 10 minutes (gcTime)

Model Health:
  Key: ['model-health']
  TTL: 30 seconds (refetchInterval)
  GC: 10 minutes
```

## State Access Pattern

### Components Access State via Context:

```typescript
// In any child component
function SomeComponent() {
  const { prediction, form, ui } = useXAI();

  // Access state
  const isLoading = prediction.isLoading;
  const formData = form.formData;
  const theme = ui.theme;

  // Call actions
  const handleClick = () => {
    prediction.predict(formData);
    ui.toggleTheme();
  };
}
```

### No Prop Drilling:

```typescript
// ❌ OLD WAY (Prop Drilling)
<PredictionResults
  prediction={prediction}
  formData={formData}
  theme={theme}
  onToggleTheme={toggleTheme}
  // ... 13 more props
/>

// ✅ NEW WAY (Context)
<PredictionResults />
// Component uses useXAI() internally
```

## State Update Flow

```
User Action
    │
    ▼
Event Handler (in component)
    │
    ▼
Calls hook action (from context)
    │
    ▼
Hook updates state (useState/React Query)
    │
    ▼
Context value changes
    │
    ▼
Components re-render (only those using changed state)
    │
    ▼
UI updates
```

## Performance Optimization

### 1. **React Query** handles:

- Automatic request deduplication
- Background refetching
- Stale-while-revalidate pattern
- Garbage collection of old cache

### 2. **Context** optimization:

```typescript
// Future optimization if needed:
const XAIPredictionContent = memo(() => {
  // Component only re-renders when context changes
})

// Or split contexts:
<PredictionProvider>
  <UIProvider>
    <ActionPlanProvider>
      {children}
    </ActionPlanProvider>
  </UIProvider>
</PredictionProvider>
```

### 3. **Hook** optimization:

```typescript
// Debounced auto-save
useEffect(() => {
  const timer = setTimeout(() => save(), 2000);
  return () => clearTimeout(timer);
}, [formData]);

// Memoized calculations
const progress = useMemo(() => {
  return actionPlan.filter((a) => a.isCompleted).length / actionPlan.length;
}, [actionPlan]);
```

## Summary

**State Sources**: 10 custom hooks  
**State Distribution**: React Context  
**Server State**: React Query (automatic caching, loading, errors)  
**Client State**: useState (UI state, forms, modals)  
**Persistence**: localStorage (drafts, action plans)  
**Access Pattern**: `useXAI()` hook in any component  
**Prop Drilling**: Zero ✅  
**Performance**: Optimized with React Query + Context

The architecture is **clean, scalable, and maintainable**! 🚀
