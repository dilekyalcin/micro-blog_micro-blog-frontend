<template>
    <div style="height: 100%;">
        <div class="container">
            <div class="modal-div">

                <button @click="openUpdateProfileModal" class="update-profile-btn">Update Profile</button>
                <update-profile-modal v-if="showUpdateProfileModal" :closeModal="closeUpdateProfileModal"
                    :updateData="updateData"></update-profile-modal>

                <add-post-modal v-if="showModal" :handleCloseModal="handleCloseModal"
                    :getAllPosts="getAllPosts"></add-post-modal>
                <button class="add-post-btn" @click="handleModal">Write</button>
            </div>
            <div class="content">
                <div v-if="isLoggedIn">
                    <div class="card" v-for="item in posts" :key="item.id">
                        <div class="card-header">
                            <p class="created-at">{{ formatCreatedAt(item.created_at) }}</p>
                        </div>
                        <div>
                            <p class="post-info"> Title: {{ item.title }}</p>
                        </div>
                        <div>
                            <p>{{ item.content }}</p>
                        </div>
                        <div class="author-div">
                            <div style="display: flex;flex-direction: row;align-items: center;">
                                <div class="icon-container">
                                    <span class="initials">{{ (item.firstname.charAt(0) + item.lastname.charAt(0)).toUpperCase()
                                    }} </span>
                                </div>
                                <p style="margin-left: .25rem;">{{ item.author }}</p>
                            </div>
                            <div style="display: flex;justify-content: center;align-items: center;">
                                <p @click="toggleLike(item.id, item.likes)" class="heart-icon">
                                    <font-awesome-icon icon="heart" style="margin-right: .25rem;"
                                        :class="{ 'liked': isUserLiked(item.likes) }" />
                                </p>
                                <p @click="handleShowLikesListModal(item.id)" class="likes-count-link">{{ item.likeCount }}
                                </p>
                                <update-post-modal v-if="showUpdateModal" :post="selectedPost"
                                    :handleUpdateCloseModal="handleUpdateCloseModal"
                                    :getAllMyPosts="getAllMyPosts"></update-post-modal>
                                <likes-list-modal v-if="showLikesListModal" :post-id="selectedPostId"
                                    :show-modal="showLikesListModal"
                                    :handle-close-likes-list-modal="handleCloseLikesListModal"></likes-list-modal>
                                <p @click="handleShowCommentModal(item.id)" class="comment-link">Comments</p>

                            </div>
                        </div>
                        <div class="card-footer">
                            <button class="delete-btn" @click="deletePost(item.id)">Delete Post</button>
                            <button class="update-btn" @click="updatePost(item)">Update Post</button>
                        </div>
                        <hr>
                    </div>
                    <comments-modal v-if="showCommentModal" :handleCloseCommentModal="handleCloseCommentModal"
                        :post-id="selectedCommentPostId"></comments-modal>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AddPostModal from './AddPostModal.vue';
