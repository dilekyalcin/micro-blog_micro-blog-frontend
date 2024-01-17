<template>
    <header>
        <nav class="navbar">
            <div class="logo-container">
                <img src="../assets/blog.png" alt="logo" width="60" height="48" />
                <p class="blog-title">BLOG</p> 
            </div>
            <div>
                <ul class="navbar-list">
                    <li>
                        <RouterLink to="/posts">Home</RouterLink>
                    </li>
                    <li v-if="!isLoggedIn">
                        <RouterLink to="/my-posts">Profile</RouterLink>
                    </li>
                    <li><RouterLink to="/about">About</RouterLink></li>
                </ul>
            </div>
            <div class="navbar-buttons" v-if="isLoggedIn">
                <button class="login-btn">
                    <RouterLink to="/login" style="color: white;">Login</RouterLink>
                </button>
                <button class="register-btn">
                    <RouterLink to="/register" style="color: black;">Register</RouterLink>
                </button>
            </div>
            <div v-if="!isLoggedIn">
                <button class="logout-btn">
                    <RouterLink to="/logout" style="color: white;">Logout</RouterLink>
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
    padding: 1rem;
    max-height: 3rem;
    background-color: #FFC017;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.logo-container {
    display: flex;
    align-items: center;
}

.blog-title {
    margin-top: 1rem;
    margin-left: 0.5rem;
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
    font-size: 1.5rem;
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
    color: black;
    font-weight: bold;
    font-family: Poppins;
}

.login-btn {
    width: 64px;
    height: 32px;
    padding: .25rem;
    background-color: black;
    color: white;
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
    color: black;
    font-weight: bold;
    font-family: Poppins;
    border-radius: .25rem;
    border: none;
}

.logout-btn {
    width: 64px;
    height: 32px;
    padding: .25rem;
    background-color: #dc0000;
    font-weight: bold;
    font-family: Poppins;
    border-radius: .25rem;
    border: 1px solid;
}

.navbar-buttons {
    display: flex;
    flex-direction: row;
}
</style>