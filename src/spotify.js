import { encaseP2, tryP } from 'fluture'
import fetch from 'isomorphic-fetch'

const CLIENT_ID = '9676bf75d6304a6da92f201566ac377d'

const fetchf = encaseP2(fetch)

// User must be prompted to save data to a play list

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

export const createPlaylist = ({ type, token }) => ({ id, playlist }) =>
  fetchf(`https://api.spotify.com/v1/users/${id}/playlists`, {
    method: 'POST',
    'Content-Type': 'application/json',
    body: {
      name: playlist,
      public: true,
      collaborative: false,
      description: 'Created from sampler app'
    },
    headers: {
      Authorization: `${type} ${token}`
    }
  }).chain(res => tryP(() => res.json()))

export const search = ({ type, token }) => trackName =>
  fetchf(
    `https://api.spotify.com/v1/search?${queryParams({
      q: trackName,
      type: 'track'
    })}`,
    {
      method: 'GET',
      headers: {
        Authorization: `${type} ${token}`
      }
    }
  ).chain(res => tryP(() => res.json()))

export const getRelatedArtist = ({ type, token }) => id =>
  fetchf(`https://api.spotify.com/v1/artists/${id}/related-artists`, {
    method: 'GET',
    headers: {
      Authorization: `${type} ${token}`
    }
  }).chain(res => tryP(() => res.json()))
