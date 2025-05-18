import router from "../utils/router.js";

const UpdateBook={
    template:`
    <div>
    
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4">
        <h3 class="card-title text-center mb-4">Update Book</h3>
        <div class="form-group mb-3">
          <input v-model="sname" type="text" class="form-control" placeholder="Name" required/>
        </div>
        <div class="form-group mb-3">
          <input v-model="author" type="text" class="form-control" placeholder="Author" required/>
        </div>
        <div class="form-group mb-4">
          <input v-model="description" type="text" class="form-control" placeholder="Description" required/>
        </div>
        <div class="form-group mb-4">
          <input v-model="section_id" type="text" class="form-control" placeholder="Section ID" required/>
        </div>
        <button class="btn btn-primary w-100" @click="AddSec">Update Book</button>
      </div>
    </div>

    </div>
    `,
    data(){
        return{
            sname:"",
            description:"",
            section_id:"",
            author:"",
            allsec:[]
        };
    },
    async mounted(){
        const id= this.$route.params.id
        const res=await fetch(window.location.origin+'/bookdet/'+id,{
            headers:{
                'Authentication-Token' : sessionStorage.getItem('token'),
            },
        })
        const data = await res.json();
        console.log(data[0].name)
        this.allsec=data;
        this.sname=data[0].name;
        this.description=data[0].content;
        this.section_id=data[0].section_id;
        this.author=data[0].author;
    },
    methods:{
        async AddSec(){
            const id= this.$route.params.id
            const url= window.location.origin+'/api/books/'+id;
            const res= await fetch(url,{
                method:"PUT",
                headers:{
                    "Content-Type": "application/json",
                    'Authentication-Token' : sessionStorage.getItem('token'),
                },
                body:JSON.stringify({
                    name: this.sname,
                    content:this.description,
                    section_id:this.section_id,
                    author:this.author
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

export default UpdateBook