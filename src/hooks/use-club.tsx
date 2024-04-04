'use client'

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'

import { Club } from '@/types/club'

export interface ClubContextType {
  myClubs: Club[]
  setMyClubs: Dispatch<SetStateAction<Club[]>>
  activeClub: Club | null
  setActiveClub: Dispatch<SetStateAction<Club | null>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

const ClubContext = createContext<ClubContextType | undefined>(undefined)

export const ClubProvider = ({ children }: { children: React.ReactNode }) => {
  const [myClubs, setMyClubs] = useState<Club[]>([])
  const [activeClub, setActiveClub] = useState<Club | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  return (
    <ClubContext.Provider
      value={{
        myClubs,
        setMyClubs,
        activeClub,
        setActiveClub,
        loading,
        setLoading,
      }}
    >
      {children}
    </ClubContext.Provider>
  )
}

export const useClub = () => {
  const context = useContext(ClubContext)

  if (context === undefined) {
    throw new Error('useClub must be used within a ClubProvider')
  }

  return context
}
