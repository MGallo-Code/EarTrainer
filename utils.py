import numpy as np

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

def normalize_waveform(waveform, target_amplitude=32767):
    """
    Normalize the waveform to the target amplitude.

    :param waveform: The input waveform (numpy array).
    :param target_amplitude: The desired maximum amplitude (default: 32767 for int16 audio).
    :return: Normalized waveform as numpy array.
    """
    max_amplitude = np.max(np.abs(waveform))
    # Avoid division by zero
    if max_amplitude == 0:
        return waveform
    return (waveform / max_amplitude * target_amplitude).astype(np.int16)