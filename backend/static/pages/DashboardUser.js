import SectionCard from "../components/SectionCard.js";
import BookCard from "../components/BookCard.js";

const DashboardUser = {
    template : `<div>
    <h1> User Dashboard </h1>
    <h2>Accessible Books</h2>
    <div v-for="bk in accessible_books">
      <BookCard :name="bk.book_name" :content="bk.book_content" :author="bk.book_author" :id="bk.book_id" />
      <button class="btn btn-danger" @click="returnb(bk.book_id,bk.user_id)"> Return </button>
    </div>
    <!-- <h2>Other Books</h2>
    <div v-for="bk1 in other_books">
      <BookCard :name="bk1.name" :content="bk1.content" :author="bk1.author" :id="bk1.id" :approvalRequired=true />
    </div> -->
    <h2>Requested Books</h2>
    <div v-for="bk2 in req_books">
      <BookCard :name="bk2.book_name" :content="bk2.book_content" :author="bk2.book_author" :id="bk2.book_id" :approvalRequired=true :curr_status="bk2.status"/>
    </div>

    </div>`,  
    components: { BookCard },
    data() {
        return {
            accessible_books: [],
            other_books:[],
            req_books:[],
            uid: sessionStorage.getItem('id')
        };
    },
    methods:{
      async returnb(bid,uid){
        if(window.confirm('Are you sure to return this book?')){

          const rev = await fetch(window.location.origin+'/returnbook/'+bid+'/'+uid,{
            headers:{
                'Authentication-Token' : sessionStorage.getItem('token'),          
              }
          });
          if(rev.ok){
            alert("Returned Successfully");
            this.$router.push("/")
          }
        }
      },
    },
    async mounted() {
        const res = await fetch(window.location.origin + "/api/accessible_books/"+this.uid,{
            headers:{
                'Authentication-Token' : sessionStorage.getItem('token'),
            },
        });
        if(res.ok){
        const data = await res.json();
        
        this.accessible_books = data;
        }
        
        const res2 = await fetch(window.location.origin + "/api/access_required_books/"+this.uid,{
            headers:{
                'Authentication-Token' : sessionStorage.getItem('token'),
            },
        });
        if(res2.ok){
          const data2 = await res2.json();
          console.log(this.uid)
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
  };
  
export default DashboardUser;

  // import StudyResource from '../components/StudyResource.js'


// const DashBoardStud = {
//     template : `<div>
//       <h1> Student Dashboard </h1>
//       <div v-for="resource in allResource">
//           <StudyResource :topic="resource.topic" :content="resource.content" creator="me" />
//       </div>
//       </div>`,
//       components: { StudyResource },
//     data() {
//         return {
//             allResource: [],
//         };
//     },
//     async mounted() {
//         const res = await fetch(window.location.origin + "/api/resources",{
//             headers:{
//                 'Authentication-Token' : sessionStorage.getItem('token'),
//             },
//         });
//         const data = await res.json();
        
//         this.allResource = data;
//     },
// };

// export default DashBoardStud;