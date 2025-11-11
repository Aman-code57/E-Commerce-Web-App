# TODO: Implement User Profile Editing in Sidebar

## Backend Changes
- [x] Add UpdateUserRequest schema in user_schema.py
- [x] Add update_user function in user_crud.py
- [x] Add PUT /me endpoint in user_routes.py

## Frontend Changes
- [x] Create Profile.jsx page in Frontend/src/pages/Profile/
- [x] Add updateUser async thunk in Userslice.js
- [x] Update App.jsx to include /profile route
- [x] Implement profile editing form in Profile.jsx (name, mobile, address)
- [x] Connect form to Redux for updating user state
- [x] Make profile link visible only when user is logged in

## Testing
- [ ] Test backend endpoint
- [ ] Test frontend profile page
- [ ] Ensure no CSS changes
