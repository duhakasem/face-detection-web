const video = document.getElementById('video');

    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }

    async function loadModels() {
      await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
    }

    video.addEventListener('play', () => {
      const canvas = document.getElementById('overlay');
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions()
        );

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
      }, 100);
    });

    loadModels().then(setupCamera);