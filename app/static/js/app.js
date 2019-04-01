/* Add your Application JavaScript */

Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/upload">Upload <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const upload_form = Vue.component('upload_form', {
    template: `
        <div id="main">
            <h2 id="heading">Upload Form</h2>
            <p class = "alert-success" v-if="success">{{message}}</p>
            <form @submit.prevent="uploadPhoto" method="POST" id = "uploadForm">
                <label for="description" class="form-group">Description</label><br>
                <textarea form="uploadForm" name="description" class="form-group" id="description"></textarea><br>
                <label for="photo" class="form-group">Photo Upload</label><br>
                <input type="file" name="photo" class="form-group"/><br>
                <button type="submit" name="submit" class="btn btn-primary">Upload file</button>
            </form>

            <ul class = "alert-danger" v-if="errors">
                <li  v-for="err in messages">
                    {{ err }}
                </li> 
            </ul> 
        </div>
    `,

    methods:{
        uploadPhoto: function(){
            
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);

            fetch("/api/upload", {
                method: 'POST',
                body: form_data,

                headers: {
                    'X-CSRFToken': token
                    },
                    credentials: 'same-origin'
               })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                
               // display a success message
                console.log(jsonResponse);
                let store = jsonResponse['data'];

                if ('errors' in store){
                    this.errors = true;
                    this.messages = store['errors'];
                }else{
                    this.success = true;
                    this.message = store; 
                }

                })
                .catch(function (error) {
                console.log(error);
                });
        }.bind(this)
    },

    data: function() {
        return {
            message: "",
            messages: [],
            success: false,
            errors: false
        }
     }.bind(this)

});

const Home = Vue.component('home', {
   template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
   `,
    data: function() {
       return {}
    }
});

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", component: Home},
        // Put other routes here
        {path: "/upload", component: upload_form},
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});