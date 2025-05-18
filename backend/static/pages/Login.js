import router from "../utils/router.js";
import store from "../utils/store.js";

const Login ={
    template : `
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4 border rounded-3 ">
        <h3 class="card-title text-center mb-4">Login</h3>
        <div class="form-group mb-3">
          <input v-model="email" type="email" class="form-control" placeholder="Email" required/>
        </div>
        <div class="form-group mb-4">
          <input v-model="password" type="password" class="form-control" placeholder="Password" required/>
        </div>
        <button class="btn btn-primary w-100" @click="submitInfo">Submit</button>
      </div>
    </div>
    `,
    data(){
        return{
            email: "",
            password: "",
        };
    },
    methods:{
        async submitInfo(){
            const url = window.location.origin
            const res = await fetch(url+'/user_login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({ email: this.email, password : this.password}),
                credentials: "same-origin",
            });
            if (res.ok){
                store.commit("setLogin")
                const data = await res.json();
                console.log(store.state.loggedIn)
                // console.log(data);
                sessionStorage.setItem("token",data.token);
                sessionStorage.setItem("role",data.role);
                sessionStorage.setItem("email",data.email);
                sessionStorage.setItem("id",data.id);

                console.log(sessionStorage.getItem('role'))

                this.$store.commit('setLogin',true);
                this.$store.commit('setRole',data.role);

                router.push("/profile");
            } else {
                const errordata = await res.json();
                alert(errordata.message);
                console.error("Login Failed:", errordata);
            }
        },
    },
}

export default Login;