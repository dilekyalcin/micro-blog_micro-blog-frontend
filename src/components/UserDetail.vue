<!-- UserDetailView.vue -->
<template>
    <h4 style="display: flex; justify-content:end; margin-right: 4rem;">{{ $route.params.username }}</h4>
    <div class="content">
        <div v-if="userPosts.length > 0">
            <div v-for="post in userPosts" :key="post.title">
                <h3>{{ post.title }}</h3>
                <p>{{ post.content }}</p>
                <hr>
            </div>
        </div>
        <div v-else>
            <p>No posts available for this user.</p>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            userPosts: [],
            BACKEND_URL: import.meta.env.VITE_BACKEND_URL
        };
    },
    watch: {
        '$route.params.username': 'fetchUserPosts',
    },
    mounted() {
        this.fetchUserPosts();
    },
    methods: {
        fetchUserPosts() {
            const username = this.$route.params.username;
            // Fetch user posts from your backend API
            fetch(this.BACKEND_URL + `/user/${username}/posts`)
                .then(response => response.json())
                .then(posts => {
                    this.userPosts = posts;
                })
                .catch(error => {
                    console.error('Error fetching user posts:', error);
                });
        },
    },
};
</script>

<style>
.content {
    width: 60%;
    margin: auto;
    margin-bottom: 1rem;
    padding: 1rem;
    font-family: Poppins;
    display: flex;
    flex-direction: column;
}

.content hr {
    height: 1px;
    border: none;
    border-top: 2px solid #F2F2F2;
    margin: 10px 0;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}
</style>
  