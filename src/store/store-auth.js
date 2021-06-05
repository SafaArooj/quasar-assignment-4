import { firebaseAuth } from 'boot/firebase'
import { LocalStorage } from 'quasar'
import { showErrorMessage } from '../functions/show-error-message';

const state = {
	loggedIn: false,
	userEmail: null,
}

const mutations = {
	setLoggedIn(state, value){
		state.loggedIn = value;
	},
	setUserEmail(state, value){
		state.userEmail = value;
	}
}

const actions = {
	registerUser({}, payload){
		firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
		.then(response => {
			console.log("response: " + response);
		}).catch(error => {
			console.log("Error Message: " + error.message);
		})
	},
	loginUser({},payload){
		firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
		.then(response => {
			console.log("response: " + response);
		}).catch(error => {
			console.log("Error Message: " + error.message);
			showErrorMessage(error.message);
		})
	},
	logoutUser(){
		firebaseAuth.signOut();
	},
	handleAuthStateChange({ commit, dispatch }){
		firebaseAuth.onAuthStateChanged(user => {
			if (user){
				commit('setLoggedIn',true);
				commit('setUserEmail',user.email);
				LocalStorage.set("loggedIn", true);
				this.$router.push("/");
				dispatch('foods/fbReadData', null, {root : true})
			}else{
				commit('foods/clearFoods', null, {root : true})
				commit('setUserEmail',null);
				commit('setLoggedIn',false);
				LocalStorage.set("loggedIn", false);
				this.$router.replace("/auth");
			}
		})
	}
}

const getters = {

}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}