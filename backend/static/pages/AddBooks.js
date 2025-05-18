import router from "../utils/router.js";

const AddBook={
    template:`
    <div>
    
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4">
        <h3 class="card-title text-center mb-4">Add Book</h3>
        <div class="form-group mb-3">
          <input v-model="sname" type="text" class="form-control" placeholder="Name" required/>
        </div>
        <div class="form-group mb-3">
          <input v-model="aname" type="text" class="form-control" placeholder="Author" required/>
        </div>
        <div class="form-group mb-4">
          <input v-model="content" type="text" class="form-control" placeholder="Content" required/>
        </div>
        <button class="btn btn-primary w-100" @click="AddBk">Add Book</button>
      </div>
    </div>

    </div>
    `,
    data(){
        return{
            sname:"",
            aname:"",
            content:"",
            section_id: this.$route.params.id
        };
    },
    methods:{
        async AddBk(){
            const url= window.location.origin+'/api/books';
            const res= await fetch(url,{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    'Authentication-Token' : sessionStorage.getItem('token'),
                },
                body:JSON.stringify({
                    name: this.sname,
                    content:this.content,
                    author:this.aname,
                    section_id:this.section_id
                }),
                credentials: "same-origin",
            });
            if (res.ok){
                const data=await res.json();
                console.log(data);
                router.push("/admin-dashboard");
            }else{
                const errorData=await res.json();
                console.error("Adding Failed:",errorData);
            }
        }
    }
};

export default AddBook