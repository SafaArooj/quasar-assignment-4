import Vue from 'vue'
import { uid } from 'quasar'
import { firebaseDb, firebaseAuth } from 'boot/firebase';
import { showErrorMessage } from '../functions/show-error-message';

const state = {
	foods: {
		// 'id1': {
		// 	name: 'Burger',
		// 	description: 'A burger is a sandwich consisting of one or more cooked patties of ground meat, usually beef, placed inside a sliced bread roll or bun.',
		// 	imageUrl: 'https://i.imgur.com/0umadnY.jpg',
		// 	rating: 4
		// },
		// 'id2': {
		// 	name: 'Pizza',
		// 	description: 'Pizza is a savory dish of Italian origin, consisting of a usually round, flattened base of leavened wheat-based dough.',
		// 	imageUrl: 'https://i.imgur.com/b9zDbyb.jpg',
		// 	rating: 5
		// },
		// 'id3': {
		// 	name: 'Sprouts',
		// 	description: 'The Brussels sprout is a member of the Gemmifera Group of cabbages, grown for its edible buds.',
		// 	imageUrl: 'https://i.imgur.com/RbKjUjB.jpg',
		// 	rating: 1
		// }	
	}
}

const mutations = {
	deleteFood(state, id) {
		Vue.delete(state.foods, id)
	},
	addFood(state, payload) {
		Vue.set(state.foods, payload.id, payload.food)
	},
	updateFood(state, payload) {
		Object.assign(state.foods[payload.id], payload.updates)
	},
	clearFoods(state){
		state.foods = {}
	}
}

const actions = {
	deleteFood({ dispatch }, id) {
		dispatch('fbDeleteFood', id)
	},
	addFood({ dispatch }, food) {
		let newId = uid()
		let payload = {
			id: newId,
			food: food
		}
		dispatch('fbAddFood', payload)
	},
	updateFood({ dispatch }, payload) {
		dispatch('fbUpdateFood', payload)
	},
	fbReadData({ commit }){
		console.log("fbReadData fired");
		let uid = firebaseAuth.currentUser.uid;
		let foods = firebaseDb.ref('foods/' + uid);

		//childEditHook
		foods.on('child_added', snapshot => {
			let food = snapshot.val();

			let payload = {
				id:  snapshot.key,
				food: food
			}
			console.log("food: " + food);
			commit('addFood', payload);
		})

		//child changed hook
		foods.on('child_changed', snapshot => {
			let food = snapshot.val();

			let payload = {
				id:  snapshot.key,
				updates: food
			}
			console.log("food: " + food);
			commit('updateFood', payload);
		})

		//child removed hook
		foods.on('child_removed', snapshot => {
			let id =  snapshot.key;

			commit('deleteFood', id);
		})
	},
	fbAddFood({},payload){
		let uid = firebaseAuth.currentUser.uid;
		let foods = firebaseDb.ref('foods/' + uid + "/" + payload.id);
		foods.set(payload.food, error => {
			if(error){
				showErrorMessage(error.message);
			}
		});
	},
	fbUpdateFood({},payload){
		let uid = firebaseAuth.currentUser.uid;
		let foods = firebaseDb.ref('foods/' + uid + "/" + payload.id);
		foods.update(payload.updates, error => {
			if(error){
				showErrorMessage(error.message);
			}
		});
	},
	fbDeleteFood({},foodId){
		let uid = firebaseAuth.currentUser.uid;
		let foods = firebaseDb.ref('foods/' + uid + "/" + foodId);
		foods.remove(error => {
			if(error){
				showErrorMessage(error.message);
			}
		});
	}

}

const getters = {
	foods: (state) => {
		return state.foods
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}