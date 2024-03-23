<template>
    <div v-if="showOverlay" class="overlay" @click="handleCloseCommentModal"></div>
    <div class="modal">
        <div class="header">
            <h2>Comments</h2>
            <button class="close-btn" @click="handleCloseCommentModal">x</button>
        </div>
        <div class="scroll-container">
            <div class="content" v-for="item in comments" :key="item.id">
                <div>
                    <router-link :to="{ name: 'user-detail', params: { username: item.author_username } }" @click="handleCloseModal" v-if="item.author_username !== authorizedUsername">
                        <p class="author">{{ item.author_username }}</p>
                    </router-link>
                    <router-link :to="{ name: 'my-posts' }" @click="handleCloseModal" v-else>
                        <p class="author">{{ item.author_username }}</p>
                    </router-link>

                    <!-- Check edit mode -->
                    <template v-if="editingCommentId !== item.id">
                        <p class="post_content">{{ item.content }}</p>
                    </template>
                    <template v-else>
                        <!-- Show input field-->
                        <input v-model="editedCommentContent" />
                    </template>

                </div>
                <div v-if="item.author_id == userId" class="comment-management">
                    <!-- Show Edit and Delete buttons -->
                    <template v-if="editingCommentId !== item.id">
                        <button class="edit-btn" @click="startEditingComment(item.id)"><font-awesome-icon
                                icon="pen-to-square" />Edit</button>
                        <button class="delete-btn" @click="deleteComment(item.id)"><font-awesome-icon
                                icon="trash" />Delete</button>
                    </template>

                    <!-- Save and Cancel buttons -->
                    <template v-if="editingCommentId === item.id">
                        <button class="save-btn" @click="saveEditedComment(item.id)"><font-awesome-icon
                                icon="save" />Save</button>
                        <button class="cancel-btn" @click="cancelEditingComment"><font-awesome-icon
                                icon="xmark" />Cancel</button>
                    </template>
                </div>
            </div>
        </div>
        <div class="add-comment-input">
            <input type="text" v-model="newComment" />
            <button @click="handleAdd"><font-awesome-icon icon="add" />Add</button>
        </div>
        <!-- <div class="add-comment-input">
            <input type="text" v-model="newComment" />
            <button @click="handleAdd"><font-awesome-icon icon="add" />Add</button>
        </div> -->
    </div>
</template>
<script>

/**
 * CommentsModal Component
 * 
 * This component represents a modal for displaying and managing comments.
 * 
 * @component
 * @props {Function} handleCloseCommentModal - Function to handle closing the modal.
 * @props {String} postId - ID of the post for which comments are displayed.
 */
export default {
    name: "CommentsModal",
    props: {
        /**
         * Function to handle closing the modal.
         *
         * @type {Function}
         * @required
         */
        handleCloseCommentModal: {
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
            authorizedUsername: '',
            newPostContent: "",
            newPostTitle: "",
            comments: null,
            userId: '',
            editingCommentId: null,
            editedCommentContent: "",
            newComment: '',
            showOverlay: true,
            BACKEND_URL: import.meta.env.VITE_BACKEND_URL
        }
    },
    mounted() {
        this.authorizedUsername = sessionStorage.getItem("authorizedUsername")
        this.showOverlay = true
        this.userId = sessionStorage.getItem('userId')
        this.getAllCommentsById();
    },
    methods: {
        /**
        * Fetches all comments for the current post.
        */
        getAllCommentsById() {
            var token = sessionStorage.getItem("token")
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(this.BACKEND_URL + `/comment/all-comments/${this.postId}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.comments = result;
                })
                .catch(error => console.log('error', error));
        },

        /**
         * Deletes a comment by its ID.
         * @param {String} commentId - The ID of the comment to be deleted.
         */
        deleteComment(commentId) {
            var token = sessionStorage.getItem("token")
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(this.BACKEND_URL + `/comment/${commentId}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.getAllCommentsById()
                })
                .catch(error => console.log('error', error));
        },

        /**
         * Starts the editing mode for a specific comment.
         * @param {String} commentId - The ID of the comment to be edited.
         */
        startEditingComment(commentId) {
            this.editingCommentId = commentId;
            // Get the content of the edited comment
            const commentToEdit = this.comments.find(comment => comment.id === commentId);
            this.editedCommentContent = commentToEdit.content;
        },

        /**
         * Saves the edited content of a comment.
         * @param {String} commentId - The ID of the comment being edited.
         */
        saveEditedComment(commentId) {
            var token = sessionStorage.getItem("token")
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + token);

            var raw = JSON.stringify({
                "content": this.editedCommentContent
            });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(this.BACKEND_URL + `/comment/${commentId}`, requestOptions)
                .then(response => response.json())
                .catch(error => console.log('error', error));
            this.editingCommentId = null;
            this.getAllCommentsById();
        },

        /**
        * Cancels the editing mode for a comment.
        */
        cancelEditingComment() {
            this.editingCommentId = null;
        },

        /**
        * Handles the "Add" button click event.
        * Adds a new comment to the post.
        */
        handleAdd() {
            var token = sessionStorage.getItem('token');
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + token);

            var raw = JSON.stringify({
                "content": this.newComment,
                "post_id": this.postId
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(this.BACKEND_URL + "/comment", requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.newComment = ''
                    this.getAllCommentsById();
                })
                .catch(error => console.log('error', error));
        }

    }
}

</script>
<style scoped>
.modal {
    padding: 1rem;
    width: 40%;
    position: fixed;
    top: 25%;
    left: 30%;
    border-radius: .25rem;
    border: 1px solid #112854;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    z-index: 1000;
    display: flex;
    flex-direction: column;
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

.content {
    border-radius: .25rem;
    padding: .5rem;
    margin: .5rem;
    box-shadow: 0 2px 0px rgba(0, 0, 0, 0.1);
}

.post_content {
    font-weight: 400;
    font-family: 14px;
    font-family: Poppins;
}

.author {
    font-size: 12px;
    font-weight: 200;
    font-style: italic;
    font-family: Poppins;
    display: flex;
    /* justify-content: flex-end; */
}

.comment-management {
    display: flex;
    justify-content: flex-end;
}

.edit-btn {
    padding: .5rem;
    font-size: 12px;
    background-color: #112854;
    border-radius: 4x;
    margin: .25rem;
}

.delete-btn {
    font-size: 12px;
    padding: .25rem;
    background-color: #dc0000;
    border-radius: 4x;
    margin: .25rem;
}

.add-comment {
    display: flex;
    justify-content: flex-end;
    margin: .5rem;
}

.add-comment-input {
    display: flex;
    flex-direction: row;
}

.scroll-container {
    max-height: 200px;
    overflow-y: scroll;
}


.add-comment-input button {
    background-color: #53687e;
    width: 20%;
    height: 40px;
    font-size: 12px;
    margin-left: 10px;
    margin-top: 3px;
}

.save-btn {
    margin-right: 4px;
    font-size: 12px;
    width: 80px;
    background-color: #112854;
}

.cancel-btn {
    margin-right: 4px;
    width: 80px;
    font-size: 12px;
    background-color: #dc0000;

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
</style>