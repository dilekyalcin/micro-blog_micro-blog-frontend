<template>
    <div class="profile-header">
        <div class="avatar-container">
            <img class="avatar" src="../assets/avatar.png" alt="User Avatar">
            <p style="margin-left: 22rem;">{{ username }}</p>
        </div>
        <div class="user-info">
            <div class="user-stats">
                <p>Posts: {{ userPosts ? userPosts.length : 0 }}</p>
                <p class="follow-count" @click="handleShowFollowersModal">Followers: {{ followersCount }}</p>
                <p class="follow-count" @click="handleShowFollowingModal">Following: {{ followingCount }}</p>
            </div>

            <FollowersListModal v-if="showFollowersModal" :items="followers" :showOverlay="true"
                :handleCloseModal="handleCloseFollowersModal" :username="username" />
            <FollowingListModal v-if="showFollowingModal" :items="following" :showOverlay="true"
                :handleCloseModal="handleCloseFollowingModal" :username="username" />
            <button @click="toggleFollow">{{ isFollowing ? 'Unfollow' : 'Follow' }}</button>
        </div>
    </div>
    <hr>
    <div class="content">
        <div v-if="isLoggedIn">
            <div class="card" v-for="item in userPosts" :key="item.id">
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
                    <div
                        style="margin-right: 5rem; padding: .5rem .5rem;border-radius: .5rem;background-color: #efefef;color: black;">
                        #{{ item.tag }}
                    </div>
                </div>
                <hr>
            </div>
            <comments-modal v-if="showCommentModal" :handleCloseCommentModal="handleCloseCommentModal"
                :postId="selectedCommentPostId"></comments-modal>
        </div>
    </div>

</template>

<script>
import CommentsModal from "./CommentsModal.vue"
import LikesListModal from "./LikesListModal.vue";
import FollowersListModal from "./FollowersListModal.vue";
import FollowingListModal from "./FollowingListModal.vue";
export default {
    components: {
        CommentsModal,
        LikesListModal,
        FollowersListModal,
        FollowingListModal
    },
    data() {
        return {
            userPosts: null,
            username: "",
            userAvatar: '',
            userBio: '', // Set user's bio here
            followingCount: 0, // Set user's following count here
            followersCount: 0, // Set user's followers count here
            isFollowing: false, // Set to true if current user is following this user
            resultsContainer: false,
            isLiked: false,
            author: "",
            isLoggedIn: false,
            showModal: false,
            showCommentModal: false,
            userId: '',
            showLikesListModal: false,
            selectedPostId: '',
            selectedCommentPostId: '',
            commentPostId: '',
            firstname: "",
            lastname: "",
            showFollowersModal: false,
            showFollowingModal: false,
            BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
        };
    },
    watch: {
        '$route.params.username': 'fetchUserData',
    },
    mounted() {
        this.userId = sessionStorage.getItem("userId")
        this.checkLoginStatus();
        this.fetchUserData();
    },
    methods: {
        checkLoginStatus() {
            var token = sessionStorage.getItem("token");
            this.isLoggedIn = !!token;
        },
        fetchUserData() {
            const authorizedUsername = sessionStorage.getItem("authorizedUsername");
            const username = this.$route.params.username;
            this.username = username;
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            fetch(this.BACKEND_URL + `/user/${username}/posts`, requestOptions)
                .then(response => response.json())
                .then(userData => {
                    this.userPosts = userData;
                    this.username = username;
                    this.userBio = userData.bio;
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
            fetch(this.BACKEND_URL + `/user/${username}/following`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    this.followingCount = data.count;
                })
                .catch(error => console.error('Error fetching following count:', error));

            fetch(this.BACKEND_URL + `/user/${username}/followers`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    this.followersCount = data.count;
                    for (let i = 0; i < data.followers.length; i++) {
                        if (data.followers[i] == authorizedUsername) {
                            this.isFollowing = true;
                        }
                    }
                })
                .catch(error => console.error('Error fetching followers count:', error));
        },
        toggleLike(id, likes) {
            const isExistLike = likes.some(like => like.user_id === this.userId);
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
                        this.fetchUserData();
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
                        this.fetchUserData();
                    })
                    .catch(error => console.log('error', error));
            }

            this.isLiked = !this.isLiked;
        },
        handleShowCommentModal(id) {
            this.showCommentModal = true
            this.selectedCommentPostId = id
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
        toggleFollow() {
            const username = this.$route.params.username;
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow'
            };

            const followEndpoint = this.isFollowing ? `/user/unfollow/${username}` : `/user/follow/${username}`;

            fetch(this.BACKEND_URL + followEndpoint, requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.isFollowing = !this.isFollowing;
                    this.fetchUserData();
                })
                .catch(error => console.log('error', error));
        },
        handleShowFollowersModal() {
            this.showFollowersModal = true;
        },

        handleShowFollowingModal() {
            this.showFollowingModal = true;
        },
        handleCloseFollowersModal() {
            this.showFollowersModal = false
        },
        handleCloseFollowingModal() {
            this.showFollowingModal = false
        },

    },
};
</script>

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

.profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-left: 20rem;
}

.avatar-container {
    flex: 0 0 auto;
    margin-left: 5rem;
}

.user-info {
    flex: 1 1 auto;
    text-align: center;
}

.user-stats {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.user-stats p {
    margin: 0;
    margin-bottom: 20px;
}

.bio {
    margin-bottom: 1rem;
}

.user-stats .follow-count {
    margin: 0;
    cursor: pointer;
}
</style>