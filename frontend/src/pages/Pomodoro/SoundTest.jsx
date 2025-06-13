import { Howl } from "howler";
import { Button, Box, Typography } from "@mui/material";

const SoundTest = () => {
  // Initialize the sound
  const sound = new Howl({
    src: ["/mixkit-correct-answer-reward-952.wav"], // Ensure this file exists in public/
    volume: 1.0,
    onloaderror: (id, err) => {
      console.error("Sound load error:", err);
    },
    onplayerror: (id, err) => {
      console.error("Sound play error:", err);
    },
  });

  const handlePlaySound = () => {
    sound.play();
  };

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h5" gutterBottom>
        Sound Test with Howler.js
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handlePlaySound}
        sx={{ px: 4, py: 1.5, borderRadius: 4 }}
      >
        Play Sound
      </Button>
    </Box>
  );
};

export default SoundTest;
