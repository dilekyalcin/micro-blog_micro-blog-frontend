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
        <div class="form-group">
            <label>Tag:</label><br>
            <div style="display: flex;flex-direction: row;justify-content: flex-end;">
                <input style="width:10%" type="radio" id="existingTag" value="existingTag" v-model="selectedTagType">
                <label for="existingTag">Existing Tag</label><br>
                <input style="width:10%" type="radio" id="newTag" value="newTag" v-model="selectedTagType">
                <label for="newTag">New Tag</label><br>
            </div>
            <div v-if="selectedTagType === 'existingTag'">
                <select v-model="selectedExistingTag" style="width: 50%;height: 2rem;padding:.5rem;border-radius: .2rem;">
                    <option v-for="tag in existingTags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
                </select>
            </div>
            <div v-else-if="selectedTagType === 'newTag'">
                <input type="text" v-model="newTagName" placeholder="Enter new tag name" style="width: 50%;height:2rem;padding:.5rem;border-radius: .2rem;margin-right: .5rem;" />
                <button @click="createNewTag">Create Tag</button>
            </div>
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
            BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
            existingTags: null,
            selectedTagType: 'existingTag',
            selectedExistingTag: null,
            newTagName: ''
        }
    },
    mounted(){
        this.showOverlay = true;
        this.getTags();
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
                author: this.author,
                tag_id: this.selectedExistingTag
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

        getTags(){
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
            };
            fetch(this.BACKEND_URL + "/tag/managed-tags", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    this.existingTags = result;
                })
                .catch(error => console.log('error', error));
        },

        createNewTag(){
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "tag_name": this.newTagName
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow',
            };
            fetch(this.BACKEND_URL + "/tag/managed-tags", requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.newTagName = "";
                    this.getTags();
                })
                .catch(error => console.log('error', error));
        }
    
    }
}

</script>
<style scoped>
.modal {
    padding: 2rem;
    width: 50%;
    position: absolute;
    top: 10%;
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