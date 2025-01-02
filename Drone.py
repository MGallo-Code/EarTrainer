from Note import Note
from sound_utils import play_chord

class Drone:
    def __init__(self, note="C", drone_octaves=[-6, -4, -2, 0, 2, 4], volume=0.5, duration=5, delay=0):
        self.notes = [Note(note=note, octave=i, volume=volume, duration=duration, delay=delay) for i in drone_octaves]

    def play(self):
        play_chord(self.notes)