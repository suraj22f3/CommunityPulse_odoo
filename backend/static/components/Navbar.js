import router from "../utils/router.js";
// import store from "../utils/store.js";
import search_bar from "./searchbar.js";

const Navbar = {
    template :`
    <nav class="h3 w-auto d-flex justify-content-between">
    <router-link to ='/'> Home </router-link>
    <router-link v-if="!state.loggedIn" to ='/user_login'> Login </router-link>
    <router-link v-if="!state.loggedIn" to ='/signup'>Signup</router-link>
    <div v-if="state.loggedIn">
        <router-link v-if=" state.role === 'user' " to ='/user-dashboard'>Dashboard</router-link>
        <router-link v-if=" state.role === 'admin' " to ='/admin-dashboard'>Dashboard</router-link>
        </div>
    <router-link v-if="state.loggedIn" to ='/sections-page'>Sections</router-link>
    <!-- <router-link v-if="state.loggedIn" to ='/books-page'>Books</router-link> -->
    <router-link v-if="state.loggedIn" to ='/profile'>Profile</router-link>
    <button class="btn btn-warning text-xl" v-if="state.loggedIn" @click="logout">Logout</button>
    </nav>
    `,
    methods: {
        logout() {
          sessionStorage.clear();
          this.$store.commit("logout");
          this.$store.commit("setRole", null);
          router.push("/user_login");
        },
    },
    data(){
        return{
            search_for:""
        }
    },
    computed: {
        state(){
            return this.$store.state
        }
    },
    components:{search_bar}
}

export default Navbar;