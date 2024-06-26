import axios from 'axios'
import _uniqBy from 'lodash/uniqBy'

const _defaultMessage = 'Search for the movie title!'

export default {
    // module!
    namespaced: true,
    // data!
    state: () => ({
        movies: [],
        message: _defaultMessage,
        loading: false,
        theMovie: {}
    }),
    // computed!
    getters: {},
    // methods!
    // 변이
    mutations: {
        updateState(state, payload) {
            // ['movies', 'message', 'loading']
            Object.keys(payload).forEach(key => {
                state[key] = payload[key]
            })
        },
        resetMovies(state) {
            state.movies = []
            state.message = _defaultMessage
            state.loading = false
        }
    },
    // 비동기
    actions: {
        async searchMovies({ state, commit }, payload) {
            if(state.loading) {
                return
            }

            commit('updateState', {
                message: '',
                loading: true
            })

            try {
                const res = await _fetchMovie({
                    ...payload,
                    page: 1
                })
                const {Search, totalResults } = res.data
                commit('updateState', {
                    movies: _uniqBy(Search, 'imdbID')
                })
                console.log(totalResults) // 268
                console.log(typeof totalResults) // string
    
                const total = parseInt(totalResults, 10)
                const pageLength = Math.ceil(total / 10)
    
                // 추가 요청
                if(pageLength > 1) {
                    for (let page = 2; page <= pageLength; page += 1) {
                        if (page > (payload.number / 10)) break
    
                        const res = await _fetchMovie({
                            ...payload,
                            page
                        })
                        const { Search } = res.data
                        commit('updateState', {
                            movies: [
                                ...state.movies, 
                                ..._uniqBy(Search, 'imdbID')
                            ]
                        })
                    }
                }
            } catch ({ message }) {
                commit('updateState', {
                    movies: [],
                    message
                })
            } finally {
                commit('updateState', {
                    loading: false
                })
            }
        },
        // 단일 영화 정보
        async searchMovieWithId({ state, commit }, payload) {
            if(state.loading) return

            commit('updateState', {
                theMovie: {},
                loading:true
            })

            try {
                const res = await _fetchMovie(payload)
                commit('updateState', {
                    theMovie: res.data
                })
            } catch (error) {
                commit('updateState', {
                    theMovie: {}
                })
            } finally {
                commit('updateState', {
                    loading: false
                })
            }
        }
    }
}

function _fetchMovie(payload) {
    axios.post('/.netlify/functions/movie', payload)
}