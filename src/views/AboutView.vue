<template>
  <div id="app">
    <div class="card">
      <div class="content">
        <img src="../assets/vision-16.png" alt="vision-card">
        <div class="text-content">
          <h3>Vision</h3>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores ea molestiae reiciendis voluptates quaerat
            debitis, expedita ex? Facere labore minima nisi fugit repellat, esse distinctio temporibus rem animi aspernatur
            architecto repudiandae sunt mollitia quae illum rerum aliquid ratione officia veritatis eum expedita earum
            dignissimos voluptates. Quis ullam cumque magni magnam!</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="content">
        <div class="text-content">
          <h3>Mission</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, voluptate et. Dolore iste incidunt dolorum
            minima expedita repellat numquam eum quasi deserunt debitis nostrum, eaque vel, sed rerum officiis voluptatem
            nesciunt sunt adipisci aliquam itaque quo. Laudantium, distinctio! Velit, aut debitis. Dolor neque
            reprehenderit, fuga, corrupti ullam in laborum adipisci odio aperiam placeat, illo veritatis alias! Atque
            eligendi eos cupiditate.</p>
        </div>
        <img src="../assets/mission.jpg" alt="mission-card">
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  #app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .card {
    display: flex;
    width: 60%;
    padding: 20px;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    margin-bottom: 20px;
    margin-top: 30px;
  }

  .content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .text-content {
    max-width: 50%;
    text-align: left;
  }

  img {
    max-width: 50%;
    height: auto;
    width: 40%;
  }

  h3 {
    margin-bottom: 10px;
    margin-left: 10px;
  }

  p {
    margin-left: 10px;
  }
}
</style>
