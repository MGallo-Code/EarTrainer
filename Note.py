# Note.py
# Define the Note class to represent a musical note and play it using sounddevice.

import numpy as np
import sounddevice as sd

from music_utils import REFERENCE_OCTAVE, FLAT_KEY
from sound_utils import normalize_waveform

class Note:
    def __init__(self, note="C", octave=4, volume=0.5, duration=0.5, delay=0):
        self.note = note
        self.octave = octave
        self.volume = volume
        self.duration = duration
        self.delay = delay
        # Calculate frequency of the note
        self.frequency = self.get_frequency()
    
    def get_frequency(self):
        """
        Calculate the frequency of the note based on the note name and octave.
        """
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
        """
        Generate a sine wave for the note.

        :param sample_rate: Sample rate in Hz (default is 44100).
        """
        delay_samples = int(sample_rate * self.delay)
        delay_waveform = np.zeros(delay_samples)
        t = np.linspace(0, self.duration, int(sample_rate * self.duration), False)
        waveform = np.sin(2 * np.pi * self.frequency * t)
        # Normalize waveform to avoid clipping
        normalized_wave = normalize_waveform(waveform)
        # Apply volume after normalization
        normalized_wave *= self.volume
        return np.concatenate([delay_waveform, normalized_wave]).astype(np.int16)

    def play(self, sample_rate=44100):
        """
        Play the note using sounddevice.
        
        :param sample_rate: Sample rate in Hz (default is 44100).
        """
        waveform = self.get_note_waveform(sample_rate)
        sd.play(waveform, samplerate=sample_rate)
        sd.wait()