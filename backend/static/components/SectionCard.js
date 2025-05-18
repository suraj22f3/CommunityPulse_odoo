import route from "../utils/router.js";
import BookCard from "./BookCard.js";

const SectionCard = {
    template : `
    <div>
      <div class="card shadow-sm p-4 mb-4 section-card" @click="openPopup">
        <div class="card-body">
          <h3 class="card-title text-center mb-3 text-primary text-truncate">{{ name }}</h3>
          <p class="card-text text-secondary text-truncate">{{ description }}</p>
          <div>Rate:
          <span class="star" 
            v-for="starIndex in totalStars" :key="starIndex" 
            @click="handleStarClick(starIndex,id)">⭐</span>
        </div>
        </div>
      </div>
      <div v-if="showPopup" class=" popup-overlay d-flex align-items-center justify-content-center">
        <div class="popup-content card shadow p-4">
          <h3 class="card-title text-center mb-3 text-primary">{{ name }}</h3>
          <p class="card-text text-secondary">{{ description }}</p>
          <!-- <div class="text-muted text-end mt-3">
            <small>Created by: {{ creator }}</small>
          </div> -->
          <div v-for="book in selBooks">
          <div v-for="bk in other_books">
              <div v-if="bk.id === book.id">
                <BookCard :name="book.name" :content="book.content" :approvalRequired=true :id="book.id" :author="book.author" :rating="bk.rating" />
                <button v-show="approvalRequired && role !== 'admin' " class="btn btn-success mt-3" @click="sendApproval(book.id)">Request</button>
              </div>
            </div>
            <div v-for="bk in req_books">
              <div v-if="bk.book_id === book.id">
                <BookCard :name="book.name" :content="book.content" :approvalRequired=true :author="book.author" :rating="book.rating" :curr_status="bk.status"/>
                <button v-show="approvalRequired && role !== 'admin' " class="btn btn-warning mt-3" @click="">Request in progress</button>
              </div>
            </div>
            <div v-for="bk in accessible_books">
              <div v-if="bk.book_id === book.id">
                <BookCard :name="book.name" :content="book.content" :approvalRequired=false :author="book.author" :rating="book.rating" :curr_status="bk.status"/>
                
              </div>
            </div>
          </div>
          <router-link :to="{path: '/updatesection/' + id }">
            <button class="btn btn-primary mt-3" v-if=" role === 'admin'">
              Update Section
            </button>
          </router-link>
          <button class="btn btn-danger mt-3" v-if=" role === 'admin'" @click="DelSec(id)">
              Delete Section
            </button>
          <button class="btn btn-secondary  mt-3" @click="closePopup">Close</button>
          <!-- <button class="btn btn-primary mt-3" v-if=" role === 'admin'">Add Book to this Section</button> -->
          <!-- <router-link :to="{ path: '/user/' + userId }">User Details</router-link>-->
          <router-link :to="{path: '/addnewbooks/' + id }">
            <button class="btn btn-primary mt-3" v-if=" role === 'admin'">
              Add Book
            </button>
          </router-link>
        </div>
      </div>
    </div>`,
    props : {
        name :{
            type : String,
            required : true,
        },
        description :{
            type : String,
            required : true,
        },
        id:{
          type: Number,
        },
        approvalRequired:{
          type: Boolean,
        },
        avg_rating:{
          type:Number,
        }
        
    },
    data() {
        return {
            showPopup : false,
            allBooks: [],
            selBooks:[],
            accessible_books: [],
            other_books:[],
            req_books:[],
            uid: sessionStorage.getItem('id'),
            role: sessionStorage.getItem('role'),
            totalStars: 5,
            clicks: 0,
            timer: null,
        };
    },
    components:{BookCard},
    methods : {
        openPopup(){
            this.showPopup = true;
        },
        closePopup(){
            this.showPopup = false;
        },
        async DelSec(id){
          if(window.confirm('Are you sure to delete this section?')){
            const delsection=await fetch(window.location.origin+'/api/sections/'+id,{
              method:"DELETE",
              headers:{
                'Authentication-Token' : sessionStorage.getItem('token'),
              }
            })
            if(delsection.ok){
              alert('Deleted')
              route.push('/')
            }
          }
        },
        async sendApproval(id) {
          // send fetch request to approval backend
          const res = await fetch(window.location.origin+'/request_book/'+id,{
            headers:{
              AuthenticationToken: sessionStorage.getItem("token"),
            }
          });
          if(res.ok){
            alert('Request Sent')
          }
          console.log("sending Approval");
        },
        async handleStarClick(starIndex,sid) {
          this.clicks++;
          if (this.clicks === 1) {
            this.timer = setTimeout(() => {
              console.log('Single click on star', starIndex);
              this.clicks = 0;
            }, 300); // Adjust the delay as needed
          } else {
            clearTimeout(this.timer);
            const rated=await fetch(window.location.origin+'/api/ratings/section/'+sid,{
              method:"POST",
              headers:{
                'Authentication-Token':sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
              },
              body:JSON.stringify({
                'section_id':sid,
                'rating':starIndex,
              })
            })
            if(rated.ok){
              const rep= await rated.json();
              console.log(rep);
              // console.log('Double click on star', starIndex);
            }else{

              const rated2=await fetch(window.location.origin+'/api/ratings/section/'+sid,{
                method:"PUT",
                headers:{
                  'Authentication-Token':sessionStorage.getItem('token'),
                  'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                  'section_id':sid,
                  'rating':starIndex,
                })
              })
              if(rated2.ok){
                const rep2= await rated.json();
                console.log(rep2);
                // console.log('Double click on star', starIndex);
              this.clicks = 0;
            }
          }
        }
      }
    },
    mounted() {
        const style = document.createElement("style");
        style.textContent = `
          .section-card {
            max-width: 600px;
            margin: auto;
            border-radius: 15px;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          }
          .section-card:hover {
            transform: scale(1.02);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          }
          #1{ color: blue;
          }
        `;
        document.head.appendChild(style);
      },    
      async mounted() {
        const res = await fetch(window.location.origin + "/api/books",{
            headers:{
                'Authentication-Token' : sessionStorage.getItem('token'),
            },
        });
        const data = await res.json();
        
        this.allBooks = data;
        const res2 = await fetch(window.location.origin + "/api/bookinsec/"+ this.id ,{
          headers:{
              'Authentication-Token' : sessionStorage.getItem('token'),
          },
      });
      const seldata = await res2.json();
      
      this.selBooks = seldata;
      const res3 = await fetch(window.location.origin + "/api/accessible_books/"+this.uid,{
        headers:{
            'Authentication-Token' : sessionStorage.getItem('token'),
        },
    });
    if(res3.ok){
    const data = await res3.json();
    
    this.accessible_books = data;
    }
    
    const res4 = await fetch(window.location.origin + "/api/access_required_books/"+this.uid,{
        headers:{
            'Authentication-Token' : sessionStorage.getItem('token'),
        },
    });
    if(res4.ok){
      const data21 = await res4.json();
      // console.log(JSON.stringify(data21))
      this.other_books = data21;
    }
    const res5 = await fetch(window.location.origin + '/api/pendingreqs',{
        headers:{
            'Authentication-Token' : sessionStorage.getItem('token'),
        },
    });
    if(res5.ok){
      const data3 = await res5.json();
      console.log(JSON.stringify(data3))
      this.req_books = data3;
    }
    },
};

export default SectionCard;