from Note import Note
from sound_utils import play_chord
from music_utils import (
    play_scale,
    MAJOR_SCALE_INTERVALS,
    MINOR_SCALE_INTERVALS
)

if __name__ == "__main__":
    drone_duration = 5
    drone_notes = [
        Note("C", octave=-6, duration=drone_duration),
        Note("C", octave=-4, duration=drone_duration),
        Note("C", octave=-2, duration=drone_duration),
        Note("C", octave=0, duration=drone_duration),
        Note("C", octave=2, duration=drone_duration),
        Note("C", octave=4, duration=drone_duration),
    ]

    # Play drone
    play_chord(drone_notes)

    # Play a major scale
    # play_scale(scale_intervals=MAJOR_SCALE_INTERVALS, start_note="F", octave=4)
    # play_scale(scale_intervals=MINOR_SCALE_INTERVALS, start_note="F", octave=4)