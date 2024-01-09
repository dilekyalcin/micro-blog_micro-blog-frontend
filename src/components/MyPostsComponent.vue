<template>
    <div style="height: 100%;">
        <update-post-modal v-if="showUpdateModal" :post="selectedPost" :handleUpdateCloseModal="handleUpdateCloseModal"
            :getAllMyPosts="getAllMyPosts"></update-post-modal>
        <div class="container">
            <div class="modal-div">
                <add-post-modal v-if="showModal" :handleCloseModal="handleCloseModal"
                    :getAllPosts="getAllPosts"></add-post-modal>
                <button class="add-post-btn" @click="handleModal">Add Post</button>
            </div>
            <div class="content">
                <div v-if="isLoggedIn">
                    <div class="card" v-for="item in posts" :key="item.id">
                        <div>
                            <p class="post-info"> Title: {{ item.title }}</p>
                        </div>
                        <div>
                            <p>{{ item.content }}</p>
                        </div>
                        <div class="author-div">
                            <p>{{ item.author }}</p>
                            <button class="detail-btn">Detail</button>
                        </div>
                        <div class="card-footer">
                            <button class="delete-btn" @click="deletePost(item.id)">Delete Post</button>
                            <button class="update-btn" @click="updatePost(item)">Update Post</button>
                        </div>
                        <hr>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AddPostModal from './AddPostModal.vue';
import UpdatePostModal from "./UpdatePostModal.vue"
export default {
    /**
     * MyPosts - Component for displaying the current user's blog posts and managing posts.
     *
     * @name MyPosts
     * @export
     */
    name: "MyPosts",
    components: {
        AddPostModal,
        UpdatePostModal
    },
    /**
    * Initial data for the MyPosts component.
    *
    * @typedef {Object} MyPostsData
    * @property {Array|null} posts - Array of blog posts.
    * @property {string} author - Current user's author name.
    * @property {boolean} isLoggedIn - Indicates whether the user is logged in.
    * @property {boolean} showModal - Flag to show or hide the add post modal.
    * @property {boolean} showUpdateModal - Flag to show or hide the update post modal.
    * @property {Object|null} selectedPost - The selected post to be updated.
    */
    data() {
        return {
            posts: null,
            author: "",
            isLoggedIn: false,
            showModal: false,
            showUpdateModal: false,
            selectedPost: null
        };
    },
    mounted() {
        // When the page loads, check if the user is logged in and fetch all posts
        this.checkLoginStatus();
        this.getAllMyPosts();
    },
    methods: {
        /**
        * Checks user login status.
        *
        * @method
        * @name checkLoginStatus
        * @memberof MyPosts
        */
        checkLoginStatus() {
            var token = sessionStorage.getItem("token");
            this.isLoggedIn = !!token;
        },
        /**
         * Gets all posts of the current user.
         *
         * @method
         * @name getAllMyPosts
         * @memberof MyPosts
         */
        getAllMyPosts() {
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("http://localhost:5000/post/get_currentuser_post", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('result get all posts: ', result);
                    this.posts = result;
                })
                .catch(error => console.log('error', error));

        },
        /**
        * Handles opening the add post modal.
        *
        * @method
        * @name handleModal
        * @memberof MyPosts
        */
        handleModal() {
            this.showModal = true
        },
        /**
        * Handles closing the add post modal.
        *
        * @method
        * @name handleCloseModal
        * @memberof MyPosts
        */
        handleCloseModal() {
            this.showModal = false
        },
        /**
         * Handles closing the update post modal.
         *
         * @method
         * @name handleUpdateCloseModal
         * @memberof MyPosts
         */
        handleUpdateCloseModal() {
            this.showUpdateModal = false
        },
        /**
        * Deletes a post.
        *
        * @method
        * @name deletePost
        * @memberof MyPosts
        * @param {number} postId - The ID of the post to be deleted.
        */
        deletePost(postId) {
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`http://localhost:5000/post/delete_post/${postId}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('result delete: ', result);
                    this.getAllMyPosts();
                })
                .catch(error => console.log('error', error));
        },
        /**
         * Handles updating a post.
         *
         * @method
         * @name updatePost
         * @memberof MyPosts
         * @param {Object} item - The post object to be updated.
         */
        updatePost(item) {
            console.log(item);
            this.selectedPost = item
            this.showUpdateModal = true;
        }
    }
};
</script>

<style scoped>
.container {
    width: 80%;
    margin: 0 auto;
}

.content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.card {
    width: 60%;
    margin: auto;
    margin-bottom: 1rem;
    padding: 1rem;
    font-family: Poppins;
    display: flex;
    flex-direction: column;
}
.card hr {
    height: 1px;
    border: none;
    border-top: 2px solid #F2F2F2; 
    margin: 10px 0;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}
.author-div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: black;
    font-weight: bold;
}

.detail-btn {
    width: 128px;
    height: 40px;
    padding: .50rem;
    font-weight: bold;
    color: white;
    background-color: #248E87;
    border: none;
    font-size: 18px;
    border-radius: .25rem;
}

.detail-btn:hover {
    cursor: pointer;
}

.post-info {
    color: black;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.modal-div {
    display: flex;
    justify-content: flex-end;
}

.add-post-btn {
    padding: 1rem;
    background-color: #248E87;
    color: white;
    border-radius: .25rem;
    font-weight: bold;
    font-size: 20px;
}

.card-footer {
    width: 100%;
    padding: .25rem;
    display: flex;
    justify-content: flex-end;
}

.delete-btn {
    width: 100px;
    height: 42px;
    background-color: #dc0000;
    color: white;
    font-weight: bold;
    font-size: 14px;
    border: none;
    border-radius: .25rem;
    margin: .25rem;
}

.delete-btn:hover {
    cursor: pointer;
}

.update-btn {
    width: 100px;
    height: 42px;
    background-color: #009DD1;
    color: white;
    font-weight: bold;
    font-size: 14px;
    border: none;
    border-radius: .25rem;
    margin: .25rem;
}

.update-btn:hover {
    cursor: pointer;
}</style>