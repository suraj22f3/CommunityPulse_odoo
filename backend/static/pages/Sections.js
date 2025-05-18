import SectionCard from "../components/SectionCard.js";

const SectionsPage = {
    template : `<div>
    <h1> Sections </h1>
    <div v-for="sec in allSections" :id="sec.id">
      <SectionCard :name="sec.name" :description="sec.description" :id="sec.id"/>
    </div>
    <router-link to="/addnewsections">
    <button class="btn btn-primary mt-3" v-if=" role === 'admin'">
    Add Section
    </button>
    </router-link>
    </div>`,  
    components: { SectionCard },
    data() {
        return {
            allSections: [],
            role:sessionStorage.getItem('role'),
        };
    },
    async mounted() {
        const res = await fetch(window.location.origin + "/api/sections",{
            headers:{
                'Authentication-Token' : sessionStorage.getItem('token'),
            },
        });
        // const data = await res.json();
        // this.allSections = data;
        try{
            const data = await res.json();
            this.allSections = data;
        }catch(e){
            console.log("error in converting to json");
        }
    },
  };
  
export default SectionsPage;