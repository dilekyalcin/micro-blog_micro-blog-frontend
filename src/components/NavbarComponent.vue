<template>
    <header>
        <nav class="navbar">
            <div class="logo-container">
                <img src="../assets/blog.png" alt="logo" width="60" height="48" />
                <p class="blog-title" style="color: white;">BLOG</p>
            </div>
            <div>
                <ul class="navbar-list">
                    <li>
                        <RouterLink to="/posts" style="color: white;">Home</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/about" style="color: white;">About</RouterLink>
                    </li>
                </ul>
            </div>
            <div class="navbar-buttons" v-if="isLoggedIn === false">
                <button class="login-btn">
                    <RouterLink to="/login" style="color: white;">Login</RouterLink>
                </button>
                <button class="register-btn">
                    <RouterLink to="/register" style="color: white;">Register</RouterLink>
                </button>
            </div>
            <div class="profile-icon" v-if="isLoggedIn === true">
                <div class="icon-container">
                    <RouterLink to="/my-posts">
                        <span class="initials">{{ getInitials() }}</span>
                    </RouterLink>
                </div>
                <button class="logout-btn" @click="logout">
                    <RouterLink to="/logout">
                        <font-awesome-icon :icon="['fas', 'right-from-bracket']" style="color: white; font-size: 1.5em;" />
                    </RouterLink>
                </button>
            </div>
        </nav>
    </header>
</template>
  
<script>
export default {
    name: "NavbarComponent",
    data() {
        return {
            isLoggedIn: false,
            firstname: "",
            lastname: "",
            BACKEND_URL: import.meta.env.VITE_BACKEND_URL
        };
    },
    computed: {
        getAuthenticated() {
            return this.$store.getters.getAuthenticated;
        }
    },
    watch: {
        getAuthenticated: {
            immediate: true, // Trigger the watch callback immediately
            handler(newStatus) {
                this.isLoggedIn = newStatus;
                this.checkLoginStatus();
            }
        }
    },
    mounted() {
        console.log("status: ", this.$store.getters.getAuthenticated)
        this.isLoggedIn = this.$store.getters.getAuthenticated
        this.checkLoginStatus();
    },
    methods: {
        getInitials() {
            const initials = (this.firstname.charAt(0) + this.lastname.charAt(0)).toUpperCase();
            return initials;
        },
        checkLoginStatus() {
            const token = sessionStorage.getItem("token");

            if (token) {
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + token);

                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow',
                };

                fetch(this.BACKEND_URL + '/user/get_user_info', requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        console.log('User information response:', result);
                        this.firstname = result.firstname;
                        this.lastname = result.lastname;
                    })
                    .catch(error => {
                        console.error('Error fetching user information:', error);
                    });
            }
        },
        logout() {
            const token = sessionStorage.getItem("token");
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow',
            };
            fetch(this.BACKEND_URL + '/logout', requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(result => {
                    console.log('Logout success:', result);
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("isLoggedIn");
                    this.$router.push("/login");
                    this.$store.dispatch('logout');
                })
                .catch(error => {
                    console.error('Logout error:', error);
                });
        },
    },
};
</script>
  
<style scoped>
.navbar {
    padding: 1rem;
    max-height: 3rem;
    background-color: #3A4454;
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
    color: white;
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
    background-color: #3A4454;
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
    background-color: #6b4e71;
    color: black;
    font-weight: bold;
    font-family: Poppins;
    border-radius: .25rem;
    border: none;
}

.register-btn:hover {
    background-color: #3A4454;
}

.logout-btn {
    width: 70px;
    height: 32px;
    margin-top: .2rem;
    background-color: #3A4454;
    font-weight: bold;
    font-family: Poppins;
    display: flex;
    align-items: center;
    justify-content: center;
}

.navbar-buttons {
    display: flex;
    flex-direction: row;
}

.profile-icon {
    display: flex;
    justify-items: end;
}

.icon-container {
    width: 40px;
    height: 40px;
    background-color: #BDBDBD;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.initials {
    color: white;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-size: 1.10rem;
}
</style>
  