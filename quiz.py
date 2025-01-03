# quiz.py
# Define the core quiz functionality for the interval ear training app.

import random
import time

from Note import Note
from music_utils import NOTE_ORDER

###############################################################################
# Intervals
###############################################################################
# Allow multiple valid inputs for each semitone distance.
# For instance, semitone distance = 6 can be typed as "4a", "5d", or "tritone".
# The last item in each tuple is used as a more descriptive or "common" name.
###############################################################################
INTERVAL_MAP = {
    0:  ("0", "unison"),
    1:  ("2m", "minor 2nd"),
    2:  ("2", "major 2nd"),
    3:  ("3m", "minor 3rd"),
    4:  ("3", "major 3rd"),
    5:  ("4", "perfect 4th"),
    6:  ("4a", "5d", "tritone"), # or diminished 5th / augmented 4th
    7:  ("5", "perfect 5th"),
    8:  ("6m", "5a", "minor 6th"),
    9:  ("6", "major 6th"),
    10: ("7m", "minor 7th"),
    11: ("7", "major 7th"),
    12: ("8", "octave"),
}

# For convenience, define a helper function to retrieve all valid user inputs
# for a given semitone distance.
def get_interval_labels(semitone_distance: int):
    """
    Returns the set of valid labels (strings) for the given semitone distance.
    """
    entry = INTERVAL_MAP[semitone_distance]
    # Convert the tuple to a set for easy membership checking
    return set(entry)


###############################################################################
# Quiz Modes
###############################################################################
# Each mode is a dictionary specifying:
#   - 'description': A string describing this mode for the user
#   - 'intervals': A list of integers representing the semitones tested
#   - 'octave_range': A tuple (min_octave, max_octave) for random octave selection
###############################################################################
MAJOR_SCALE_INTERVALS = [2, 4, 5, 7, 9, 11, 12]  # Common major-scale intervals
FULL_SINGLE_OCTAVE = list(range(1, 13))          # 1 through 12 semitones

QUIZ_MODES = {
    "basic_single_octave": {
        "description": "Major scale intervals (single octave).",
        "intervals": MAJOR_SCALE_INTERVALS,
        "octave_range": (4, 4),
    },
    "full_single_octave": {
        "description": "Any interval from 1 to 12 semitones (single octave).",
        "intervals": FULL_SINGLE_OCTAVE,
        "octave_range": (4, 4),
    },
    "basic_multiple_octaves": {
        "description": "Major scale intervals, in any octave between 3 and 5.",
        "intervals": MAJOR_SCALE_INTERVALS,
        "octave_range": (3, 5),
    },
    # Feel free to add additional modes here...
}


