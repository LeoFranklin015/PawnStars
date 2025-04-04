import { create } from "zustand"

interface User {
  id: string
  username: string
  isVerified: boolean
  walletAddress: string
}

interface UserState {
  user: User | null
  isLoggedIn: boolean
  login: (user: User) => void
  logout: () => void
  verifyUser: () => void
}

// Mock user for demo purposes
const mockUser: User = {
  id: "1",
  username: "demo_user",
  isVerified: false,
  walletAddress: "0x1234...5678",
}

export const useUserStore = create<UserState>((set) => ({
  user: mockUser, // For demo purposes, we'll start with a logged in user
  isLoggedIn: true, // For demo purposes
  login: (user) => set({ user, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false }),
  verifyUser: () =>
    set((state) => ({
      user: state.user ? { ...state.user, isVerified: true } : null,
    })),
}))

