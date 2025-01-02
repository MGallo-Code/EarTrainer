import sounddevice as sd
import numpy as np

from Note import Note
from utils import normalize_waveform, NOTE_ORDER, MAJOR_SCALE_INTERVALS, MINOR_SCALE_INTERVALS

def play_chord(notes, sample_rate=44100):
    """Play a chord (multiple notes simultaneously)."""
    waveforms = [note.get_note_waveform(sample_rate) for note in notes]
    max_length = max(len(wf) for wf in waveforms)
    combined_waveform = np.zeros(max_length)

    # Sum waveforms and normalize
    for wf in waveforms:
        combined_waveform[:len(wf)] += wf

    normalized_chord = normalize_waveform(combined_waveform)
    sd.play(normalized_chord, samplerate=sample_rate)
    sd.wait()

def play_scale(scale_intervals=MAJOR_SCALE_INTERVALS, start_note="C", octave=4, duration=0.5, sample_rate=44100):
    """
    Play a scale in a specified octave.
    
    :param scale_intervals: List of intervals for the scale (default is major scale).
    :param start_note: The root note of the scale (default is "C").
    :param octave: The octave to play the scale in (default is 4).
    :param duration: Duration of each note in seconds (default is 0.5).
    :param sample_rate: Sample rate in Hz (default is 44100).
    """
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

if __name__ == "__main__":
    # Play a single note
    Note("C", 4).play()

    # Play a chord
    play_chord([Note("C", 4), Note("E", 4), Note("G", 4)])

    # Play a major scale
    play_scale(scale_intervals=MAJOR_SCALE_INTERVALS, start_note="F", octave=4)
    play_scale(scale_intervals=MINOR_SCALE_INTERVALS, start_note="F", octave=4)