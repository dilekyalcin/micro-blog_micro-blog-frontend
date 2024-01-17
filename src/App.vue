<script>
import NavbarComponent from "./components/NavbarComponent.vue"
import FooterView from "./views/FooterView.vue";
export default{
  components:{
    NavbarComponent,
    FooterView
  },
  data(){
    return{

    }

  }
}
</script>

<template>
  <NavbarComponent />
  <RouterView />
  <FooterView />
</template>

<style scoped>

</style>
