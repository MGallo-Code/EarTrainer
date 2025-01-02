import sounddevice as sd
import numpy as np

from Note import Note

def play_chord(notes, sample_rate=44100):
    """Play a chord (multiple notes simultaneously)."""
    waveforms = [note.get_note_waveform(sample_rate) for note in notes]
    max_length = max(len(wf) for wf in waveforms)
    combined_waveform = np.zeros(max_length)

    # Sum waveforms and normalize
    for wf in waveforms:
        combined_waveform[:len(wf)] += wf

    combined_waveform /= len(waveforms)  # Scale by the number of notes
    # combined_waveform *= 0.5  # Additional scaling to control volume
    sd.play(combined_waveform, samplerate=sample_rate)
    sd.wait()

# Example usage
if __name__ == "__main__":
    # Play a single note
    Note("C", 4).play()

    # Play a chord
    play_chord([Note("C", 4), Note("E", 4), Note("G", 4)])
    play_chord([Note("C", 4), Note("Eb", 4), Note("G", 4)])