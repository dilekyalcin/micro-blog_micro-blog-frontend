import { createStore } from 'vuex';

export const store = createStore({
    state(){
        return{
            isAuthenticated: false
        }
    },
    mutations:{
        saveAuth(state, status){
            state.isAuthenticated = status
        },
        logout(state, status){
            state.isAuthenticated = status
        }
    },
    actions:{
        saveAuth({ commit }){
            console.log("dispatch saveuth")
            commit("saveAuth", true)
        },
        logout({ commit }){
            console.log("dispatch logout")
            commit("logout", false);
        }
    },
    getters:{
        getAuthenticated(state){
            return state.isAuthenticated
        }
    }
})