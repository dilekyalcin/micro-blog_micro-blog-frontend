<template>
    <div v-if="showOverlay" class="overlay" @click="closeModal"></div>
    <div class="modal">
        <div class="header">
            <h2>Update Profile</h2>
            <button class="close-btn" @click="closeModal">x</button>
        </div>
        <div class="form-group">
            <label for="firstname">First Name:</label>
            <input type="text" v-model="firstname" id="firstname">
        </div>
        <div class="form-group">
            <label for="lastname">Last Name:</label>
            <input type="text" v-model="lastname" id="lastname">
        </div>
        <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" v-model="username" id="username">
        </div>
        <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" v-model="password" id="password">
        </div>
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" v-model="email" id="email">
        </div>
        <button @click="updateProfile">Update</button>
    </div>
</template>
<script>
export default {
    name: "UpdateProfileModal",
    props: {
        /**
         * Function to handle closing the modal.
         *
         * @type {Function}
         * @required
         */
        closeModal: {
            type: Function,
            required: true
        },
        getAllMyPosts: {
            type: Function,
            required: true
        },
        updateData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            firstname: '',
            lastname: '',
            username: '',
            password: '',
            email: '',
            showOverlay: false,
            BACKEND_URL: import.meta.env.VITE_BACKEND_URL
        }
    },
    mounted() {
        this.firstname = this.updateData.firstname
        this.lastname = this.updateData.lastname
        this.username = this.updateData.username
        this.password = this.updateData.password
        this.email = this.updateData.email
        this.showOverlay = true;
    },
    methods: {
        updateProfile() {
            var token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                firstname: this.firstname,
                lastname: this.lastname,
                username: this.username,
                password: this.password,
                email: this.email,
            });

            console.log(raw);
            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(this.BACKEND_URL + "/user", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('result update: ', result);
                    this.closeModal();
                    this.showOverlay = false;
                    this.closeModal();
                    window.location.reload();
                })
                .catch(error => console.log('error', error));
        },

    }
}

</script>
<style scoped>
.modal {
    padding: 1.2rem;
    max-width: 30%;
    position: absolute;
    top: 10%;
    left: 30%;
    background-color: white;
    border-radius: .25rem;
    border: 1px solid #112854;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    margin-bottom: 0.3rem;
}

input,
textarea {
    width: 75%;
    padding: .5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 3px;
}

button {
    background-color: #53687e;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
}
</style>