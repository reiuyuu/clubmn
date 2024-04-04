export interface Activity {
  activityId: number
  theme: string
  description: string
  startTime: string
  endTime: string
  location: string
  amount: number
}

export interface MyActivity extends Activity {
  signed: boolean
  paid: boolean
}

export interface ActivityParticipation {
  participationId: number
  userId: number
  username: string
  email: string
  signed: boolean
  paid: boolean
}
