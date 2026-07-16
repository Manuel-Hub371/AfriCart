# Authentication Integration - Requirements

## 1. User Roles

### 1.1 Role Types
- **Guest**: Unauthenticated visitors
- **Customer**: Registered shoppers
- **Vendor**: Store owners
- **Admin**: Platform administrators

### 1.2 Role Permissions
| Feature | Guest | Customer | Vendor | Admin |
|---------|-------|----------|--------|-------|
| Browse Products | ✅ | ✅ | ✅ | ✅ |
| View Stores | ✅ | ✅ | ✅ | ✅ |
| Add to Cart | ❌ | ✅ | ❌ | ✅ |
| Place Orders | ❌ | ✅ | ❌ | ✅ |
| Customer Dashboard | ❌ | ✅ | ❌ | ❌ |
| Vendor Dashboard | ❌ | ❌ | ✅ | ❌ |
| Admin Dashboard | ❌ | ❌ | ❌ | ✅ |
| Manage Products | ❌ | ❌ | ✅ | ✅ |

## 2. Authentication Flows

### 2.1 Login Flow
**User Story**: As a registered user, I want to log in to access my dashboard

**Acceptance Criteria**:
1. Login page accessible at `/auth/login`
2. User enters email/phone and password
3. System validates credentials
4. On success:
   - Store auth token securely
   - Redirect based on role:
     - Customer → `/customer/dashboard` (future)
     - Vendor → `/vendor`
     - Admin → `/admin/dashboard` (future)
   - Update navigation immediately
5. On failure:
   - Display clear error message
   - Do not reveal if email exists
6. "Remember Me" persists session for 30 days
7. "Forgot Password" link navigates to reset flow

**Validation Rules**:
- Email: Valid format or phone number
- Password: Not empty, min 8 characters
- Rate limiting: Max 5 attempts per 15 minutes

### 2.2 Customer Registration Flow
**User Story**: As a visitor, I want to create a customer account

**Acceptance Criteria**:
1. Registration accessible at `/auth/register`
2. Step 1: Choose account type (Customer/Vendor cards)
3. Customer form collects:
   - First Name (required, 2-50 chars)
   - Last Name (required, 2-50 chars)
   - Email (required, valid format, unique)
   - Phone (required, valid format, unique)
   - Password (required, min 8 chars, 1 uppercase, 1 number)
   - Confirm Password (must match)
4. Validate in real-time
5. On success:
   - Create account
   - Send verification email
   - Auto-login or redirect to verify email page
6. Link to login if account exists

**Validation Rules**:
- Email: RFC 5322 compliant, check uniqueness
- Phone: International format, check uniqueness
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
- Names: Letters, spaces, hyphens only

### 2.3 Vendor Registration Flow
**User Story**: As a visitor, I want to create a vendor account to sell

**Acceptance Criteria**:
1. Accessible via "Become a Vendor" or register flow
2. Multi-step form:
   - **Step 1**: Personal info (same as customer)
   - **Step 2**: Business info
     - Store Name (unique)
     - Business Name
     - Business Category (dropdown)
     - Country (dropdown)
     - Region/State
     - City
     - Business Address
   - **Step 3**: Security
     - Password
     - Confirm Password
   - **Step 4**: Agreements
     - Accept Marketplace Terms
     - Accept Vendor Policy
3. All fields required except noted optional
4. On success:
   - Create vendor account (pending approval)
   - Redirect to `/auth/pending-approval`
   - Send approval notification to admin
5. Vendors cannot access dashboard until approved

**Validation Rules**:
- Store name: 3-50 chars, unique, alphanumeric + spaces
- Business name: 3-100 chars
- Address: Min 10 chars
- Must accept both agreements

### 2.4 Logout Flow
**User Story**: As a logged-in user, I want to securely log out

**Acceptance Criteria**:
1. Logout button in profile menu
2. On logout:
   - Clear auth tokens
   - Clear user state
   - Clear cached data
   - Invalidate session on server
   - Redirect to homepage
   - Update navigation immediately
3. No authentication persists after logout

## 3. Navigation Requirements

### 3.1 Guest Navigation
**Top Navigation Shows**:
- Logo
- Search
- Browse Categories
- Login button
- Sign Up button

**Top Navigation Hides**:
- Profile Avatar
- Dashboard links
- Notifications
- Cart (optional: show but require login on action)

### 3.2 Customer Navigation
**Top Navigation Shows**:
- Logo
- Search
- Browse Categories
- Cart icon with count
- Notifications icon with badge
- Profile Avatar + Name
- Dropdown Menu:
  - My Dashboard
  - Orders
  - Profile
  - Settings
  - Logout

**Top Navigation Hides**:
- Login button
- Sign Up button

### 3.3 Vendor Navigation
**Top Navigation Shows**:
- Logo
- Search (optional)
- Notifications icon with badge
- Profile Avatar + Store Name
- Dropdown Menu:
  - Vendor Dashboard
  - My Store
  - Products
  - Orders
  - Settings
  - Logout

**Top Navigation Hides**:
- Login button
- Sign Up button
- Cart icon

