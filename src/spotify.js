import { encaseP, tryP } from 'fluture'
import fetch from 'isomorphic-fetch'

const CLIENT_ID = '9676bf75d6304a6da92f201566ac377d'

const fetchf = encaseP(fetch)

export const queryParams = params =>
  Object.keys(params)
    .map(k => `${encodeURIComponent(k)  }=${  encodeURIComponent(params[k])}`)
    .join('&')

export const getTokenSpotify = (
  { client_id, response_type, redirect_uri } = {
    client_id: CLIENT_ID,
    response_type: 'token',
    redirect_uri: 'http://localhost:3000/callback'
  }
) =>
  fetchf(
    `https://accounts.spotify.com/authorize?${queryParams({
      client_id,
      response_type,
      redirect_uri
    })}`
  )
    .chain(res => tryP(_ => res.json()))
    .map(user => user.name)

// export const searchByArtistName = name =>
//   fetchf(`https://api.spotify.com/v1/search?q=${name}&type=artist&limit=10`)
//     .chain(res => tryP(_ => res.json()))
//     .map(user => user.name)
