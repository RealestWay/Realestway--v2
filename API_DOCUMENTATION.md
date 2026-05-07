# RealEstWay Backend API Documentation

## Base URL
```
http://localhost:8000/api
```
*Note: The base URL should be dynamically loaded from the environment variables (e.g., `.env`) for seamless environment transitions.*

---

## 🔐 Authentication API

### 1. Send OTP
**Endpoint:** `POST /auth/send-otp`
**Purpose:** Sends an OTP to the provided phone number.

**Request:**
```json
{
  "phone_number": "+2347034567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "phone_number": "+2347034567890",
  "otp": "123456"  // Note: Returned only in development environments
}
```

### 2. Verify OTP (Login/Register)
**Endpoint:** `POST /auth/verify-otp`
**Purpose:** Verifies the OTP and authenticates the user.

**Request:**
```json
{
  "phone_number": "+2347034567890",
  "otp_code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Phone verified successfully",
  "user": { ... },
  "token": "5|ABC123XYZ..."
}
```

### 3. Register with Email/Password
**Endpoint:** `POST /auth/register`
**Purpose:** Registers a new user with an email and password.

### 4. Login with Email/Password
**Endpoint:** `POST /auth/login`
**Purpose:** Authenticates a user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 5. Email Verification
- **Send Link:** `POST /auth/send-email-verification` (Body: `{ "email": "user@example.com" }`)
- **Verify Email:** `POST /auth/verify-email` (Body: `{ "email": "user@example.com", "otp_code": "123456" }`)

### 6. Google OAuth
**Endpoint:** `POST /auth/google`
**Request:** `{ "google_token": "eyJhbGciOiJ..." }`

### 7. Get Current User
**Endpoint:** `GET /auth/me`
**Auth:** Required (Bearer Token)
**Purpose:** Fetch the active user's details. Useful to refresh UI state after profile updates.

### 8. Set Password
**Endpoint:** `POST /auth/set-password`
**Auth:** Required
**Purpose:** Allows users (especially those authenticated via Google) to establish a password.

### 9. Logout
**Endpoint:** `POST /auth/logout`
**Auth:** Required

---

## 👤 Agent Profile API

### 1. Check Profile Availability
**Endpoint:** `GET /agent/check-profile`
**Auth:** Required
**Logic:** When a user opens the agent section, this endpoint checks if there are pre-existing properties linked to their phone number. If yes, the UI prompts them to claim the profile (via OTP verification). If no, they can proceed directly to register as an agent.

### 2. Claim Profile
**Endpoint:** `POST /agent/claim-profile`
**Auth:** Required
**Request:** `{ "phone_number": "08164312224" }`
**Logic:** Claims pre-existing properties linked to a verified phone number.

### 3. Register as Agent
**Endpoint:** `POST /agent/register`
**Auth:** Required
**Logic:** Used when a user wants to become an agent but has no pre-existing properties to claim.

### 4. Sync Agent Listings
**Endpoint:** `POST /agent/sync`
**Auth:** Required (Agent only)
**Purpose:** Forces a sync of unclaimed properties matching the agent's phone number.

### 5. Update Profile
**Endpoint:** `PATCH /agent/profile`
**Auth:** Required (Agent only)
**Request:** Supports updates to name, business name, bio, profile picture, etc.

### 6. Get Public Agent Profile
**Endpoint:** `GET /agent/profile/{identifier}`
**Auth:** Public
**Purpose:** Fetch public details of an agent using their UUID or username.

### 7. Get Public Agent Properties
**Endpoint:** `GET /agent/profile/{identifier}/properties`
**Auth:** Public
**Purpose:** Fetch paginated properties listed by a specific agent.

### 8. Get Authenticated Agent Properties
**Endpoint:** `GET /agent/properties`
**Auth:** Required (Agent only)

### 9. Get Agent Statistics
**Endpoint:** `GET /agent/stats`
**Auth:** Required (Agent only)

---

## 🏠 Properties API

### 1. Get All Properties
**Endpoint:** `GET /properties`
**Query Parameters:**
- `search`, `category`, `city`, `state`, `house_type`, `min_price`, `max_price`, `bedrooms`, `bathrooms`, `page`, `limit`

*Note: Frontend implementation should aggressively cache pagination data to improve UX and prefetch the next page in the background.*

### 2. Get Home Sections
**Endpoint:** `GET /properties/home`
**Response:** Returns grouped arrays for `recent`, `featured`, `hot_deals`, and `popular`.

### 3. Get Nearby Properties
**Endpoint:** `GET /properties/nearby`
**Query Parameters:** `lat`, `lng`, `radius`, `limit`, `city`, `state`, `address`
**Logic:** Supports spatial search with fallback to string-based location matching.

