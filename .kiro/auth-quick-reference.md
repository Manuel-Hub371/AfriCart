# 🚀 Authentication Quick Reference

## Using Authentication in Your Components

### 1. Access Auth State
```typescript
import { useAuth } from "@/lib/auth/context";

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;
  
  return <div>Hello {user?.firstName}!</div>;
}
```

### 2. Protect a Route
```typescript
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function VendorPage() {
  return (
    <ProtectedRoute allowedRoles={["vendor"]}>
      <div>Vendor Dashboard Content</div>
    </ProtectedRoute>
  );
}
```

### 3. Make Route Guest-Only
```typescript
import { GuestOnlyRoute } from "@/components/auth/guest-only-route";

export default function LoginPage() {
  return (
    <GuestOnlyRoute>
      <div>Login Form</div>
    </GuestOnlyRoute>
  );
}
```

### 4. Login User
```typescript
const { login } = useAuth();

const handleLogin = async () => {
  try {
    await login({ email, password, rememberMe: true });
    // Redirect handled automatically
  } catch (error) {
    console.error(error.message);
  }
};
```

### 5. Logout User
```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // Redirects to homepage
};
```

### 6. Register Customer
```typescript
const { registerCustomer } = useAuth();

const handleRegister = async () => {
  try {
    await registerCustomer({
      firstName, lastName, email, phone,
      password, confirmPassword
    });
  } catch (error) {
    console.error(error.message);
  }
};
```

### 7. Check User Role
```typescript
const { user } = useAuth();

if (user?.role === "vendor") {
  // Show vendor-specific content
}

if (user?.role === "customer") {
  // Show customer-specific content
}
```

### 8. Conditional Rendering
```typescript
const { isAuthenticated, user } = useAuth();

return (
  <>
    {!isAuthenticated ? (
      <Link href="/auth/login">Login</Link>
    ) : (
      <div>Welcome {user?.firstName}</div>
    )}
  </>
);
```

## Demo Credentials

### Customer Account
```
Email: customer@test.com
Password: Password123
```

### Vendor Account
```
Email: vendor@test.com
Password: Password123
```

## File Locations

- Auth Context: `lib/auth/context.tsx`
- Auth Service: `lib/auth/service.ts`
- Protected Route: `components/auth/protected-route.tsx`
- Guest Route: `components/auth/guest-only-route.tsx`
- Types: `lib/auth/types.ts`
