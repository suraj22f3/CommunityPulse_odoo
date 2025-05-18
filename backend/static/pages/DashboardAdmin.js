const DashboardAdmin = {
    template: `
    <div>
      <h1>This is Admin Dashboard</h1>
      <h3>Total Users: {{ allusers.length }}</h3>
      <h3>Total Sections: {{ allsections.length }}</h3>
      <h3>Total Books: {{ allbooks.length }}</h3>
      <h3>Pending Requests:</h3>
      <div v-for="req in pending_reqs">
        <div class="justify">
          <span> Book: {{req.book_name}} </span> |
          <span> User: {{req.user_email}} </span> |
          <span> 
          <button class="btn btn-success" @click="accept(req.book_id,req.user_id)"> Accept </button>
          </span>
          <span>
          <button class="btn btn-danger" @click="deny(req.book_id,req.user_id)"> Deny </button> 
          </span> 
        </div>
      </div>
      <h3>Accepted Requests:</h3>
      <div v-for="bk in all_isued_books">
        <div v-if="bk.status==='Accepted'">
          <div class="justify">
            <span> Book: {{bk.book}} </span> |
            <span> User: {{bk.user}} </span> |
            <span>
            <button class="btn btn-danger" @click="revoke(bk.book_id,bk.user_id)"> Revoke </button>
            </span> 
          </div>
        </div>
      </div>
      <h2>Past Requests:</h2>
      <div v-for="bk in all_isued_books">
        <div v-if="bk.status!=='Accepted' && bk.status!=='Pending'">
          <div class="justify">
            <span> Book: {{bk.book}} </span> |
            <span> User: {{bk.user}} </span> |
            <span> Status: {{bk.status}}</span> 
          </div>
        </div>
      </div>
      <h3>Users:</h3>
      <div v-for="user in allusers">
        <span> User: {{user.email}} </span> |
        <span> Last Active on: {{user.visited_on}} </span>
      </div>
      <button @click='downloadfile'>Download File</button>
      <span v-if="isWaiting"> Waiting... </span>
    </div>`,
    data(){
      return{
        pending_reqs:[],
        all_isued_books:[],
        allusers:[],
        isWaiting:false,
        allsections:[],
        allbooks:[]
      }
    },
    methods:{
      async accept(bid,uid){
        const res1 = await fetch(window.location.origin+'/accept_request/'+bid+'/'+uid,{
          headers:{
              'Authentication-Token' : sessionStorage.getItem('token'),
          }
        });
        if(res1.ok){
          alert("Accepted Successfully");
          this.$router.push("/")
        }
      },
      async deny(bid,uid){
        const res2 = await fetch(window.location.origin+'/deny_request/'+bid+'/'+uid,{
          headers:{
              'Authentication-Token' : sessionStorage.getItem('token'),          
            }
        });
        if(res2.ok){
          alert("Denied Successfully");
          this.$router.push("/")
        }
      },
      async revoke(bid,uid){
        const rev = await fetch(window.location.origin+'/revokebook/'+bid+'/'+uid,{
          headers:{
              'Authentication-Token' : sessionStorage.getItem('token'),          
            }
        });
        if(rev.ok){
          alert("Revoked Successfully");
          this.$router.push("/")
        }
      },
      async downloadfile(){
        this.isWaiting=true
        const resx=await fetch('/download_csv')
        const datax=await resx.json()
        if(resx.ok){
          const taskid= datax['task-id']
          const intv =setInterval(async ()=>{
            const csv_res=await fetch(`/get_csv/${taskid}`)
            if(csv_res.ok){
              this.isWaiting=false
              clearInterval(intv)
              window.location.href=`/get_csv/${taskid}`
            }
          },1000)
        }
      }
    },
    async mounted(){
      // const res3 = await fetch(window.location.origin+'/books',{
      //   headers: {
      //     AuthenticationToken: sessionStorage.getItem("token"),
      //   }
      // })
      // if(res3.ok){
      //   this.books = await res3.json();
      // }
      // const res4 = await fetch(window.location.origin+'/all_users',{
      //   headers: {
      //     AuthenticationToken: sessionStorage.getItem("token"),
      //   }
      // })
      // if(res4.ok){
      //   this.users = await res3.json();
      // }
      const res5 = await fetch(window.location.origin+'/api/pendingreqs',{
        headers: {
          'Authentication-Token' : sessionStorage.getItem('token'),
        }
      })
      if(res5.ok){
        this.pending_reqs=await res5.json();
      }
      const aib = await fetch(window.location.origin+'/api/allissuedbooks',{
        headers: {
          'Authentication-Token' : sessionStorage.getItem('token'),
        }
      })
      if(aib.ok){
        this.all_isued_books=await aib.json();
      }
      const res6=await fetch(window.location.origin+'/api/all_users',{
        headers:{
          'Authentication-Token' : sessionStorage.getItem('token'),
        }
      })
      if(res6.ok){
        this.allusers=await res6.json();
      }
      const allsec=await fetch(window.location.origin+'/api/sections',{
        headers:{
          'Authentication-Token' : sessionStorage.getItem('token'),
        }
      })
      if (allsec.ok){
        this.allsections= await allsec.json();
      }
      const allbk=await fetch(window.location.origin+'/api/books',{
        headers:{
          'Authentication-Token' : sessionStorage.getItem('token'),
        }
      })
      if (allbk.ok){
        this.allbooks= await allbk.json();
      }
    }
  };
  
  export default DashboardAdmin;