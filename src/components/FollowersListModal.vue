<template>
    <div v-if="showOverlay" class="overlay" @click="handleCloseModal"></div>
    <div class="list-modal">
        <button class="close-btn" @click="handleCloseModal">X</button>
        <h4>Followers</h4>
        <ul>
            <li v-for="item in followers">
                <hr>
                <div class="user">
                    <router-link :to="{ name: 'user-detail', params: { username: item } }" @click="handleCloseModal" v-if="item !== authorizedUsername">
                        <span style="margin-left:.25rem;">{{ item }}</span>
                    </router-link>
                    <router-link :to="{ name: 'my-posts' }" @click="handleCloseModal" v-else>
                        <span style="margin-left:.25rem;">{{ item }}</span>
                    </router-link>
                </div>
                <hr>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        handleCloseModal: {
            type: Function,
            required: true
        },
        items: {
            type: Array,
            required: true
        },
        showOverlay: {
            type: Boolean,
            required: true
        },
        username:{
            type: String,
            required: true
        }
    },
    data() {
        return {
            authorizedUsername: '',
            followers: [],
            showOverlay: false,
            BACKEND_URL: import.meta.env.VITE_BACKEND_URL
        };
    },
    watch: {
        postId: function (newVal) {
            if (newVal) {
                this.getFollowing();
            }
        },
    },
    mounted() {
        this.authorizedUsername = sessionStorage.getItem("authorizedUsername")
        console.log("username mounted: ", this.username)
        this.getFollowing();
        this.showOverlay = true;
    },
    methods: {
        getFollowing() {
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(this.BACKEND_URL + `/user/${this.username}/followers`, requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(result => {
                    this.followers = result.followers;
                    console.log("followrs:", result)
                })
                .catch(error => console.log('error', error))
        },
    }
};
</script>

<style scoped>
.list-modal {
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-width: 300px;
    padding: 20px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 100%;
    height: 50%;
}

.list-modal ul {
    list-style: none;
    padding: 0;
}

.list-modal li {
    margin-bottom: 10px;
    font-size: 14px;
}

.list-modal .user {
    color: #01377D;
    font-size: 12px;
    font-weight: 200;
    font-style: italic;
    font-family: Poppins;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.list-modal button.close-btn {
    color: black;
    border: none;
    padding: 8px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    position: absolute;
    top: 10px;
    right: 10px;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
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

