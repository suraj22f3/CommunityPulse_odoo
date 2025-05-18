import router from "../utils/router.js";

const AddSection={
    template:`
    <div>
    
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4">
        <h3 class="card-title text-center mb-4">Add Section</h3>
        <div class="form-group mb-3">
          <input v-model="sname" type="text" class="form-control" placeholder="Name" required/>
        </div>
        <div class="form-group mb-4">
          <input v-model="description" type="text" class="form-control" placeholder="Description" required/>
        </div>
        <button class="btn btn-primary w-100" @click="AddSec">Add Section</button>
      </div>
    </div>

    </div>
    `,
    data(){
        return{
            sname:"",
            description:""
        };
    },
    methods:{
        async AddSec(){
            const url= window.location.origin+'/api/sections';
            const res= await fetch(url,{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    'Authentication-Token' : sessionStorage.getItem('token'),
                },
                body:JSON.stringify({
                    name: this.sname,
                    description:this.description
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

export default AddSection