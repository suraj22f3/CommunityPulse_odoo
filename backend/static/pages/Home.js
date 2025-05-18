import search_bar from "../components/searchbar.js";

const Home ={
    template : `<h1>Home{{search_for}}</h1>`,
    data(){
        return{
            search_for:''
        }
    }
}

export default Home;