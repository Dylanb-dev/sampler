import { encaseP2, tryP } from 'fluture'
import fetch from 'isomorphic-fetch'

const CLIENT_ID = '9676bf75d6304a6da92f201566ac377d'

const fetchf = encaseP2(fetch)

export const queryParams = params =>
  Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&')

export const getSpotifyUrl = (
  { client_id, response_type, redirect_uri } = {
    client_id: CLIENT_ID,
    response_type: 'token',
    redirect_uri: 'http://localhost:3000/callback'
  }
) =>
  `https://accounts.spotify.com/authorize?${queryParams({
    client_id,
    response_type,
    redirect_uri
  })}`

// fetchf(
//   `https://accounts.spotify.com/authorize?${queryParams({
//     client_id,
//     response_type,
//     redirect_uri
//   })}`
// )
//   .chain(res => tryP(_ => res.json()))
//   .map(user => user.name)

export const getMeInformation = ({ type, token }) =>
  fetchf('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: {
      Authorization: `${type} ${token}`
    }
  }).chain(res => tryP(() => res.json()))
