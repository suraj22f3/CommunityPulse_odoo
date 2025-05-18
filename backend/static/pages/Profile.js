import store from "../utils/store.js";

const Profile = {
    template: `<div v-if="computedlog"> 
            <h1> This is user profile of {{role}} {{email}} </h1>
            <router-link v-if=" role === 'user' " to ='/user-dashboard'>Dashboard</router-link>
            <router-link v-if=" role === 'admin' " to ='/admin-dashboard'>Dashboard</router-link>
      </div>`,
    data(){
        return{
            email:sessionStorage.getItem('email'),
            role:sessionStorage.getItem('role'),
            id:sessionStorage.getItem('id'),
        }
    },
    computed: {
        computedlog() {
          return store.state.loggedIn;
        },
    },
  };
  
  export default Profile;