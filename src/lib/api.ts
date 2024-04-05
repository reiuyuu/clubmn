import { format } from 'date-fns'

import { Activity, ActivityParticipation, MyActivity } from '@/types/activity'
import { Club, ClubApplication, Position } from '@/types/club'
import { Member } from '@/types/member'
import { SummaryFormValues } from '@/app/components/activity/activity-pres-card'
import { NewActivityFormValues } from '@/app/components/activity/new-activity-form'
import { NewClubFormValues } from '@/app/components/expore/new-club-form'
import { ClubFormValues } from '@/app/components/settings/settings-pres'

interface Response<T> {
  code: number
  msg: string | null
  data: T
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const fetchData = (path: string, options: RequestInit = {}) =>
  fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
  }).then((res) => res.json())
// .catch((error) => console.log("Fetch data error: ", error))

// login & logout
export const login = (username: string, password: string) =>
  fetchData('/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

export const logout = (): Promise<Response<string>> =>
  fetchData('/user/logout', {
    method: 'POST',
  })

export const adminLogin = (username: string, password: string) =>
  fetchData('/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

export const adminLogout = (): Promise<Response<string>> =>
  fetchData('/admin/logout', {
    method: 'POST',
  })

// club
export const getClubs = (): Promise<Response<Club[]>> => fetchData('/clubs')

export const getMyClubs = (): Promise<Response<Club[]>> =>
  fetchData('/clubs/myclub')

export const joinClub = (clubId: number): Promise<Response<string>> =>
  fetchData(`/members/join/${clubId}`, {
    method: 'POST',
  })

export const quitClub = (clubId: number): Promise<Response<string>> =>
  fetchData(`/members/quit/${clubId}`, {
    method: 'POST',
  })

export const editClub = (
  clubId: number,
  values: ClubFormValues
): Promise<Response<string>> =>
  fetchData(`/clubs/${clubId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })

export const newClub = (values: NewClubFormValues): Promise<Response<string>> =>
  fetchData('/clubs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })

// member
export const getMembers = (clubId: number): Promise<Response<Member[]>> =>
  fetchData(`/members/${clubId}`)

export const editMemberPosition = (
  memberId: number,
  position: Position
): Promise<Response<string>> =>
  fetchData(`/members/position/${memberId}?position=${position}`, {
    method: 'PUT',
  })

// activity
export const getClubActivities = (
  clubId: number
): Promise<Response<Activity[]>> => fetchData(`/activities/${clubId}`)

export const getMyActivities = (
  clubId: number
): Promise<Response<MyActivity[]>> =>
  fetchData(`/activities/getMyParticipation/${clubId}`)

export const getActivityParticipation = (
  activityId: number
): Promise<Response<ActivityParticipation[]>> =>
  fetchData(`/activities/getParticipation/${activityId}`)

export const joinActivity = (activityId: number): Promise<Response<string>> =>
  fetchData(`/activities/join/${activityId}`, {
    method: 'POST',
  })

export const signActivity = (activityId: number): Promise<Response<string>> =>
  fetchData(`/activities/sign/${activityId}`, {
    method: 'POST',
  })

export const payActivity = (activityId: number): Promise<Response<string>> =>
  fetchData(`/activities/pay/${activityId}`, {
    method: 'POST',
  })

export const newActivity = (
  clubId: number,
  { date: { from, to }, amount, ...rest }: NewActivityFormValues
) => {
  return fetchData(`/activities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clubId,
      startTime: format(from, 'yyyy-MM-dd HH:mm:ss'),
      endTime: format(to, 'yyyy-MM-dd HH:mm:ss'),
      ...rest,
      amount: Number(amount),
    }),
  })
}

// activity summary
export const getActivitySummary = (
  activityId: number
): Promise<Response<string | null>> => fetchData(`/summaries/${activityId}`)

export const postActivitySummary = (
  activityId: number,
  values: SummaryFormValues
) =>
  fetchData(`/summaries/${activityId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })

export const editActivitySummary = (
  activityId: number,
  values: SummaryFormValues
) =>
  fetchData(`/summaries/${activityId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })

// admin
export const getAllNewClubs = (): Promise<Response<ClubApplication[]>> =>
  fetchData('/admin/allNewClub')

export const agreeClub = (
  clubApplicationId: number
): Promise<Response<string>> =>
  fetchData(`/admin/agree/${clubApplicationId}`, {
    method: 'POST',
  })

export const rejectClub = (
  clubApplicationId: number
): Promise<Response<string>> =>
  fetchData(`/admin/reject/${clubApplicationId}`, {
    method: 'POST',
  })

export const backup = (): Promise<Response<string>> =>
  fetchData('/admin/backup')

export const restore = (): Promise<Response<string>> =>
  fetchData('/admin/restore')
