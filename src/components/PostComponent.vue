<template>
    <div>
        <div v-if="isLoggedIn">
            <div class="container">
                <div class="content-container">
                    <div class="search-div">
                        <input v-model="userSearchQuery" @input="performSearch" placeholder="Search users..."
                            style="width: 25%; display: block;">
                    </div>
                    <div class="search-results-container" v-if="resultsContainer">
                        <div v-for="user in searchedUsers"
                            v-if="searchedUsers"
                            :key="user.username" class="item search">
                            <router-link :to="{ name: 'user-detail', params: { username: user.username } }">
                                <p>{{ user.firstname }} {{ user.lastname }}</p>
                            </router-link>
                        </div>
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
                                            <span class="initials">{{ (item.firstname.charAt(0) +
            item.lastname.charAt(0)).toUpperCase() }}</span>
                                        </div>
                                        <!-- <p style="margin-left: .25rem; margin-bottom: 1.5rem;">{{ item.author }}</p> -->
                                        <router-link :to="{ name: 'user-detail', params: { username: item.author } }">
                                         <p style="margin-left:.25rem;">{{ item.author }}</p>
                                        </router-link>
                                    </div>
                                    <div style="display: flex;justify-content: center;align-items: center;">
                                        <p @click="toggleLike(item.id, item.likes)" class="heart-icon">
                                            <font-awesome-icon icon="heart" style="margin-right: .25rem;"
                                                :class="{ 'liked': isUserLiked(item.likes) }" />
                                        </p>
                                        <p @click="handleShowLikesListModal(item.id)" class="likes-count-link">
                                            {{ item.likeCount }}
                                        </p>
                                        <likes-list-modal v-if="showLikesListModal" :post-id="selectedPostId"
                                            :show-modal="showLikesListModal"
                                            :handle-close-likes-list-modal="handleCloseLikesListModal"></likes-list-modal>

                                        <p @click="handleShowCommentModal(item.id)" class="comment-link">Comments</p>
                                        <p class="tag-container">
                                            #{{ item.tag }}
                                        </p>
                                    </div>
                                </div>

                            </div>
                            <comments-modal v-if="showCommentModal" :handleCloseCommentModal="handleCloseCommentModal"
                                :postId="commentPostId"></comments-modal>
                        </div>
                    </div>
                </div>
                <div class="filter-div">
                    <div class="main-filter">
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
                    <div class="popular-tags">
                        <h3>Popular Tags</h3>
                        <div class="tag-buttons">
                            <button class="tag-btn" v-for="tag in popularTags" :key="tag.tag_name"
                                @click="handleFilterByTag(tag.tag_name)"># {{ tag.tag_name }}</button>
                        </div>
                    </div>
                    <div class="search-tags">
                        <select v-model="selectedTag"
                            style="height: 2rem;padding:.5rem;border-radius: .2rem;margin-right:0.5rem; width:100%;">
                            <option v-for="tag in existingTags" :key="tag.id" :value="tag.name">{{ tag.name }}</option>
                        </select>
                        <button class="search-btn" @click="handleSearch">Search</button>
                    </div>
                    <div class="reset-div">
                        <button class="reset-btn" @click="handleResetFilter">Reset Filter</button>
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
        HomePage
    },
    data() {
        return {
            resultsContainer: false,
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
            selectedCommentPostId: '',
            commentPostId: '',
            firstname: "",
            lastname: "",
            BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
            userSearchQuery: "",
            searchedUsers: [],
            popularTags: null,
            selectedTag: '',
            existingTags: null
        };
    },
    mounted() {
        // When the page loads, check if the user is logged in and fetch all posts
        this.userId = sessionStorage.getItem("userId")
        this.checkLoginStatus();
        this.getAllPosts();
        this.getPopularTags();
        this.getTags();
    },
    methods: {
        async performSearch() {
            console.log(this.userSearchQuery.length);
            if (this.userSearchQuery.length != 0) {
                var token = sessionStorage.getItem("token");
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + token);

                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };
                console.log("search query: ", this.userSearchQuery);

                await fetch(this.BACKEND_URL + `/user/search-users?query=${this.userSearchQuery}`, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        this.searchedUsers = data;
                        this.resultsContainer = true;
                    })
                    .catch(error => {
                        console.error('Error fetching searched users:', error);
                    });
            } else if(this.userSearchQuery.length == 0) {
                console.log("girdi");
                this.resultsContainer = false
                this.searchedUsers = [];
            }
        },

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

            fetch(this.BACKEND_URL + "/post/following-posts", requestOptions)
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

            fetch(this.BACKEND_URL + `/post/posts-by-date?start_date=${this.startDate}&end_date=${this.endDate}`, requestOptions)
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

                fetch(this.BACKEND_URL + "/like/managed-like", requestOptionsRemoveLike)
                    .then(response => response.json())
                    .then(result => {
                        console.log('removed like: ', result);
                        this.getAllPosts()
                        this.getPopularTags();
                    })
                    .catch(error => console.log('error', error));
            } else {

                var requestOptionsAddLike = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch(this.BACKEND_URL + "/like/managed-like", requestOptionsAddLike)
                    .then(response => response.json())
                    .then(result => {
                        console.log('add like: ', result);
                        this.getAllPosts()
                        this.getPopularTags();
                    })
                    .catch(error => console.log('error', error));
            }

            this.isLiked = !this.isLiked;
        },
        handleShowCommentModal(id) {
            this.showCommentModal = true
            this.commentPostId = id
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
        formatCreatedAt(createdAt) {
            const formattedDate = new Date(createdAt).toLocaleString();
            return formattedDate;
        },
        getPopularTags() {
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(this.BACKEND_URL + `/tag/popular-tags`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.popularTags = result;
                })
                .catch(error => console.log('error', error));
        },
        handleFilterByTag(tagName) {
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(this.BACKEND_URL + `/tag/${tagName}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.posts = result;
                })
                .catch(error => console.log('error', error));
        },
        handleFilterByFollowingTag(tagName) {
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(this.BACKEND_URL + `/tag/${tagName}/followed-users-posts`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.posts = result;
                })
                .catch(error => console.log('error', error));
        },
        handleResetFilter() {
            this.getAllPosts();
        },
        getTags() {
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
            };
            fetch(this.BACKEND_URL + "/tag/followed-users-tags", requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.existingTags = result;
                })
                .catch(error => console.log('error', error));
        },
        handleSearch() {
            console.log(this.selectedTag);
            this.handleFilterByFollowingTag(this.selectedTag);
        }
    }
};
</script>

<!-- <style src="vue-multiselect/dist/vue-multiselect.min.css"></style> -->
<style scoped>
.container {
    padding: .25rem;
    margin: 1rem 1rem;
    display: flex;
    flex-direction: row;

}

.container .content-container {
    min-width: 75%;
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

.filter-div {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    margin-left: 1rem;
}

.filter-div .main-filter {
    display: flex;
    flex-direction: row;
}

.search-div {
    display: flex;
    flex-direction: row;
    justify-content: center;

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
    width: 50px;
    height: 20px;
    background-color: #53687e;
    margin-top: 0.5rem;
    margin-left: 0.5rem;
}

.item {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 0 auto 10px auto;
    padding: 10px 20px;
    color: white;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
        rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.search {
    cursor: pointer;
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

.likes-count-link {
    text-decoration: underline;
}

.likes-count-link:hover {
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
    color: #bebebe;
}

.heart-icon:hover {
    cursor: pointer;
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
    margin-top: 15px;
}

.initials {
    color: white;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-size: 1.10rem;
}


h2 {
    font-size: 1.5em;
    margin-bottom: 10px;
}

input {
    padding: 8px;
    margin-bottom: 10px;
    width: 100%;
    box-sizing: border-box;
    /* Ensure padding and border are included in the total width */
}

div {
    margin-bottom: 20px;
}

p {
    margin: 5px 0;
}

/* Style for router-link */
.router-link-exact-active {
    color: blue;
    /* Change the color for the active link as needed */
}

.tag-container {
    padding: .25rem .25rem;
    border-radius: .5rem;
    background-color: #efefef;
    color: black;
    font-weight: bold;
    margin-left: .5rem;
}

.popular-tags {
    display: flex;
    background-color: #efefef;
    border-radius: .75rem;
    width: 100%;
    height: 25vh;
    flex-direction: column;
    flex-wrap: wrap;
}

.popular-tags h3 {
    margin: .5rem;
}

.popular-tags .tag-buttons {
    display: flex;
    flex-direction: row;
    margin: .5rem;
    flex-wrap: wrap;
}

.tag-btn {
    padding: .5rem .5rem;
    border-radius: .5rem;
    background-color: #112854;
    color: white;
    font-weight: bold;
    margin: .5rem;
}

.reset-div {
    display: flex;
    justify-content: flex-end;
}

.reset-div .reset-btn {
    padding: .5rem .5rem;
    background-color: orange;
    color: white;
    border-radius: .5rem;
    font-weight: bold;
}

.search-tags {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.search-results-container {
    max-height: 200px;
    width: 30%;
    overflow-y: auto;
    margin-left: 35%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
 
}
</style>