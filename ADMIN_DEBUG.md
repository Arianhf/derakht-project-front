# Admin Access Debug Guide

## Issue
Getting redirected from `/admin` to home page.

## Root Cause
The user is not marked as `is_staff=True` in the backend database.

## Solution

### 1. Make User Staff in Django Backend

**Using Django Shell:**
```bash
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
User = get_user_model()

# Replace with your email
user = User.objects.get(email='your-email@example.com')
user.is_staff = True
user.save()

print(f"User {user.email} is now staff: {user.is_staff}")
```

**Using Django Admin:**
1. Go to `/admin/` on your backend
2. Login with superuser
3. Find your user in Users section
4. Check "Staff status" checkbox
5. Save

### 2. Verify Backend Response

Check that `/api/users/me/` returns `is_staff: true`:

```bash
curl -H "Authorization: Token YOUR_TOKEN" http://your-backend/api/users/me/
```

### 3. Clear Frontend Cache

After making the user staff:
1. Refresh the page
2. Or logout and login again to fetch fresh user data

## Debug Logging

Check browser console for:
- User data object
- `isStaff` value
- `user.is_staff` value

This will show if the backend is returning the field correctly.

## Temporary Bypass (Development Only)

To test the UI without backend changes, edit `src/components/admin/AdminLayout.tsx`:

```typescript
// Temporarily comment out the staff check
useEffect(() => {
    if (!loading) {
        if (!user) {
            router.push('/login?redirect=/admin');
        }
        // Temporarily disabled for testing
        // else if (!isStaff) {
        //     router.push('/');
        // }
    }
}, [user, loading, isStaff, router]);
```

**Remember to re-enable this check before deploying!**
