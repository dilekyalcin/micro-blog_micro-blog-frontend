<template>
  <div class="home-container">
    <div class="card-container">
      <div class="card">
        <h1>Stay Curious!</h1>
        <p>Discover stories, thinking, and expertise from writers on any topic.</p>
        <button class="btn-home" @click="getStarted">Get Started</button>
      </div>
    </div>
  </div>
  <div class="trend-section">
    <h2>Trending Articles</h2>

    <div class="trend-card">
      <h3>FLASK</h3>
      <p>
        Flask is a lightweight web framework used for creating web applications in the Python programming language.
        Designed with a minimalist structure, Flask primarily serves as a micro-framework providing essential tools to
        handle HTTP requests and responses. In other words, Flask offers the fundamental building blocks needed to
        create web applications without becoming a large and complex framework.</p>
      <p>Author: dilekyalcin</p>
    </div>

    <div class="trend-card">
      <h3>LLM</h3>
      <p>Statik Large Language Models (LLM) are extensively pre-trained deep learning models on a large amount of
        data. Essentially, it is a series of neural networks consisting of an encoder and a self-attention-enabled
        decoder. The encoder and decoder extract meanings from a sequence of text, understanding relationships between
        words and expressions within it</p>
      <p>Author: yusufyalcin</p>
    </div>

    <div class="trend-card">
      <h3>REACT</h3>
      <p>
        React is a JavaScript library used for creating user interfaces. Developed by Facebook, React has been
        released as open-source. It is specifically designed to efficiently manage user interfaces in web
        applications.</p>
      <p>Author: cangunes</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HomePage',
  methods: {
    getStarted() {
      this.$router.push('/register');
    },
  },
};
</script>

<style scoped>
.home-container {
  text-align: center;
  font-family: 'Poppins', sans-serif;
}

.card {
  background-color:#3A4454;
  padding: 4rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card h1{
  color:white;
}
.card p{
  color: white;
}
.btn-home {
  background-color: #6b4e71;
  border-radius: 2rem;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.trend-section {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.trend-card {
  width: 60%;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 0px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.trend-card h3 {
  color: #333;
}

.trend-card p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}
</style>
