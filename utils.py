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
MAJOR_SCALE_STEPS = [2, 2, 1, 2, 2, 2, 1]
# Steps in minor scale
MINOR_SCALE_STEPS = [2, 1, 2, 2, 1, 2, 2]