const search_results={
    template:`
    <div>
    Search Results here:
    <div v-for="x in outp[0]">
        <div v-if="x.book_name">
            Book: {{x.book_name}} by {{x.author}}
        </div>
    <div v-for="x in outp[1]">
        <div v-if="x.section_name">
            Section: {{x.section_name}}
        </div>
    </div>
    </div>
    </div>
    `,
    data(){
        return{
            outp:[],
        }
    },
    async mounted(){
        const ser=await fetch(window.location.origin+'/api/search/'+this.$route.params.keywords,{
            headers:{
                AuthenticationToken:sessionStorage.getItem('token'),
            }
        })
        if(ser.ok){
            const results=await ser.json();
            this.outp=results;
        }
    }
}

export default search_results