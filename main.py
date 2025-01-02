from Note import Note
from music_utils import (
    play_scale,
    MAJOR_SCALE_INTERVALS,
    MINOR_SCALE_INTERVALS
)
from sound_utils import play_chord

if __name__ == "__main__":
    # Play a single note
    Note("C", 4).play()

    # Play a chord
    play_chord([Note("C", 4), Note("E", 4), Note("G", 4)])

    # Play a major scale
    play_scale(scale_intervals=MAJOR_SCALE_INTERVALS, start_note="F", octave=4)
    play_scale(scale_intervals=MINOR_SCALE_INTERVALS, start_note="F", octave=4)