import UpdatePostModal from "./UpdatePostModal.vue"
import CommentsModal from './CommentsModal.vue';
import LikesListModal from "./LikesListModal.vue";
import UpdateProfileModal from "./UpdateProfileModal.vue";
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
        UpdatePostModal,
        CommentsModal,
        LikesListModal,
        UpdateProfileModal,
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
            updateData: {
                firstname: '',
                lastname: '',
                username: '',
                password: '',
                email: '',
            },
            posts: null,
            author: "",
            isLoggedIn: false,
            showModal: false,
            showUpdateModal: false,
            selectedPost: null,
            showCommentModal: false,
            isLiked: false,
            selectedPostId: '',
            userId: '',
            showLikesListModal: false,
            postId: '',
            selectedCommentPostId: '',
            created_at: "",
            showUpdateProfileModal: false,
            BACKEND_URL: import.meta.env.VITE_BACKEND_URL
        };
    },
    mounted() {
        // When the page loads, check if the user is logged in and fetch all posts
        this.userId = sessionStorage.getItem("userId")
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

            fetch(this.BACKEND_URL + "/post/get_currentuser_post", requestOptions)
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

            fetch(this.BACKEND_URL + `/post/delete_post/${postId}`, requestOptions)
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
        },
        handleShowCommentModal(postId) {
            this.showCommentModal = true
            this.selectedCommentPostId = postId
        },
        handleCloseCommentModal() {
            this.showCommentModal = false
        },
        toggleLike(id, likes) {
            const isExistLike = likes.some(like => like.user_id === this.userId);
            console.log(isExistLike);
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + token);
            var raw = JSON.stringify({
                "post_id": id
            });
            if (isExistLike) {


                var requestOptionsRemoveLike = {
                    method: 'DELETE',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch(this.BACKEND_URL + "/like/remove_like", requestOptionsRemoveLike)
                    .then(response => response.json())
                    .then(result => {
                        console.log('removed like: ', result);
                        this.getAllMyPosts()
                    })
                    .catch(error => console.log('error', error));
            } else {

                var requestOptionsAddLike = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch(this.BACKEND_URL + "/like/add_like", requestOptionsAddLike)
                    .then(response => response.json())
                    .then(result => {
                        console.log('add like: ', result);
                        this.getAllMyPosts()
                    })
                    .catch(error => console.log('error', error));
            }

            this.isLiked = !this.isLiked;
        },
        isUserLiked(likes) {
            // Check if the current user's ID is in the array of likes
            return likes.some(like => like.user_id === this.userId);
        },
        handleShowLikesListModal(postId) {
            this.showLikesListModal = true;
            this.selectedPostId = postId;
        },

        handleCloseLikesListModal() {
            this.showLikesListModal = false;
            this.selectedPostId = '';
        },
        formatCreatedAt(createdAt) {
            const formattedDate = new Date(createdAt).toLocaleString();
            return formattedDate;
        },
        openUpdateProfileModal() {
            this.showUpdateProfileModal = true;
        },
        closeUpdateProfileModal() {
            this.showUpdateProfileModal = false;
        },
    }
};
</script>

<style scoped>
.container {
    width: 95%;
    margin: 0 auto;
}

.content {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.card {
    width: 100%;
    margin: auto;
    margin-bottom: 1rem;
    padding: 1rem;
    font-family: Poppins;
    display: flex;
    flex-direction: column;
    flex: 1;
    max-width: 800px;
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

.post-info {
    color: black;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.created-at {
    color: #555;
    font-size: 0.8rem;
    margin-right: 10px;
}

.card-header {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
}

.modal-div {
    display: flex;
    justify-content: flex-end;
}

.add-post-btn {
    margin-top: 1rem;
    padding: .6rem;
    width: 60px;
    background-color: #6b4e71;
    color: white;
    border-radius: .25rem;
    font-weight: bold;
    font-size: 12px;
}

.card-footer {
    width: 100%;
    padding: .25rem;
    display: flex;
    justify-content: flex-end;
}

.delete-btn {
    width: 100px;
    height: 30px;
    background-color: #dc0000;
    color: white;
    font-weight: bold;
    font-size: 0.7rem;
    border: none;
    border-radius: .25rem;
    margin: .25rem;
}

.delete-btn:hover {
    cursor: pointer;
}

.update-btn {
    width: 100px;
    height: 30px;
    background-color: #009DD1;
    color: white;
    font-weight: bold;
    font-size: 0.7rem;
    border: none;
    border-radius: .25rem;
    margin: .25rem;
}

.update-btn:hover {
    cursor: pointer;
}

.liked {
    color: red;
}

.likes-count-link {
    text-decoration: underline;
}

.likes-count-link:hover {
    cursor: pointer;
}

.heart-icon {
    margin-right: 4px;
    color: #bebebe;
}

.comment-link {
    text-decoration: underline;
    margin-left: 4px;
}

.comment-link:hover {
    cursor: pointer;
}

.update-profile-btn {
    margin-right: 4px;
    margin-top: 1rem;
    padding: .6rem;
    width: 60px;
    border-radius: .25rem;
    font-weight: bold;
    font-size: 12px;
}

.icon-container {
    width: 30px;
    height: 30px;
    background-color: #BDBDBD;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-size: .75rem;
}
</style>