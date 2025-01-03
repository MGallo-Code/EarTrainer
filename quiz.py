# quiz.py
# Define a simple interval quiz program that plays two notes and asks the user to identify the interval.

import random
import time

from Note import Note
from music_utils import NOTE_ORDER

################################################################################
# Interval Dictionaries
################################################################################

# Mapping from semitones to (short label, descriptive name).
# E.g. 2 semitones = "2", "major 2nd"
INTERVAL_MAP = {
    0: ("0", "unison"),
    1: ("2m", "minor 2nd"),
    2: ("2", "major 2nd"),
    3: ("3m", "minor 3rd"),
    4: ("3", "major 3rd"),
    5: ("4", "perfect 4th"),
    6: ("4a", "5d", "tritone"),       # or diminished 5th / augmented 4th
    7: ("5", "perfect 5th"),
    8: ("6m", "5a", "minor 6th"),
    9: ("6", "major 6th"),
    10: ("7m", "minor 7th"),
    11: ("7", "major 7th"),
    12: ("8", "octave"),
}

# Example: intervals used in the major scale (relative to the root),
# typically [2, 4, 5, 7, 9, 11, 12]. We omit 0 (unison) to keep it interesting.
MAJOR_SCALE_INTERVALS = [2, 4, 5, 7, 9, 11, 12]

# Full single octave (1 through 12 semitones).
FULL_SINGLE_OCTAVE_INTERVALS = list(range(1, 13))

################################################################################
# Modes Configuration
################################################################################
# We'll define different "modes" to vary the quiz experience.

QUIZ_MODES = {
    "basic_single_octave": {
        "description": "Major scale intervals (single octave).",
        "intervals": MAJOR_SCALE_INTERVALS,
        "octave_range": (4, 4),  # always octave 4
    },
    "full_single_octave": {
        "description": "Any interval from 1 to 12 semitones (single octave).",
        "intervals": FULL_SINGLE_OCTAVE_INTERVALS,
        "octave_range": (4, 4),  # always octave 4
    },
    "basic_multiple_octaves": {
        "description": "Major scale intervals, but can occur in octaves 3 to 5.",
        "intervals": MAJOR_SCALE_INTERVALS,
        "octave_range": (3, 5),  # random octave between 3 and 5
    },
    # Feel free to add more modes!
}


################################################################################
# Core Interval-Playing Function
################################################################################

def play_interval(base_note: str, semitone_distance: int, octave: int = 4,
                  volume: float = 0.5, duration: float = 1.0,
                  sample_rate: int = 44100):
    """
    Plays the base note, followed by the note semitone_distance above it.

    :param base_note: The root note as a string (e.g., "C", "C#", "Db", "G", etc.).
    :param semitone_distance: The number of semitones above the base_note (e.g. 7 for a perfect 5th).
    :param octave: The octave for the base note (default is 4).
    :param volume: The volume for each note (range 0.0 to 1.0, default is 0.5).
    :param duration: Duration of each note in seconds (default is 1.0).
    :param sample_rate: Sample rate in Hz (default is 44100).
    """
    # Create the Note object for the base note.
    base_note_obj = Note(
        note=base_note,
        octave=octave,
        volume=volume,
        duration=duration,
    )

    # Find base note index in NOTE_ORDER (the Note class automatically handles flats)
    base_index = NOTE_ORDER.index(base_note_obj.note)

    # Calculate the index of the new note
    new_index = base_index + semitone_distance

    # Calculate the new note's octave
    new_octave = octave + (new_index // 12)
    # The note name (sharp notation)
    new_note_name = NOTE_ORDER[new_index % 12]

    # Create the Note object for the interval note
    interval_note_obj = Note(
        note=new_note_name,
        octave=new_octave,
        volume=volume,
        duration=duration,
    )

    # Play the base note, wait briefly, then play the interval note
    base_note_obj.play(sample_rate=sample_rate)
    time.sleep(0.2)  # short gap between notes
    interval_note_obj.play(sample_rate=sample_rate)


################################################################################
# Quiz Logic
################################################################################

def start_interval_quiz(
    rounds: int = 5,
    quiz_mode: str = "basic_single_octave",
    sample_rate: int = 44100
):
    """
    Start an interactive interval quiz in one of the specified modes.

    :param rounds: Number of quiz rounds (default is 5).
    :param quiz_mode: The name of the quiz mode. Options are in QUIZ_MODES dict.
    :param sample_rate: Audio sample rate in Hz (default is 44100).
    """
    if quiz_mode not in QUIZ_MODES:
        raise ValueError(
            f"Invalid quiz_mode '{quiz_mode}'. "
            f"Valid options: {list(QUIZ_MODES.keys())}"
        )

    # Retrieve the configuration for the chosen mode
    config = QUIZ_MODES[quiz_mode]
    intervals_for_mode = config["intervals"]
    min_octave, max_octave = config["octave_range"]

    print("=========================================================")
    print("Welcome to the Interval Quiz!")
    print(f"Mode: {quiz_mode} - {config['description']}")
    print(f"Rounds: {rounds}")
    print("Listen carefully as two notes are played. Then guess the interval.")
    print("Type 'exit' at any time to quit.")
    print("=========================================================\n")

    # Show the user the "input => interval name" mapping for this mode
    print("You will be asked to type a NUMBER corresponding to the interval.")
    print("Here are the intervals possible in this mode:")
    valid_inputs = []  # keep track of valid user entries
    for semitones in intervals_for_mode:
        short_label, descriptive_name = INTERVAL_MAP[semitones]
        print(f"  {short_label} => {descriptive_name}")
        valid_inputs.append(short_label)
    print()

    score = 0

    for i in range(1, rounds + 1):
        print(f"Round {i} of {rounds}...")
        # Pick a random base note and interval
        base_note = random.choice(NOTE_ORDER)
        semitone_distance = random.choice(intervals_for_mode)
        # Random octave if allowed (e.g. basic_multiple_octaves)
        octave = random.randint(min_octave, max_octave)

        # Play the interval
        play_interval(base_note, semitone_distance, octave=octave, sample_rate=sample_rate)

        # Prompt user
        user_answer = input(
            "Which interval was played? (type the NUMBER corresponding to the interval) > "
        ).strip().lower()

        if user_answer == "exit":
            print("\nExiting quiz.")
            break
        
        # Validate input
        if user_answer not in valid_inputs:
            print("Invalid input. Please type one of:", valid_inputs)
            continue

        # Compare the user’s answer to the correct interval
        correct_short_label, correct_name = INTERVAL_MAP[semitone_distance]
        if user_answer == correct_short_label:
            print("Correct!")
            score += 1
        else:
            print(f"Incorrect. The interval was: {correct_short_label} => {correct_name}")

        print("---------------------------------------------------------\n")
        time.sleep(0.5)

    print("=========================================================")
    print(f"Quiz complete. Your final score is {score} out of {rounds}.")
    print("Thank you for participating in the Interval Quiz!")
    print("=========================================================")