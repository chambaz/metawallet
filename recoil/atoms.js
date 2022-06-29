import { atom } from 'recoil'

export const loggedInState = atom({
  key: 'loggedInState',
  default: false,
})

export const claimedState = atom({
  key: 'claimedState',
  default: false,
})

export const currentAccountState = atom({
  key: 'currentAccountState',
  default: null,
})

export const darkModeState = atom({
  key: 'darkModeState',
  default: true,
})

export const networkErrorState = atom({
  key: 'networkErrorState',
  default: false,
})

export const notificationState = atom({
  key: 'notificationState',
  default: {
    show: false,
    type: '',
    heading: '',
    message: {},
  },
})
