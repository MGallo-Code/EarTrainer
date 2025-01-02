# Define base frequencies for reference octave (C4 to B4)
REFERENCE_OCTAVE = {
    "C": 261.63, "C#": 277.18, "D": 293.66, "D#": 311.13,
    "E": 329.63, "F": 349.23, "F#": 369.99, "G": 392.00,
    "G#": 415.30, "A": 440.00, "A#": 466.16, "B": 493.88,
}
# Define the order of notes in an octave
NOTE_ORDER = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
# Key for converting flat notes to sharp notes
FLAT_KEY = {
    "Db": "C#",
    "Eb": "D#",
    "Gb": "F#",
    "Ab": "G#",
    "Bb": "A#",
}
# Steps in major scale
MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11]
# Steps in minor scale
MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10]

def play_scale(scale_intervals=MAJOR_SCALE_INTERVALS, start_note="C", octave=4, duration=0.5, sample_rate=44100):
    """
    Play a scale in a specified octave.
    
    :param scale_intervals: List of intervals for the scale (default is major scale).
    :param start_note: The root note of the scale (default is "C").
    :param octave: The octave to play the scale in (default is 4).
    :param duration: Duration of each note in seconds (default is 0.5).
    :param sample_rate: Sample rate in Hz (default is 44100).
    """
    # Avoid circular import
    from Note import Note

    # Find the starting note index
    root_index = NOTE_ORDER.index(start_note)

    # Generate notes for the scale
    scale_notes = [
        Note(NOTE_ORDER[(root_index + interval) % 12], 
             octave + ((root_index + interval) // 12), 
             duration=duration) 
        for interval in scale_intervals
    ]

    # Play each note in the scale
    for note in scale_notes:
        note.play(sample_rate=sample_rate)