import express from 'express';
import ffmpeg from 'fluent-ffmpeg';

const app = express(); // initialize express server
app.use(express.json()); // middleware body parser

/**
 * This function takes in a video of any quality and converts it into 360p
 */
app.post('/process-video', (req, res) => {
  // Get path of the input video file from the request body
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  if (!inputFilePath || !outputFilePath) {
    res.status(400).send('Bad Request: Missing file path');
  }

  // use ffmpeg on the input file
  // convert video to 360p
  ffmpeg(inputFilePath)
    .outputOptions('-vf', 'scale=-1:360')
    .on('end', () => {
      res.status(200).send('Processing finished successfully.');
    })
    .on('error', (err) => {
      console.log(`An error occured: ${err.message}`);
      res.status(500).send(`Internal Server Error: ${err.message}`);
    })
    .save(outputFilePath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is now listening on http://localhost:${PORT}`);
});
