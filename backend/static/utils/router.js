import store from "./store.js";

// import Navbar from "../components/Navbar.js";
import Home from "../pages/Home.js";
import Login from "../pages/Login.js"
import Logout from "../pages/Logout.js"
import Signup from "../pages/Signup.js"
import Profile from "../pages/Profile.js";
import DashboardAdmin from "../pages/DashboardAdmin.js";
import DashboardUser from "../pages/DashboardUser.js";
import SectionsPage from "../pages/Sections.js";
import BooksPage from "../pages/Books.js";
import search_results from "../pages/SearchResults.js";
import AddSection from "../pages/AddSections.js";
import AddBook from "../pages/AddBooks.js";
import UpdateSection from "../pages/UpdateSections.js";
import UpdateBook from "../pages/UpdateBooks.js";

Vue.use(VueRouter)

const routes =[
    {path: "/", component: Home},
    {path: "/user_login", component: Login},
    {path: "/logout", component: Logout},
    {path: "/signup", component: Signup},
    {
        path: "/profile", 
        component: Profile,  
        meta:{requiresLogin: true} 
    },
    {
        path: "/admin-dashboard", 
        component: DashboardAdmin, 
        meta: {requiresLogin:true, role:"admin"} 
    },
    {
        path: "/user-dashboard", 
        component: DashboardUser, 
        meta: {requiresLogin:true, role:"user"} },
    {path: "/sections-page", component: SectionsPage },
    {path: "/books-page", component: BooksPage},
    {path:"/api/search/:keywords",name:"search_func",component:search_results},
    {
      path:"/addnewsections",
      name:"addsections",
      component:AddSection,
      meta: {requiresLogin:true, role:"admin"} 
    },
    {
      path:"/addnewbooks/:id",
      name:"addbooks",
      component:AddBook,
      meta: {requiresLogin:true, role:"admin"} 
    },
    {
      path:"/updatesection/:id",
      name:"updatesection",
      component:UpdateSection,
      meta: {requiresLogin:true, role:"admin"} 
    },
    {
      path:"/updatebook/:id",
      name:"updatebook",
      component:UpdateBook,
      meta: {requiresLogin:true, role:"admin"} 
    },
];

const router =new VueRouter({
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresLogin)) {
      if (!store.state.loggedIn) {
        next({ path: "/user_login" });
      } else if (to.meta.role && to.meta.role !== store.state.role) {
        next({ path: "/" });
      } else {
        next();
      }
    } else {
      next();
    }
  });
export default router