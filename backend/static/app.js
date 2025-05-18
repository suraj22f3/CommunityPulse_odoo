import Navbar  from "./components/Navbar.js"
import router from "./utils/router.js"
import store from "./utils/store.js";
import search_bar from "./components/searchbar.js";

Vue.config.devtools = true;

new Vue({
    el : '#app',
    store,
    template :`
    <div>
        <Navbar/>
        <search_bar/>
        <router-view/>
    </div>
    `,
    router,
    components:{
        Navbar,
        search_bar
    }
});