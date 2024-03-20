<template>
    <div v-if="showOverlay" class="overlay" @click="handleCloseModal"></div>
    <div class="modal">
        <div class="header">
            <h2>Create a new post</h2>
            <button class="close-btn" @click="handleCloseModal">x</button>
        </div>
        <div class="form-group">
            <label for="newPostTitle">Title:</label>
            <input id="newPostTitle" v-model="newPostTitle" placeholder="Enter the title">
        </div>
        <div class="form-group">
            <label for="newPostContent">Content:</label>
            <textarea id="newPostContent" v-model="newPostContent" placeholder="Write your post..."></textarea>
        </div>
        <button @click="createPost">Publish</button>
    </div>
</template>
<script>
export default {
    name: "AddPostModal",
    props:{
        /**
         * Function to handle closing the modal.
         *
         * @type {Function}
         * @required
         */
        handleCloseModal: {
            type: Function,
            required: true
        },
        /**
         * Function to get all posts after creating a new post.
         *
         * @type {Function}
         * @required
         */
         getAllMyPosts:{
            type: Function,
            required: true
        }
    },
    data() {
        return {
            newPostContent: "",
            newPostTitle: "",
            showOverlay: false,
            BACKEND_URL: import.meta.env.VITE_BACKEND_URL
        }
    },
    mounted(){
        this.showOverlay = true;
    },
    methods:{
        /**
        * Creates a new post.
        *
        * @method
        * @name createPost
        * @memberof AddPostModal
        */
        createPost() {
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                title: this.newPostTitle,
                content: this.newPostContent,
                author: this.author
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow',
            };
            fetch(this.BACKEND_URL + "/post", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('result create post: ', result);
                    this.newPostTitle = "";
                    this.newPostContent = "";
                    this.handleCloseModal();
                    window.location.reload();
                })
                .catch(error => console.log('error', error));
        },
    
    }
}

</script>
<style scoped>
.modal {
    padding: 2rem;
    width: 50%;
    position: absolute;
    top: 25%;
    left: 25%;
    background-color: white;
    border-radius: .25rem;
    border: 1px solid #112854;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}
.header{
    display: flex;
    justify-content: space-between;
}
.close-btn{
    background-color: transparent;
    color: #000;
    padding: .50rem;
    font-size: 24px;
}
.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
}

input,
textarea {
    width: 75%;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 3px;
}

button {
    background-color: #53687e;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
}
</style>