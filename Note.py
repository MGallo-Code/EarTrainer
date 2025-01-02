import numpy as np
import sounddevice as sd
from utils import REFERENCE_OCTAVE, FLAT_KEY, normalize_waveform

class Note:
    def __init__(self, note="C", octave=4, duration=0.5, delay=0):
        self.note = note
        self.octave = octave
        self.duration = duration
        self.delay = delay
        self.frequency = self.get_frequency()
    
    def get_frequency(self):
        """Calculate the frequency of the note."""
        note_name = self.note
        # Convert flat notes to sharp notes
        if note_name in FLAT_KEY:
            note_name = FLAT_KEY[note_name]
        # Validate note...
        if note_name not in REFERENCE_OCTAVE:
            raise ValueError(f"Invalid note: {self.note}")
        # Get note's base frequency and calculate frequency for the given octave
        base_freq = REFERENCE_OCTAVE[note_name]
        octave_offset = self.octave - 4 # Reference is C4
        return base_freq * (2 ** octave_offset)
    
    def get_note_waveform(self, sample_rate=44100):
        """Generate a sine wave for the note."""
        delay_samples = int(sample_rate * self.delay)
        delay_waveform = np.zeros(delay_samples)
        t = np.linspace(0, self.duration, int(sample_rate * self.duration), False)
        waveform = np.sin(2 * np.pi * self.frequency * t)
        waveform *= 0.5  # Scale amplitude to avoid excessive loudness
        return np.concatenate([delay_waveform, waveform])

    def play(self, sample_rate=44100):
        """Play the note."""
        waveform = self.get_note_waveform(sample_rate)
        # Normalize waveform to avoid clipping
        normalized_waveform = normalize_waveform(waveform)
        sd.play(normalized_waveform, samplerate=sample_rate)
        sd.wait()