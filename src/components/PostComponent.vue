<template>
    <div>
        <div v-if="isLoggedIn">
            <div class="container">
                <div class="filter-div">
                    <div class="datefilter">
                        <label for="">Start Date</label>
                        <input type="date" name="startDate" v-model="startDate">
                    </div>
                    <div class="datefilter">
                        <label for="">End Date</label>
                        <input type="date" name="enddate" v-model="endDate">
                    </div>
                    <button class="filter-btn" @click="filterPosts">Filter</button>
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
                                <div style="display: flex;justify-content: center;align-items: center;">
                                    <p @click="toggleLike(item.id, item.likes)" class="heart-icon">
                                        <font-awesome-icon icon="heart" style="margin-right: .25rem;"
                                            :class="{ 'liked': isUserLiked(item.likes) }" />
                                    </p>
                                    <p @click="handleShowLikesListModal(item.id)" class="likes-count-link">{{ item.likeCount
                                    }}
                                    </p>
                                    <likes-list-modal v-if="showLikesListModal" :post-id="selectedPostId"
                                        :show-modal="showLikesListModal"
                                        :handle-close-likes-list-modal="handleCloseLikesListModal"></likes-list-modal>
                                    <p @click="handleShowCommentModal" class="comment-link">Comments</p>
                                    <comments-modal v-if="showCommentModal"
                                        :handleCloseCommentModal="handleCloseCommentModal"
                                        :postId="item.id"></comments-modal>

                                </div>
                            </div>
                            <hr />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="container">
                <HomePage />
            </div>
        </div>
    </div>
</template>

<script>
import CommentsModal from "./CommentsModal.vue"
import LikesListModal from "./LikesListModal.vue";
import HomePage from '../views/HomeView.vue';
export default {
    /**
     * BlogPage - Component for displaying blog posts and creating new posts.
     *
     * @name BlogPage
     * @export
     */
    name: "BlogPage",
    components: {
        CommentsModal,
        LikesListModal,
        HomePage,
    },
    data() {
        return {
            isLiked: false,
            posts: null,
            author: "",
            isLoggedIn: false,
            showModal: false,
            showCommentModal: false,
            startDate: null,
            endDate: null,
            userId: '',
            showLikesListModal: false,
            selectedPostId: '',
        };
    },
    mounted() {
        // When the page loads, check if the user is logged in and fetch all posts
        this.userId = sessionStorage.getItem("userId")
        this.checkLoginStatus();
        this.getAllPosts();
    },
    methods: {
        /**
        * Checks user login status.
        *
        * @method
        * @name checkLoginStatus
        * @memberof BlogPage
        */
        checkLoginStatus() {
            var token = sessionStorage.getItem("token");
            this.isLoggedIn = !!token;
        },
        /**
         * Returns all texts.
         *
         * @method
         * @name getAllPosts
         * @memberof BlogPage
         */
        getAllPosts() {
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("http://localhost:5000/post/get_all_posts", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('result get all posts: ', result);
                    this.posts = result;
                })
                .catch(error => console.log('error', error));

        },
        /**
        * Filters posts based on start and end dates.
        *
        * @method
        * @name filterPosts
        * @memberof BlogPage
        */
        filterPosts() {
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`http://localhost:5000/post/get_posts_by_date?start_date=${this.startDate}&end_date=${this.endDate}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('get_posts_by_date: ', result);
                    this.posts = result;
                })
                .catch(error => console.log('error', error));
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

                fetch("http://localhost:5000/like/remove_like", requestOptionsRemoveLike)
                    .then(response => response.json())
                    .then(result => {
                        console.log('removed like: ', result);
                        this.getAllPosts()
                    })
                    .catch(error => console.log('error', error));
            } else {

                var requestOptionsAddLike = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch("http://localhost:5000/like/add_like", requestOptionsAddLike)
                    .then(response => response.json())
                    .then(result => {
                        console.log('add like: ', result);
                        this.getAllPosts()
                    })
                    .catch(error => console.log('error', error));
            }

            this.isLiked = !this.isLiked;
        },
        handleShowCommentModal() {
            this.showCommentModal = true
        },
        handleCloseCommentModal() {
            this.showCommentModal = false
        },
        isUserLiked(likes) {
            // Check if likes is defined and not null
            if (likes && likes.length > 0) {
                // Check if the current user's ID is in the array of likes
                return likes.some(like => like.user_id === this.userId);
            }
            // Return false if likes is undefined or empty
            return false;
        },

        handleShowLikesListModal(postId) {
            this.showLikesListModal = true;
            this.selectedPostId = postId;
        },

        handleCloseLikesListModal() {
            this.showLikesListModal = false;
            this.selectedPostId = '';
        },
    }
};
</script>

<style scoped>
.container {
    padding: .25rem;
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

.filter-div {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 1rem;
    margin-left: 1rem;
}

.author-div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: black;
    font-weight: bold;
}

input {
    height: .10rem;
}

label {
    font-family: Poppins;
    font-weight: bold;
    line-height: 0;
    font-size: small;
}

.filter-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 32px;
    background-color: black;
    margin-top: 0.5rem;
    margin-left: 0.5rem;
}

.post-info {
    color: black;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.liked {
    color: red;
}
.likes-count-link{
    text-decoration: underline;
}
.likes-count-link:hover{
    cursor: pointer;
}

.comment-link {
    text-decoration: underline;
    margin-left: 4px;
}

.comment-link:hover {
    cursor: pointer;
}

.heart-icon {
    margin-right: 4px;
}

.heart-icon:hover {
    cursor: pointer;
}
</style>