import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    activities: [],
    total: 0,
    searchdate: null
  },
  mutations: {
    addActivity(state, activity) {
      var activities = JSON.parse(localStorage.getItem('activities'));
      state.activities.push(activity);
      if (!activities) {
        activities = state.activities
      } else {
        activities.push(activity);
      }
      state.total += parseInt(activity.amt);
      localStorage.setItem('activities', JSON.stringify(activities));
    },

    deleteActivity(state, activity) {
        var activities = JSON.parse(localStorage.getItem('activities'));
      if (activities && activities.length > 0) {
        activities = activities.filter(val => val.id !== activity.id)
      }
      state.activities = state.activities.filter((val) => val.id !== activity.id);
      state.total -= parseInt(activity.amt);
      localStorage.setItem('activities', JSON.stringify(activities));
    },

    searchActivity(state, date) {
        if (date) {
            state.searchdate = date
        } else {
            state.searchdate = null
        }
//        if (date) {
//            console.log(date)
//            state.activities = state.activities.filter(activity => {
//                    var tempDate = new Date(activity.date);
////                    console.log(`${tempDate.getTime() === date.getTime()}}`)
//                    return tempDate.getTime() === date.getTime();
//            });
//        }
    }
  },
  actions: {
    addActivity({commit}, {activity}) {
      commit('addActivity', activity)
    },
    deleteActivity({commit}, {activity}) {
      commit('deleteActivity', activity)
    },
    searchActivity({commit}, date) {
        commit('searchActivity', date)
    }
  },
  getters: {
    getActivities(state) {
      const activities = JSON.parse(localStorage.getItem('activities'));
      if (activities && activities.length > 0) {
         state.activities = activities;
        if (state.searchdate) {
            state.activities = state.activities.filter(activity => {
                        var tempDate = new Date(activity.date);
                        return tempDate.getTime() === state.searchdate.getTime();
            });
        }
        state.total = state.activities.map(activity => parseInt(activity.amt)).reduce((total, amount) => total += amount, 0);
      }

      return state.activities;
    },

    getTotal(state) {
        return state.total;
    }
  }
})