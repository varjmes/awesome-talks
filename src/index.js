import { injectGlobal } from 'styled-components'
import Home from './Pages/Home'
import Speaker from './Pages/Speaker'
import Speakers from './Pages/Speakers'
import Favorites from './Pages/Favorites'
import Tags from './Pages/Tags'
import Tag from './Pages/Tag'
import ApolloClient, { gql } from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import Router from 'preact-router'

import Nav from './Components/Nav'

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,700');
  body {
    margin: 0;
    padding: 0;
    font-family: Montserrat;
    font-size: 14px;
    color: #666;
    letter-spacing: 0.11px;
    line-height: 21px;
  }

  a {
    color: #60b7e6;
    text-decoration: none;
    padding-bottom: 2px;
    border-bottom: 2px solid #60b7e6;
    position: relative;
    padding: 5px;
    opacity: 0.8;
    font-wheight: 300;
    letter-spacing: 0.09px;
    text-align: left;
    line-height: 21px;
    cursor: pointer;

    span {
      position: relative;
      z-index: 10;
    }

    &:after {
      transition: height 200ms ease;
      content: '';
      width: 100%;
      height: 0px;
      background: #60b7e6;
      display: block;
      position: absolute;
      bottom: 0;
      z-index: 0;
    }

    &:hover {
      color: white;

      &:after {
        height: 100%;
      }
    }
  }

  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }
`

const WATCHED_KEY = 'watched__awesome-talks'
const FAV_KEY = 'favorites__awesome-talks'

const defaultState = {
  favorites: JSON.parse(localStorage.getItem(FAV_KEY)) || [],
  watched: JSON.parse(localStorage.getItem(WATCHED_KEY)) || []
}

const stateLink = {
  defaults: defaultState,
  resolvers: {
    Mutation: {
      addFavorite: (_, { id }, { cache }) => {
        const query = gql`
          query GetFavorites {
            favorites @client
          }
        `

        const previous = cache.readQuery({ query })
        const data = {
          favorites: [...previous.favorites, id]
        }

        localStorage.setItem(FAV_KEY, JSON.stringify(data.favorites))

        cache.writeQuery({ query, data })
      },
      removeFavorite: (_, { id }, { cache }) => {
        const query = gql`
          query GetFavorites {
            favorites @client
          }
        `

        const previous = cache.readQuery({ query })
        const data = {
          favorites: previous.favorites.filter(a => a !== id)
        }

        localStorage.setItem(FAV_KEY, JSON.stringify(data.favorites))

        cache.writeQuery({ query, data })
      },
      addWatched: (_, { id }, { cache }) => {
        const query = gql`
          query GetWatched {
            watched @client
          }
        `

        const previous = cache.readQuery({ query })
        const data = {
          watched: [...previous.watched, id]
        }

        localStorage.setItem(WATCHED_KEY, JSON.stringify(data.watched))

        cache.writeQuery({ query, data })
      },
      removeWatched: (_, { id }, { cache }) => {
        const query = gql`
          query GetWatched {
            watched @client
          }
        `

        const previous = cache.readQuery({ query })
        const data = {
          watched: previous.watched.filter(a => a !== id)
        }

        localStorage.setItem(WATCHED_KEY, JSON.stringify(data.watched))

        cache.writeQuery({ query, data })
      }
    }
  }
}

const client = new ApolloClient({
  uri: 'https://api.graphcms.com/simple/v1/cjhdcwrb98if90109o4pzawaq',
  clientState: stateLink
})

export default () => (
  <ApolloProvider client={client}>
    <div>
      <Nav />
      <Router>
        <Home path="/" />
        <Speaker path="/speaker/:speaker" />
        <Tag path="/category/:category" />
        <Speakers path="/speakers" />
        <Tags path="/categories" />
        <Favorites path="/favorites" />
      </Router>
    </div>
  </ApolloProvider>
)
