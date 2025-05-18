import route from '../utils/router.js'

const BookCard = {
    template : `<div>
      <div class="card shadow-sm p-4 mb-4 book-card" @click="openPopup">
        <div class="card-body">
          <h3 class="card-title text-center mb-3 text-primary text-truncate">{{ name }}</h3>
          <!-- <p class="card-text text-secondary text-truncate">{{ content }}</p> -->
        </div>
        <div class="card-footer text-muted text-end">
          <small>Created by: {{ author }} </small>
        </div>
        <!--<div class="card-footer text-muted text-end ">
          <small>Avg Rating: {{ rating }} </small>
        </div> -->
        <div>Rate:
          <span class="star" 
            v-for="starIndex in totalStars" :key="starIndex" 
            @click="handleStarClick(starIndex,id)">⭐</span>
        </div>
      </div>
      <div v-if="showPopup" class=" popup-overlay d-flex align-items-center justify-content-center">
      <div class="popup-content card shadow p-4">
        <h3 class="card-title text-center mb-3 text-primary">{{ name }}</h3>
        <p v-show="!approvalRequired || role === 'admin' " class="card-text text-secondary">{{ content }}</p>
        <div v-show="approvalRequired && role !== 'admin' " class="text-muted text-end mt-3">
        <small>
          <b>
            {{ curr_status!=='Pending'? ' Request to view the content':'Waiting for Approval' }}
          </b>
        </small>
        </div>
        <div class="text-muted text-end mt-3">
          <small>Created by: {{ author }}</small>
        </div>
        <button v-show="approvalRequired && role !== 'admin' " 
          :class=" curr_status === 'Pending'?'btn btn-danger': 'btn btn-success'" 
          
          v-on="{ click: curr_status !== 'Pending' ? sendApproval : cancelRequest }">
            {{ curr_status!=='Pending'? 'Request':'Cancel' }}
        </button>
        <router-link :to="{path: '/updatebook/' + id }">
            <button class="btn btn-primary mt-3" v-if=" role === 'admin'">
              Update Book
            </button>
          </router-link>
        <button class="btn btn-danger mt-3" v-if=" role === 'admin'" @click="DelBk(id)">
            Delete Book
        </button>
        <button class="btn btn-secondary  mt-3" @click="closePopup">Close</button>
      </div>
    </div>
    </div>`,
    props : {
        name :{
            type : String,
            required : true,
        },
        content :{
            type : String,
            required : true,
        },
        author :{
            type : String,
        },
        id:{
          type: Number,
        },
        approvalRequired:{
          type:Boolean,
        },
        curr_status:{
          type:String,
        },
        rating:{
          type:String,
          // required:true
        }
    },
    data() {
        return {
            showPopup : false,
            uid: sessionStorage.getItem('id'),
            role:sessionStorage.getItem('role'),
            totalStars: 5,
            clicks: 0,
            timer: null,
        };
    },
    methods : {
        openPopup(){
            this.showPopup = true;
        },
        closePopup(){
            this.showPopup = false;
        },
        // async sendApproval() {
        //   // send fetch request to approval backend
        //   console.log("sending Approval");
        // },
        async DelBk(id){
          if(window.confirm('Are you sure to delete this book?')){
            const delbook=await fetch(window.location.origin+'/api/books/'+id,{
              method:"DELETE",
              headers:{
                'Authentication-Token' : sessionStorage.getItem('token'),
              }
            })
            if(delbook.ok){
              alert('Deleted')
              route.push('/')
            }
          }
        },
        async sendApproval(){
          // send fetch request to approval backend
          const res = await fetch(window.location.origin+'/api/request_book/'+this.id,{
            headers:{
              'Authentication-Token' : sessionStorage.getItem('token'),
            }
          });
          if(res.ok){
            alert('Request Sent')
            route.push('/')
          }
          console.log("sending Approval");
        },
        async cancelRequest(){
          if(window.confirm('Are you sure to cancel the request?')){
          const canreq=await fetch(window.location.origin+'/cancel_request/'+this.id+'/'+this.uid,{
            headers:{
              'Authentication-Token':sessionStorage.getItem('token')
            }
          })
        }
        },
        async handleStarClick(starIndex,bid) {
          this.clicks++;
          if (this.clicks === 1) {
            this.timer = setTimeout(() => {
              console.log('Single click on star', starIndex);
              this.clicks = 0;
            }, 300); // Adjust the delay as needed
          } else {
            clearTimeout(this.timer);
            const rated=await fetch(window.location.origin+'/api/ratings/book/'+bid,{
              method:"POST",
              headers:{
                'Authentication-Token':sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
              },
              body:JSON.stringify({
                'book_id':bid,
                'rating':starIndex,
              })
            })
            if(rated.ok){
              const rep= await rated.json();
              console.log(rep);
              // console.log('Double click on star', starIndex);
            }else{

              const rated2=await fetch(window.location.origin+'/api/ratings/book/'+bid,{
                method:"PUT",
                headers:{
                  'Authentication-Token':sessionStorage.getItem('token'),
                  'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                  'book_id':bid,
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
      },
    },
    mounted() {
        const style = document.createElement("style");
        style.textContent = `
          .book-card {
            max-width: 600px;
            margin: auto;
            border-radius: 15px;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          }
          .book-card:hover {
            transform: scale(1.02);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          }
        `;
        document.head.appendChild(style);
      },    
};

export default BookCard;

// @click=" curr_status === 'Pending'? '' : 'sendApproval'"
// v-on="curr_status!=='Pending'?{click:sendApproval}:{cancelRequest}"