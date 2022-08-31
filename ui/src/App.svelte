<script>
  import Sentiment from "sentiment";
  import * as sm from "./styleManager";

  const sentiment = new Sentiment();
  let message = "";

  const ws = new WebSocket("ws://localhost:8888", "protocolOne");
  ws.onmessage = (event) => {
    console.log(event.data);
    const script = JSON.parse(event.data).transcript;
    message = script;
    const result = sentiment.analyze(message);
    if (result.comparative > 0) {
      // positive
      sm.set("bg", "lightgreen");
    } else if (result.comparative < 0) {
      // negative
      sm.set("bg", "red");
    } else {
      sm.del("bg");
    }
  };
</script>

<main>
  <h1>they said:</h1>
  <h2>{message}</h2>
</main>

<style>
  :root {
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;

    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: var(--bg, #242424);

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }
</style>