### 4. Get Platform Cities & Stats
- **Cities:** `GET /properties/cities` (Returns a list of unique cities where properties exist)
- **Public Stats:** `GET /properties/stats` (Returns aggregate platform stats)

### 5. Get Single Property
**Endpoint:** `GET /properties/{id}`

### 6. Create Property (Agent/Admin)
**Endpoint:** `POST /properties`
**Auth:** Required (Agent or Admin)

### 7. Update Property (Agent/Admin)
**Endpoint:** `PUT /properties/{id}`
**Auth:** Required

### 8. Delete Property (Agent/Admin)
**Endpoint:** `DELETE /properties/{id}`
**Auth:** Required

### 9. Publish Property Draft
**Endpoint:** `POST /properties/{id}/publish`
**Auth:** Required

### 10. Confirm Availability
**Endpoint:** `POST /properties/{id}/confirm-availability`
**Auth:** Required

---

## 💾 Saved Properties & Likes API

### 1. Save / Unsave Properties
- **Save:** `POST /properties/{id}/save`
- **Unsave:** `DELETE /properties/{id}/save`
- **Check Status:** `GET /properties/{id}/is-saved`
- **List Saved:** `GET /saved-properties` (Supports pagination)

### 2. Like / Unlike Properties
- **Like:** `POST /properties/{id}/like`
- **Unlike:** `DELETE /properties/{id}/like`
- **Check Status:** `GET /properties/{id}/is-liked`

---

## 📷 Media API

### 1. Upload Media
**Endpoint:** `POST /media`
**Auth:** Required
**Request:** `multipart/form-data` with file attachments.

### 2. Delete Media
**Endpoint:** `DELETE /media`
**Auth:** Required
**Request:** `{ "path": "path_or_url_to_media" }`

---

## 📊 Tracking & Analytics API

### 1. Track Event (Legacy)
**Endpoint:** `POST /track`
**Request:** `{ "event_type": "view", "property_id": 123 }`

### 2. Log Analytics
**Endpoint:** `POST /analytics/log`
**Request:** `{ "event_type": "view", "property_id": 123, "metadata": {...}, "anon_id": "uuid" }`

### 3. Recommendations & Trending
- **Recommendations:** `GET /recommendations` (Auth required)
- **Trending:** `GET /trending?days=7`

---

## 📚 Blog API

- **List Blogs:** `GET /blogs` (Supports `search`, `page`, `limit`)
- **Get Blog:** `GET /blogs/{slug}`

---

## 📧 Newsletter API

- **Subscribe:** `POST /newsletter/subscribe` (Body: `{ "email": "user@example.com" }`)
- **Unsubscribe:** `POST /newsletter/unsubscribe`

---

## 🔧 Admin API
*All endpoints under `/admin/*` require Admin or Super Admin privileges.*

### System Overview
- **Get Dashboard Stats:** `GET /admin/stats`
- **Get System Health:** `GET /admin/health`

### User Management
- **List Users:** `GET /admin/users`
- **Create Admin:** `POST /admin/users` (Body: User data, forces `role: 'admin'`)
- **Update User:** `PUT /admin/users/{id}`
- **Block User:** `PUT /admin/users/{id}/block` (Body: `{ "is_blocked": true }`)
- **Delete User:** `DELETE /admin/users/{id}`

### Property Moderation
- **List Properties:** `GET /admin/properties`
- **Verify Property:** `POST /admin/properties/{id}/verify`
- **Delete Property:** `DELETE /admin/properties/{id}`

### Blog Management
- **Create Blog:** `POST /admin/blogs`
- **Update Blog:** `PUT /admin/blogs/{id}`
- **Delete Blog:** `DELETE /admin/blogs/{id}`

### WhatsApp Group Management
- **List Groups:** `GET /admin/whatsapp-groups`
- **Update Group:** `PUT /admin/whatsapp-groups/{id}` (Body: `{ "city": "...", "state": "...", "is_active": true }`)
- **Delete Group:** `DELETE /admin/whatsapp-groups/{id}`

### Newsletter Management
- **List Subscribers:** `GET /admin/subscribers`
- **Export CSV:** `GET /admin/subscribers/export`
- **Delete Subscriber:** `DELETE /admin/subscribers/{id}`

---

## 🔄 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Server Error |

---

## 📍 Common Errors

### Invalid Phone Number
```json
{
  "message": "The phone number field must be a valid phone number.",
  "errors": { "phone_number": [...] }
}
```

### Authentication Required
```json
{
  "message": "Unauthenticated."
}
```

### Admin Only
```json
{
  "success": false,
  "message": "Unauthorized. Admin access required."
}
```

---

## 🧪 Testing Guide

See [TESTING.md](./TESTING.md) for detailed instructions on API testing workflows and postman collections.