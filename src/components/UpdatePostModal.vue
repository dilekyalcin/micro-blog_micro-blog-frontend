<template>
    <div class="modal">
        <div class="header">
            <h2>Update post</h2>
            <button class="close-btn" @click="handleUpdateCloseModal">x</button>
        </div>
        <div class="form-group">
            <label for="newPostTitle">Title:</label>
            <input id="newPostTitle" v-model="updatedTitle" placeholder="Enter the title">
        </div>
        <div class="form-group">
            <label for="newPostContent">Content:</label>
            <textarea id="newPostContent" v-model="updatedContent" placeholder="Write your post..."></textarea>
        </div>
        <button @click="updatePost">Update</button>
    </div>
</template>
<script>
export default {
    name: "UpdatePostModal",
    /**
     * Properties that the component accepts.
     *
     * @property {Object} post - The post object to be updated.
     * @property {Function} handleUpdateCloseModal - Function to handle closing the update modal.
     * @property {Function} getAllMyPosts - Function to get all posts after an update.
     */
    props: {
        post: {
            type: Object,
            required: true
        },
        handleUpdateCloseModal: {
            type: Function,
            required: true
        },
        getAllMyPosts: {
            type: Function,
            required: true
        }
    },
    /**
     * Data properties of the component.
     *
     * @property {number} postId - The ID of the post.
     * @property {string} updatedTitle - The updated title of the post.
     * @property {string} updatedContent - The updated content of the post.
     */
    data() {
        return {
            postId: this.post.id,
            updatedTitle: this.post.title,
            updatedContent: this.post.content,
        }
    },
    methods: {
        /**
        * Method to update the post.
        *
        * @method
        * @name updatePost
        * @memberof UpdatePostModal
        * @instance
        */
        updatePost() {
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                title: this.updatedTitle,
                content: this.updatedContent
            })
            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(`http://localhost:5000/post/update_post/${this.postId}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('result update: ', result);
                    this.getAllMyPosts();
                    this.handleUpdateCloseModal();
                })
                .catch(error => console.log('error', error));
        }
    }
}
</script>
<style>
.modal {
    padding: 2rem;
    width: 50%;
    position: absolute;
    top: 25%;
    left: 25%;
    background-color: #f9f9f9;
    border-radius: .25rem;
    border: 1px solid #112854;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.header {
    display: flex;
    justify-content: space-between;
}

.close-btn {
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
    background-color: #248E87;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}
</style>