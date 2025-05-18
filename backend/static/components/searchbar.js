import store from "../utils/store.js"
const search_bar={
    template:`<div>
    <input v-model="search_for" placeholder="Enter your search query" />
    <button @click="submitSearch">Submit</button>
    </div>`,
    //  v-if="state.loggedIn"
    // props:{
    //     search_for:{
        //         type:String,
        //     }
        // },
        data(){
            return{
                search_for:''
            }
        },
        computed: {
            state(){
                return this.$store.state
            },
        },
        methods:{
            submitSearch(){
                this.$router.push({ name: 'search_func', params: { keywords: this.search_for } });            
            }
        }
}

export default search_bar
// {/* <input class="form-control me-2" type="text" placeholder="Search" v-model="search_for" /> */}
            // <form class="d-flex" role="search" action="/api/search">
            // <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" name="search_for">
            // <button class="btn btn-outline-success" type="submit">Search</button>
            // </form>