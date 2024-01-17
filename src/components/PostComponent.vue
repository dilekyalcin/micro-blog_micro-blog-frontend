<template>
    <div>
        <div class="container">
            <div class="modal-div">
                <add-post-modal v-if="showModal" :handleCloseModal="handleCloseModal"
                    :getAllPosts="getAllPosts"></add-post-modal>
                <button class="add-post-btn" @click="handleModal">Add Post</button>
            </div>
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
                            <button class="detail-btn"><router-link :to="{ name: 'post-detail', params: { id: item.id } }"
                                    style="text-decoration: none;color: white;">Detail</router-link></button>
                        </div>
                        <hr/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import AddPostModal from './AddPostModal.vue';
export default {
    /**
     * BlogPage - Component for displaying blog posts and creating new posts.
     *
     * @name BlogPage
     * @export
     */
    name: "BlogPage",
    components: {
        AddPostModal,
        RouterLink
    },
    data() {
        return {
            posts: null,
            author: "",
            isLoggedIn: false,
            showModal: false,
            startDate: null,
            endDate: null
        };
    },
    mounted() {
        // When the page loads, check if the user is logged in and fetch all posts
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
        /**
        * Handles opening the add post modal.
        *
        * @method
        * @name handleModal
        * @memberof BlogPage
        */
        handleModal() {
            this.showModal = true
        },
        /**
        * Handles closing the add post modal.
        *
        * @method
        * @name handleCloseModal
        * @memberof BlogPage
        */
        handleCloseModal() {
            this.showModal = false
        }
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
}

.datefilter {
    display: flex;
    flex-direction: column;
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

input {
    height: .10rem;
}

label {
    font-family: Poppins;
    font-weight: bold;
    line-height: 0;
}

.filter-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 32px;
    background-color: #01377D;
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
    padding: .5rem;
    background-color: #248E87;
    color: white;
    border-radius: .25rem;
    font-weight: bold;
    font-size: 14px;
}
</style>