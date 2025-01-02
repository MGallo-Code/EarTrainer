import numpy as np
import sounddevice as sd

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

def play_chord(notes, sample_rate=44100):
    """
    Play multiple notes simultaneously as a chord.

    :param notes: List of Note objects to play.
    :param sample_rate: Sample rate in Hz (default is 44100).
    """
    waveforms = [note.get_note_waveform(sample_rate) for note in notes]
    max_length = max(len(wf) for wf in waveforms)
    combined_waveform = np.zeros(max_length)

    # Sum waveforms and normalize
    for wf in waveforms:
        combined_waveform[:len(wf)] += wf

    normalized_chord = normalize_waveform(combined_waveform)
    sd.play(normalized_chord, samplerate=sample_rate)
    sd.wait()