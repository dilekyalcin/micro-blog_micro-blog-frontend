<template>
    <footer class="footer">
        <div class="blog-intro">
            <h3>What is Blog?</h3>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam quaerat incidunt labore quos architecto nesciunt. Qui laborum, velit atque in suscipit cumque dolorem laudantium nostrum dolores enim, nobis necessitatibus libero!</p>
        </div>
        <div>
            <h4>Blog Project</h4>
            <hr style="color:white;" />
            <h4>Copyright © 2024 by Dilek YALÇIN</h4>
        </div>
    </footer>
</template>
<style scoped>
.footer{
    background-color: #263238;
    color: white;
    font-family: Poppins;
    padding: .25rem .25rem;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}
.blog-intro{
    width: 25%;
}
.blog-intro p{
    font-size: 14px;
}

</style>
<script>
export default{
    name:"FooterView",
    data(){
        return{

        }
    }
}
</script>