###############################################################################
# Core Interval-Playing Function
###############################################################################
def play_interval(
    base_note: str,
    semitone_distance: int,
    octave: int = 4,
    volume: float = 0.5,
    duration: float = 1.0,
    sample_rate: int = 44100
):
    """
    Plays the base note, followed by the note 'semitone_distance' above it.
    """
    base_note_obj = Note(
        note=base_note,
        octave=octave,
        volume=volume,
        duration=duration,
    )
    base_index = NOTE_ORDER.index(base_note_obj.note)
    new_index = base_index + semitone_distance
    new_octave = octave + (new_index // 12)
    new_note_name = NOTE_ORDER[new_index % 12]

    interval_note_obj = Note(
        note=new_note_name,
        octave=new_octave,
        volume=volume,
        duration=duration,
    )

    # Play the base note, wait, then play the interval note
    base_note_obj.play(sample_rate=sample_rate)
    time.sleep(0.2)
    interval_note_obj.play(sample_rate=sample_rate)


###############################################################################
# Interactive Quiz Function
###############################################################################
def start_interval_quiz(
    quiz_mode: str,
    rounds: int = 5,
    sample_rate: int = 44100
):
    """
    Run an interval quiz in the chosen quiz mode, for a set number of rounds.
    """
    config = QUIZ_MODES[quiz_mode]
    intervals_for_mode = config["intervals"]
    min_octave, max_octave = config["octave_range"]

    print("\n========================================")
    print(f"STARTING QUIZ: {quiz_mode}")
    print(f"Description: {config['description']}")
    print("========================================")

    score = 0
    round_number = 0

    # Continue until the user types "menu" or "exit".
    # Keep a loop going but track how many rounds so far.
    while True:
        # If reached the specified number of rounds, ask if user wants to continue.
        if round_number == rounds:
            print(f"\nYou've completed {rounds} rounds of '{quiz_mode}' mode.")
            user_choice = input("Type 'c' to continue, 'menu' for mode selection, or 'exit' to quit > ").strip().lower()
            if user_choice == "menu":
                break
            elif user_choice == "exit":
                return  # Exit quiz entirely
            elif user_choice == "c":
                # Keep going!
                pass
            else:
                break

        round_number += 1
        print(f"\nRound {round_number} - Guess the interval!")
        # Random note & interval
        base_note = random.choice(NOTE_ORDER)
        semitone_distance = random.choice(intervals_for_mode)
        octave = random.randint(min_octave, max_octave)

        # Set answer to "r" for repeating the value to enter the loop
        user_answer = "r"

        while user_answer == "r":
            # Play interval
            play_interval(base_note, semitone_distance, octave=octave, sample_rate=sample_rate)

            # Show user some helpful info
            print(f"Base Note: {base_note} (Octave {octave})")

            user_answer = input("Which interval was played? (Possible answers: e.g., '2m', '3', '5d', etc.)\n"
                                "Or type 'r' to repeat the interval, 'menu' to return to main menu, 'exit' to quit > ").strip().lower()
            if user_answer == "menu":
                break
            if user_answer == "exit":
                return

        # Check correctness
        valid_labels = get_interval_labels(semitone_distance)  # e.g. {"4a", "5d", "tritone"}
        # If the user typed something in that set, it's correct
        if user_answer in valid_labels:
            print("Correct!")
            score += 1
        else:
            # Show all valid labels plus the "common name" from the last entry in the tuple
            # For instance, if 6: ("4a", "5d", "tritone"), the "most descriptive" might be "tritone"
            descriptive_name = INTERVAL_MAP[semitone_distance][-1]  # the last item
            print(f"Incorrect. Valid answers were {', '.join(valid_labels)} ({descriptive_name})")

        time.sleep(0.5)

    # End of quiz for this mode
    print("\n========================================")
    print(f"Quiz for mode '{quiz_mode}' complete.")
    print(f"Final score: {score} out of {round_number}")
    print("Returning to main menu...")
    print("========================================\n")


###############################################################################
# Main Menu Function
###############################################################################
def run_quiz_app(sample_rate: int = 44100):
    """
    Main loop to present a menu of quiz modes and let user choose
    or exit the application.
    """
    while True:
        print("====================================================")
        print(" Welcome to the Interval Quiz Main Menu ")
        print("====================================================")
        print("Select a quiz mode by typing the corresponding number:")
        mode_keys = list(QUIZ_MODES.keys())

        for i, mode_key in enumerate(mode_keys, start=1):
            print(f"{i}. {mode_key} - {QUIZ_MODES[mode_key]['description']}")

        print(f"{len(mode_keys) + 1}. Exit the Quiz App")
        print("----------------------------------------------------")

        choice = input("Your choice: ").strip().lower()
        if choice.isdigit():
            choice_num = int(choice)
            if 1 <= choice_num <= len(mode_keys):
                # Valid quiz mode selection
                selected_mode = mode_keys[choice_num - 1]

                # Ask how many rounds they'd like
                rounds_input = input("How many rounds would you like to attempt? (default 5) > ").strip()
                if rounds_input.isdigit():
                    rounds = int(rounds_input)
                else:
                    rounds = 5

                # Start the quiz
                start_interval_quiz(selected_mode, rounds=rounds, sample_rate=sample_rate)

            elif choice_num == len(mode_keys) + 1:
                print("Exiting the Quiz App. Goodbye!")
                return
            else:
                print("Invalid selection. Please try again.")
        else:
            if choice == "exit":
                print("Exiting the Quiz App. Goodbye!")
                return
            else:
                print("Invalid input. Please type a number corresponding to your choice.")