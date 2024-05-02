const audioSample = //Copy from audioSample file as is

document.getElementById("captureButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.runtime.sendMessage({ type: "capture_screen", tabId });
  });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const { type } = message;
  console.log("Message received in content script", type);
  if (type === "text_response") {
    const newElement = document.createElement("div");
    newElement.textContent = "Operation Completed!";
    document.body.appendChild(newElement);
  }
  if (type === "image_data") {
    const { imageUri } = message;
    console.log("Image data received in content script");
    injectScreenshotDownload(imageUri);
    injectAudioPlayer(`data:audio/mp3;base64,${audioSample}`)
  }
  if (type === "audio_data") {
    
    injectAudioPlayer("test");
  }
});

function injectScreenshotDownload(imageUri) {
  let filename = "captured_tab_" + Date.now() + ".jpeg";
  
  let a = document.createElement("a");
  a.href = imageUri;
  a.download = filename;
  a.textContent = "Download screenshot";
  document.body.appendChild(a);
}

function injectAudioPlayer(audioContent) {
  const audioElement = document.createElement("audio");
  audioElement.controls = true;
  audioElement.src = audioContent;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.bottom = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.backgroundColor = "#f5f5f5";
  container.style.padding = "10px";
  container.appendChild(audioElement);

  document.body.appendChild(container);
}