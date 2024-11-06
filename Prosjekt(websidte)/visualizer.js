// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Get the canvas and its context
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');

    // Get the audio element
    const audio = document.getElementById('audio');

    // Create an audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create an analyser node
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; // Set the FFT size for frequency data
    const bufferLength = analyser.frequencyBinCount;

    // Create a buffer to store frequency data
    const dataArray = new Uint8Array(bufferLength);

    // Create a media source from the audio element
    const source = audioContext.createMediaElementSource(audio);

    // Connect the audio source to the analyser and the audio context destination (speakers)
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // Set the canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Function to draw the visualizer
    function drawVisualizer() {
        // Request the next frame
        requestAnimationFrame(drawVisualizer);

        // Get the frequency data from the analyser
        analyser.getByteFrequencyData(dataArray);

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set properties for the visualizer (bars)
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        // Loop through the frequency data and draw bars
        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i];

            // Set the color of the bars based on their height
            ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;

            // Draw the bar at the correct position
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            // Move to the next position for the next bar
            x += barWidth + 1;
        }
    }

    // Start drawing the visualizer
    drawVisualizer();
});
