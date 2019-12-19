import Vue from 'vue'
import Vuex from 'vuex'
import EventService from '@/services/EventService.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: { id: 'abc123', name: 'Adam Jahr' },
    categories: ['sustainability', 'nature', 'animal welfare', 'housing', 'education', 'food', 'community'],
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false },
      { id: 3, text: '...', done: true },
      { id: 4, text: '...', done: false }
    ],
    events: [],
    event: {},
    count: 0,
    resultnum: 0
  },
  mutations: {
    INCREMENT_COUNT(state, value) {
      state.count += value
    },
    ADD_EVENT(state, event) {
      state.events.push(event)
    },
    SET_EVENTS(state, events) {
      state.events = events
    },
    UPDATE_RESULTNUM(state, value) {
      state.resultnum = value
    },
    SET_EVENT(state, event) {
      state.event = event
    }
  },
  actions: {
    createEvent({ commit }, event) {
      return EventService.postEvent(event).then(() => {
        commit('ADD_EVENT', event)
      })
    },
    fetchEvents({ commit }, { perPage, page }) {
      EventService.getEvents(perPage, page)
                  .then(response => {
                    commit('UPDATE_RESULTNUM', parseInt(response.headers['x-total-count']))
                    commit('SET_EVENTS', response.data)
                  })
                  .catch(error => {
                    console.log('There was an error:', error.response)
                  })
    },
    fetchEvent({ commit }, id) {
      var event = this.getters.getEventById(id)
      if (event) {
        commit('SET_EVENT', event)
      } else {
        EventService.getEvent(id)
                    .then(response => {
                      commit('SET_EVENT', response.data)
                    })
                    .catch(error => {
                      console.log('There was an error:', error.response)
                    })
      }
    }
  },
  getters: {
    hasNextPage: state => page => {
      if ((state.resultnum - (3*page)) > 0)
        return true
      return false
    },
    catLength: state => {
      return state.categories.length
    },
    doneTodos: (state) => {
      return state.todos.filter(todo => todo.done)
    },
    activeTodosCount: (state) => {
      return state.todos.filter(todo => !todo.done).length
    },
    getEventById: state => id => {
      return state.events.find(event => event.id === id)
    }
  }
})
