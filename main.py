# main.py
# Define the main script to test the music classes.

from Drone import Drone
from Note import Note
from sound_utils import play_chord
from music_utils import (
    play_scale,
    MAJOR_SCALE_INTERVALS,
    MINOR_SCALE_INTERVALS
)

if __name__ == "__main__":
    # Testing Note Volume
    Note("C", volume=0.1).play()
    Note("C", volume=0.5).play()
    Note("C", volume=1).play()

    # Play drone
    Drone("C", volume=1).play()

    # Play a major scale
    # play_scale(scale_intervals=MAJOR_SCALE_INTERVALS, start_note="F", octave=4)
    # play_scale(scale_intervals=MINOR_SCALE_INTERVALS, start_note="F", octave=4)