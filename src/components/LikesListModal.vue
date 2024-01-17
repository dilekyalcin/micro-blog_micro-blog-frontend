<template>
    <div class="likes-list-modal">
        <button class="close-btn" @click="handleCloseLikesModel">X</button>
        <h4>Likes</h4>
        <ul>
            <li v-for="like in likes" :key="like.id">
                <hr>
                <p class="author">{{ like.author_username }}</p>
                <hr>
            </li>
        </ul>
    </div>
</template>

<script>
/**
 * LikesListModal Component
 * 
 * This component displays a modal containing a list of likes for a post.
 * 
 * @component
 * @props {Function} handleCloseLikesListModal - Function to handle closing the modal.
 * @props {String} postId - ID of the post for which likes are displayed.
 */
export default {
    props: {
        handleCloseLikesListModal: {
            type: Function,
            required: true
        },
        postId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            likes: [],
        };
    },
    watch: {
        // Watch for changes in postId prop
        postId: function (newVal) {
            if (newVal) {
                this.getLikes();
            }
        },
    },
    mounted() {
        // Fetch likes when the component is mounted
        this.getLikes();
    },
    methods: {
        /**
        * Fetches likes for the current post from the server.
        */
        getLikes() {
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            // Fetch likes by post ID from the server
            fetch(`http://localhost:5000/like/get_all_likes/${this.postId}`, requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(result => {
                    console.log('result likes: ', result);
                    this.likes = result;
                })
                .catch(error => console.log('error', error))
        },

        /**
         * Closes the likes modal.
         * Clears the likes data and calls the parent component's method to close the modal.
         */
        handleCloseLikesModel() {
            this.likes = []; // Clear the likes when closing the modal
            this.handleCloseLikesListModal(); // Call the parent component's method to close the modal
        },
    },
};
</script>

<style scoped>
.likes-list-modal {
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

.likes-list-modal ul {
    list-style: none;
    padding: 0;
}

.likes-list-modal li {
    margin-bottom: 10px;
    font-size: 14px;
}

.likes-list-modal .author {
    color: #01377D;
    font-size: 12px;
    font-weight: 200;
    font-style: italic;
    font-family: Poppins;
    display: block;
}

.likes-list-modal button.close-btn {
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
</style>
