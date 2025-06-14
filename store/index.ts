import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import listingsSlice from "./slices/listingsSlice"
import proposalSlice from "./slices/proposalSlice"
import messagesSlice from "./slices/messagesSlice"
import savedListingsSlice from "./slices/savedListingsSlice"
import savedSellersSlice from "./slices/savedSellersSlice"
import sellerProfilesSlice from "./slices/sellerProfilesSlice"
import forumSlice from "./slices/forumSlice"
import dealRoomsSlice from "./slices/dealRoomsSlice"
import projectWizardSlice from "./slices/projectWizardSlice"
import verificationSlice from "./slices/verificationSlice"
import analyticsSlice from "./slices/analyticsSlice"
import endorsementsSlice from "./slices/endorsementsSlice"
import buyerProfileSlice from "./slices/buyerProfileSlice"
import aiListingSlice from "./slices/aiListingSlice"
import proposalRequestsSlice from "./slices/proposalRequestsSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    listings: listingsSlice,
    proposals: proposalSlice,
    messages: messagesSlice,
    savedListings: savedListingsSlice,
    savedSellers: savedSellersSlice,
    sellerProfiles: sellerProfilesSlice,
    forum: forumSlice,
    dealRooms: dealRoomsSlice,
    projectWizard: projectWizardSlice,
    verification: verificationSlice,
    analytics: analyticsSlice,
    endorsements: endorsementsSlice,
    buyerProfile: buyerProfileSlice,
    aiListing: aiListingSlice,
    proposalRequests: proposalRequestsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
