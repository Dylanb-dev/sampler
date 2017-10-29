import { encaseP2, tryP } from 'fluture/index'
import fetch from 'isomorphic-fetch'
import { CLIENT_ID, REDIRECT_URI } from './config'

const fetchf = encaseP2(fetch)

// User must be prompted to save data to a play list

export const queryParams = params =>
  Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&')

export const getSpotifyUrl = (
  { client_id, scope, response_type, redirect_uri } = {
    client_id: CLIENT_ID,
    response_type: 'token',
    scope: 'playlist-modify-public',
    redirect_uri: `${REDIRECT_URI}/callback`
  }
) =>
  `https://accounts.spotify.com/authorize?${queryParams({
    client_id,
    response_type,
    scope,
    redirect_uri
  })}`

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
    body: JSON.stringify({
      name: playlist,
      description: 'Created from sampler app'
    }),
    headers: {
      Authorization: `${type} ${token}`
    }
  }).chain(res => tryP(() => res.json()))

export const addTracksToPlaylist = ({ type, token }) => ({
  id,
  playlistId,
  tracksUriArray
}) =>
  fetchf(
    `https://api.spotify.com/v1/users/${id}/playlists/${playlistId}/tracks`,
    {
      method: 'POST',
      'Content-Type': 'application/json',
      body: JSON.stringify({
        uris: tracksUriArray
      }),
      headers: {
        Authorization: `${type} ${token}`
      }
    }
  ).chain(res => tryP(() => res.json()))

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
