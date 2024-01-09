<template>
    <header>
        <nav class="navbar">
            <div>
                <img src="../assets/blog.png" alt="logo" width="48" height="48" />
            </div>
            <div>
                <ul class="navbar-list">
                    <li>
                        <RouterLink to="/">Home</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/my-posts">My Posts</RouterLink>
                    </li>
                    <li><a href="#">About</a></li>
                </ul>
            </div>
            <div class="navbar-buttons" v-if="isLoggedIn">
                <button class="login-btn">
                    <RouterLink to="/login" style="color: #6BB3AE;">Login</RouterLink>
                </button>
                <button class="register-btn">
                    <RouterLink to="/register" style="color: white;">Register</RouterLink>
                </button>
            </div>
            <div v-if="!isLoggedIn">
                <button class="logout-btn">
                    <RouterLink to="/logout" style="color: #dc0000;">Logout</RouterLink>
                </button>
            </div>
        </nav>
    </header>
</template>
<script>
export default {
    name: "NavbarComponent",
    /**
    * Data properties of the component.
    *
    * @property {boolean} isLoggedIn - Indicates whether the user is logged in.
    */
    data() {
        return {
            isLoggedIn: sessionStorage.getItem("isLoggedIn") ? false : true
        }
    },
    /**
     * Lifecycle hook called after the component has been mounted.
     *
     * @event mounted
     * @memberof NavbarComponent
     * @instance
     * @method
     */
    mounted() {
        // When the page loads, check if the user is logged in
        this.checkLoginStatus();
    },
    methods: {
        /**
          * Checks user login status.
          *
          * @method
          * @name checkLoginStatus
          * @memberof NavbarComponent
          * @instance
          */
        checkLoginStatus() {
            sessionStorage.getItem("token");
        },
    }
}
</script>
<style scoped>
.navbar {
    margin-bottom: 1rem;
    padding: 1rem;
    max-height: 3rem;
    background-color: #6BB3AE;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navbar-list {
    list-style: none;
    display: flex;
    flex-direction: row;
}

.navbar-list li {
    margin: .25rem;
}

a {
    text-decoration: none;
    color: white;
    font-weight: bold;
    font-family: Poppins;
}

.login-btn {
    width: 64px;
    height: 32px;
    padding: .25rem;
    background-color: white;
    color: #6BB3AE;
    font-weight: bold;
    font-family: Poppins;
    border-radius: .25rem;
    border: none;
    margin-right: .25rem;
}

.register-btn {
    width: 64px;
    height: 32px;
    padding: .25rem;
    background-color: transparent;
    color: white;
    font-weight: bold;
    font-family: Poppins;
    border-radius: .25rem;
    border: none;
}

.logout-btn {
    width: 64px;
    height: 32px;
    padding: .25rem;
    background-color: white;
    color: #dc0000;
    font-weight: bold;
    font-family: Poppins;
    border-radius: .25rem;
    border: 1px solid white;
}

.navbar-buttons {
    display: flex;
    flex-direction: row;
}
</style>