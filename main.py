from Drone import Drone
from Note import Note
from sound_utils import play_chord
from music_utils import (
    play_scale,
    MAJOR_SCALE_INTERVALS,
    MINOR_SCALE_INTERVALS
)

if __name__ == "__main__":
    # Play drone
    Drone("C").play()

    # Play a major scale
    # play_scale(scale_intervals=MAJOR_SCALE_INTERVALS, start_note="F", octave=4)
    # play_scale(scale_intervals=MINOR_SCALE_INTERVALS, start_note="F", octave=4)