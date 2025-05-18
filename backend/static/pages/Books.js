import BookCard from "../components/BookCard.js";
import search_bar from "../components/searchbar.js";

const BooksPage = {
    template : `
    <div>
        <h1> Books </h1>
        <div v-for="bk in accessible_books" v-if="book.id===bk.id">
            <BookCard :name="bk.book_name" :content="bk.book_content" :author="bk.book_author" :id="bk.book_id" :rating="bk.rating"/>
        </div>
        <div v-for="bk2 in req_books">
            <BookCard :name="bk2.book_name" :content="bk2.book_content" :author="bk2.book_author" :id="bk2.book_id" :approvalRequired=true :curr_status="bk2.status" :rating="bk2.rating"/>
        </div>
        <div v-for="bk1 in other_books">
            <BookCard :name="bk1.name" :content="bk1.content" :author="bk1.author" :id="bk1.id" :approvalRequired=true :rating="bk1.rating"/>
        </div>
        <div v-if="fil_other_books">
        Searched for:
        <div v-for="bk1 in fil_other_books">
            <BookCard :name="bk1.name" :content="bk1.content" :author="bk1.author" :id="bk1.id" :approvalRequired=true :rating="bk1.rating" />
        </div>
        </div>
    </div>`,  
    components: { BookCard,search_bar },
    props:{
        search_for:{
            type:String
        }
    },
    data() {
        return {
            allBooks: [],
            accessible_books: [],
            other_books:[],
            req_books:[],
            uid: sessionStorage.getItem('id'),
        };
        },
        async mounted() {
            const allbk = await fetch(window.location.origin + "/api/books",{
                headers:{
                    'Authentication-Token' : sessionStorage.getItem('token'),
                },
            });
            if (allbk.ok){
                const data = await allbk.json();
                console.log(data)
                this.allBooks = data;
            }
            const res = await fetch(window.location.origin + "/api/accessible_books/"+this.uid,{
                headers:{
                    'Authentication-Token' : sessionStorage.getItem('token'),
                },
            });
            if(res.ok){
                const data1 = await res.json();
                console.log(data1)
                this.accessible_books = data1;
            }
            
            const res2 = await fetch(window.location.origin + "/api/access_required_books/"+this.uid,{
                headers:{
                    'Authentication-Token' : sessionStorage.getItem('token'),
                },
            });
            if(res2.ok){
                const data2 = await res2.json();
                console.log(this.uid)
                console.log(data2)
                this.other_books = data2;
            }
            const res3 = await fetch(window.location.origin + '/api/pendingreqs',{
                headers:{
                    'Authentication-Token' : sessionStorage.getItem('token'),
                },
            });
            if(res3.ok){
                const data3 = await res3.json();
                // console.log(this.uid)
                this.req_books = data3;
            }
        },
    computed:{
        fil_other_books:function(){
            if (this.search_for==='') {                
                return this.other_books.filter((bk1)=>{
                    return bk1.name.match(this.search_for)
                });
            }
        },
        // fil_other_books(){
        //     return this.other_books.filter(bk1=>bk1.body.toLowerCase().includes(this.search_for.toLowerCase()))
        // }
    }
    };
    
    export default BooksPage;
    // <div v-for="book in allBooks">
    // <BookCard :name="book.name" :content="book.content" :id="book.id" />