### 3.4 Admin Navigation
**Top Navigation Shows**:
- Logo
- Notifications
- Profile Avatar
- Dropdown:
  - Admin Dashboard
  - Manage Users
  - Settings
  - Logout

## 4. Protected Routes

### 4.1 Route Protection Strategy
| Route Pattern | Allowed Roles | Redirect If Unauthorized |
|---------------|---------------|--------------------------|
| `/customer/*` | Customer | `/auth/login` |
| `/vendor/*` | Vendor | `/auth/login` |
| `/admin/*` | Admin | `/auth/login` |
| `/auth/*` | Guest | Redirect to dashboard based on role |
| `/` | All | - |
| `/products/*` | All | - |
| `/stores/*` | All | - |

### 4.2 Middleware Requirements
1. Check authentication on every protected route
2. Verify role matches route requirement
3. Handle session expiration gracefully
4. Store intended URL for redirect after login
5. Return 401 for API calls
6. Return redirect for page navigation

## 5. Session Management

### 5.1 Session Requirements
- **Access Token**: Short-lived (15 minutes)
- **Refresh Token**: Long-lived (7 days, 30 days if "Remember Me")
- **Storage**: HTTP-only cookies (preferred) or localStorage with encryption
- **Refresh Strategy**: Automatic refresh before expiration
- **Expiration Handling**: Clear state, redirect to login

### 5.2 State Persistence
- Persist auth state across page refreshes
- Restore user data on app initialization
- Handle concurrent tabs/windows
- Clear state on explicit logout

## 6. Security Requirements

### 6.1 Password Security
- Hash with bcrypt (backend)
- Min strength requirements enforced
- No password in URL or logs
- Secure transmission (HTTPS only)

### 6.2 Token Security
- HTTP-only cookies for tokens
- CSRF protection for state-changing operations
- Secure flag in production
- SameSite=Strict or Lax

### 6.3 API Security
- Verify token on every request
- Verify role matches required permission
- Rate limiting on auth endpoints
- Block after repeated failed attempts

### 6.4 Frontend Security
- No sensitive data in localStorage (except encrypted)
- Validate user input
- XSS protection via React
- No inline scripts

## 7. Error Handling

### 7.1 Login Errors
| Error | Message | Action |
|-------|---------|--------|
| Invalid credentials | "Invalid email or password" | Allow retry |
| Account locked | "Account locked. Try again in X minutes" | Show countdown |
| Account not verified | "Please verify your email" | Show resend link |
| Network error | "Connection error. Please try again" | Allow retry |

### 7.2 Registration Errors
| Error | Message | Action |
|-------|---------|--------|
| Email exists | "Email already registered" | Link to login |
| Store name taken | "Store name unavailable" | Suggest alternatives |
| Validation error | Specific field error | Highlight field |
| Network error | "Registration failed. Try again" | Allow retry |

### 7.3 Session Errors
| Error | Handling |
|-------|----------|
| Token expired | Auto-refresh or redirect to login |
| Invalid token | Clear state, redirect to login |
| Role mismatch | Show "Unauthorized" page |

## 8. User Experience Requirements

### 8.1 Loading States
- Show spinner during API calls
- Disable form during submission
- Show skeleton on route transitions
- Maintain responsiveness

### 8.2 Feedback
- Success messages for registration
- Error messages for failures
- Form validation in real-time
- Clear instructions

### 8.3 Accessibility
- ARIA labels on forms
- Keyboard navigation
- Screen reader support
- Error announcement

## 9. Data Requirements

### 9.1 User Data Structure
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'customer' | 'vendor' | 'admin';
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  
  // Vendor-specific
  storeName?: string;
  storeStatus?: 'pending' | 'approved' | 'rejected';
}
```

### 9.2 Auth State
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}
```

## 10. Integration Points

### 10.1 Backend API Endpoints Required
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-email` - Email verification

### 10.2 Frontend Components to Update
- Navigation header
- Login page form handler
- Register page form handler
- Profile dropdown menu
- Protected route wrappers

## 11. Success Criteria

### 11.1 Functional Requirements Met
- ✅ Users can register as customer or vendor
- ✅ Users can login with email/phone
- ✅ Navigation updates based on role
- ✅ Protected routes enforce role access
- ✅ Sessions persist across refreshes
- ✅ Logout clears all auth state

### 11.2 Security Requirements Met
- ✅ Passwords hashed on backend
- ✅ Tokens stored securely
- ✅ Role verified on every request
- ✅ Rate limiting prevents brute force
- ✅ CSRF protection enabled
- ✅ XSS prevention implemented

### 11.3 UX Requirements Met
- ✅ Real-time form validation
- ✅ Clear error messages
- ✅ Loading states shown
- ✅ Seamless navigation updates
- ✅ No page flicker on auth check

## 12. Future Enhancements (Phase 2)
- Social authentication (Google, Facebook)
- Two-factor authentication
- Email verification flow
- Password reset implementation
- Remember devices
- Login activity log
- Account deletion
- OAuth for third-party apps
