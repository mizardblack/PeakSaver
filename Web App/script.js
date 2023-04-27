window.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("button");
  const result = document.getElementById("result");
  const main = document.getElementsByTagName("main")[0];
  let listening = false;
  
  // using speech recogenition API
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (typeof SpeechRecognition !== "undefined") {
    const recognition = new SpeechRecognition();

    const stop = () => {
      button.classList.remove("speaking");
      recognition.stop();
      button.innerHTML = `<i title="Start Listening" class="fa-solid fa-microphone fa-beat fa-lg"></i>`;
    };

    const start = () => {
      button.classList.add("speaking");
      recognition.start();
      button.textContent = "Stop listening";
    };

    const onResult = (event) => {
      result.innerHTML = "";
      for (const res of event.results) {
        const text = document.createTextNode(res[0].transcript);
        const p = document.createElement("p");
        if (res.isFinal) {
          p.classList.add("final");
        }
        p.appendChild(text);
        result.appendChild(p);
        responseTo();
      }
    };
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.addEventListener("result", onResult);
    button.addEventListener("click", (event) => {
      listening ? stop() : start();
      listening = !listening;
    });
  } else {
    button.remove();
    const message = document.getElementById("message");
    message.removeAttribute("hidden");
    message.setAttribute("aria-hidden", "false");
  }

  speak();
});

// text-to-speech funtion
function speak() {
  if ("speechSynthesis" in window) {
    // Speech Synthesis supported 🎉
  } else {
    // Speech Synthesis Not Supported 😣
    alert("Sorry, your browser doesn't support text to speech!");
  }
  let msg = new SpeechSynthesisUtterance();
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
  const response = document.getElementById("response").innerHTML;
  msg.text = response;
  window.speechSynthesis.speak(msg);
}

// response to user's voice command
function responseTo() {
  const response = document.getElementById("response");

  const result = document.getElementById("result");
  console.log(result);
  if (result.firstChild.classList.contains("final")) {
    const command = result.innerHTML.toString().toLowerCase();
    //check if input contains keywords
    console.log(command);
    if (command.includes("predict") || command.includes("how much")) {
      response.innerHTML =
        "Based on historical data, your energy bill the upcoming month will be around $68.79.";
    } else if (
      command.includes("tip") ||
      command.includes("save") ||
      command.includes("suggest")
    ) {
      const tips = [
        "Lower your thermostat by just 1°C to save around 7% of your heating energy and cut an average bill by $50-70 a year.",
        "Lower the hot water temperature to save 8% of your heating energy and cut $50 off an average annual bill.",
        "Replace old lightbulbs with new LED ones, and only keep on the lights you need.",
        "Close windows and doors, insulate pipes and draught-proof around windows, chimneys and other gaps to keep the warm air inside. ",
      ];
      response.innerHTML = `Here, I have some tips on energy management. ${
        tips[Math.floor(Math.random() * tips.length)]
      }`;
    } else {
      response.innerHTML = `I didn't quite get that. You can ask me to predict bill, or give tips on energy management.`;
    }
  }
}

function vibrate() {
  const button = document.getElementById("button");
  button.vibrate(200);
}
