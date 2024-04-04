export interface Club {
  clubId: number
  clubName: string
  description: string
  contactInfo: string
  activitySpace: string
  presidentId: number
  position: Position | null
}

export interface ClubApplication {
  applicationId: number
  presidentName: string
  clubName: string
  description: string
  contactInfo: string
  activitySpace: string
  status: 'apply' | 'agree' | 'reject'
}

export enum PositionEnum {
  alreadyQuit = 'alreadyQuit',
  applyQuit = 'applyQuit',
  applyJoin = 'applyJoin',
  member = 'member',
  cadreMan = 'cadreMan',
  vicePresident = 'vicePresident',
  president = 'president',
}

export type Position = keyof typeof PositionEnum

export const positions = [
  {
    value: 'alreadyQuit',
    label: 'alreadyQuit',
  },
  {
    value: 'applyQuit',
    label: 'Member',
  },
  {
    value: 'applyJoin',
    label: 'applyJoin',
  },
  {
    value: 'member',
    label: 'Member',
  },
  {
    value: 'cadreMan',
    label: 'Cadre Man',
  },
  {
    value: 'vicePresident',
    label: 'Vice President',
  },
  {
    value: 'president',
    label: 'President',
  },
]
